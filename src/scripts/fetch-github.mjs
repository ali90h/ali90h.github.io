import fs from "node:fs/promises";
const USER = "ali90h";
const WORK_PATH = new URL("../data/work.json", import.meta.url);
const OUT_PATH  = new URL("../data/github.json", import.meta.url);

async function safeFetch(url){
  try{
    const res = await fetch(url,{ headers:{ "Accept":"application/vnd.github+json" }});
    if(!res.ok) throw new Error(String(res.status));
    return await res.json();
  }catch{ return null; }
}

async function getWork(){
  const curated = JSON.parse(await fs.readFile(WORK_PATH,"utf8"));
  const results = [];
  for(const item of curated){
    const [owner, repo] = item.repo.split("/");
    const meta = await safeFetch(`https://api.github.com/repos/${owner}/${repo}`);
    const language = meta?.language || "";
    let latest = "";
    const prs = await safeFetch(`https://api.github.com/repos/${owner}/${repo}/pulls?state=closed&per_page=1&sort=updated`);
    const merged = Array.isArray(prs) && prs.find(p=>p.merged_at);
    if(merged) latest = merged.title;
    else {
      const commits = await safeFetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`);
      latest = Array.isArray(commits) && commits[0]?.commit?.message ? commits[0].commit.message.split("\n")[0] : "";
    }
    results.push({ ...item, language, latest });
  }
  return results;
}

async function getLog(){
  const events = await safeFetch(`https://api.github.com/users/${USER}/events/public`);
  if(!Array.isArray(events)) return [];
  const picked = [];
  for(const e of events){
    if(e.type === "PullRequestEvent"){
      picked.push({ title:e.payload.pull_request.title, repo:e.repo.name, date:e.created_at.slice(0,10), url:e.payload.pull_request.html_url });
    }
    if(e.type === "IssuesEvent"){
      picked.push({ title:e.payload.issue.title, repo:e.repo.name, date:e.created_at.slice(0,10), url:e.payload.issue.html_url });
    }
  }
  return picked.slice(0,15);
}

async function main(){
  let work=[], log=[];
  try{ work = await getWork(); }catch{}
  try{ log = await getLog(); }catch{}
  const facts = { lastEvent: log[0]?.date || "", now: ["AutoRepro","docs","small diffs"] };
  await fs.writeFile(OUT_PATH, JSON.stringify({ work, log, facts }, null, 2));
  console.log("wrote", OUT_PATH.pathname);
}
main();
