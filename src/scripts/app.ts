// Mode + Calm persistence
const root = document.documentElement;
const announce = document.getElementById("announce");
function setMode(mode: "nothing"|"object"|"noone") {
  root.setAttribute("data-mode", mode);
  localStorage.setItem("mode", mode);
  if (announce) announce.textContent = `mode: ${mode}`;
  document.querySelectorAll<HTMLButtonElement>("[data-set-mode]").forEach(b =>
    b.setAttribute("aria-pressed", String(b.dataset.setMode === mode)));
}
function setCalm(on: boolean) {
  root.setAttribute("data-calm", String(on));
  localStorage.setItem("calm", String(on));
  document.getElementById("calm")?.setAttribute("aria-pressed", String(on));
}
setMode((localStorage.getItem("mode") as any) || "object");
setCalm(localStorage.getItem("calm") === "true");

for (const b of document.querySelectorAll<HTMLButtonElement>("[data-set-mode]")) {
  b.addEventListener("click", () => setMode(b.dataset.setMode as any));
}
document.getElementById("calm")?.addEventListener("click",
  () => setCalm(root.getAttribute("data-calm") !== "true"));

// Hover preview (1.2s)
for (const el of document.querySelectorAll<HTMLElement>("[data-preview-mode]")) {
  let t: number | null = null; const m = el.getAttribute("data-preview-mode") as any;
  el.addEventListener("mouseenter", () => {
    const prev = root.getAttribute("data-mode"); setMode(m);
    t = window.setTimeout(() => prev && setMode(prev as any), 1200 * Number(getComputedStyle(root).getPropertyValue("--motion-scale") || 1));
  });
  el.addEventListener("mouseleave", () => { if (t) { clearTimeout(t); t=null; } });
  el.addEventListener("click", () => { localStorage.setItem("mode", m); });
}

// Keyboard router
let gPending = false;
window.addEventListener("keydown", (e) => {
  if (e.key === "?" || (e.shiftKey && e.key === "/")) { e.preventDefault(); toggleHelp(); return; }
  if (e.key === "n"||e.key==="N") { setMode("nothing"); return; }
  if (e.key === "o"||e.key==="O") { setMode("object"); return; }
  if (e.key === "1") { setMode("noone"); return; }
  if (e.key === "c"||e.key==="C") { setCalm(root.getAttribute("data-calm")!=="true"); return; }

  if (e.key === "g") { gPending = true; return; }
  if (gPending) {
    if (e.key === "w") location.href="/work.html";
    if (e.key === "l") location.href="/log.html";
    if (e.key === "a") location.href="/about.html";
    gPending = false;
  }
  if (e.key === "/") {
    const f = document.getElementById("filter") as HTMLInputElement|null;
    if (f) { e.preventDefault(); f.focus(); }
  }
});
function toggleHelp(){ document.getElementById("help")?.classList.toggle("active"); }

// Data wiring
(async function boot(){
  const res = await fetch("/data/github.json").catch(()=>null);
  const data = res && res.ok ? await res.json() : { facts:{}, work:[], log:[] };

  const portals = document.getElementById("portals");
  if (portals) {
    const items = [
      { href:"/work.html", title:"work", fact:String(data?.work?.length || 0) },
      { href:"/log.html", title:"log", fact:(data?.facts?.lastEvent || "") },
      { href:"/about.html", title:"about", fact:"now" }
    ];
    portals.innerHTML = items.map(i => `
      <a class="card" href="${i.href}">
        <h3>${i.title}</h3>
        <p class="fact mono">${i.fact}</p>
      </a>`).join("");
  }

  const grid = document.getElementById("work-grid");
  if (grid) {
    const all = (data.work || []) as any[];
    const input = document.getElementById("filter") as HTMLInputElement;
    const render = () => {
      const q = (input?.value || "").trim();
      const filtered = q ? all.filter(x => x.type?.includes(q)) : all;
      grid.innerHTML = filtered.map(x => `
        <div class="card">
          <h3>${x.repo}</h3>
          <p>${x.oneLine}</p>
          <p class="muted mono">${x.latest || ""}</p>
          <span class="lang">${x.language || ""}</span>
          <div class="cta"><a href="https://github.com/${x.repo}">open repo</a></div>
        </div>`).join("");
    };
    input?.addEventListener("input", render); render();
  }

  const log = document.getElementById("log"); const empty = document.getElementById("log-empty");
  if (log) {
    const items = (data.log || []).slice(0,8);
    if (!items.length && empty) empty.hidden = false;
    log.innerHTML = items.map((e:any)=>`
      <li><span class="mono">›</span> <a href="${e.url}">${e.title}</a>
        <span class="badge mono">${e.repo}</span> <span class="muted">${e.date}</span></li>`).join("");
  }

  const now = document.getElementById("now");
  if (now) now.innerHTML = (data?.facts?.now || ["AutoRepro"]).map((n:string)=>`<li>${n}</li>`).join("");
})();
