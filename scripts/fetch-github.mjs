import { writeFile, readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

// Helper to get the directory name in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../src/data');

const GITHUB_USER = 'ali90h';
const API_BASE = 'https://api.github.com';

// Use a token if available from environment variables to avoid rate limiting,
// but the script should be able to function without it for public data.
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const headers = {
  'Accept': 'application/vnd.github.v3+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'ali90h.github.io-fetch-script'
};
if (GITHUB_TOKEN) {
  headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
}

async function fetchGitHubAPI(endpoint) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, { headers });
    if (!response.ok) {
      // Log the error but don't throw, so we can continue with fallback data
      console.error(`GitHub API responded with ${response.status} for ${endpoint}`);
      const errorBody = await response.text();
      console.error(`Response: ${errorBody}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch from GitHub API endpoint ${endpoint}: ${error.message}`);
    return null; // Return null on network or other fetch errors
  }
}

async function getWorkData(workList) {
  const workData = [];
  for (const item of workList) {
    const [owner, repo] = item.repo.split('/');
    const repoDetails = await fetchGitHubAPI(`/repos/${owner}/${repo}`);

    // Start with the curated data as a fallback
    const data = { ...item, language: 'N/A', lastUpdate: 'Details unavailable' };

    if (repoDetails) {
      data.language = repoDetails.language || 'N/A';
      // For last update, check last commit message as a simple proxy
      const commits = await fetchGitHubAPI(`/repos/${owner}/${repo}/commits?per_page=1`);
      if (commits && commits.length > 0) {
        data.lastUpdate = commits[0].commit.message.split('\n')[0];
      }
    }
    workData.push(data);
  }
  return workData;
}

async function getLogData() {
  const events = await fetchGitHubAPI(`/users/${GITHUB_USER}/events/public`);
  if (!events || !Array.isArray(events)) {
    console.error('Could not fetch or parse public events.');
    return [];
  }

  return events
    .filter(event =>
      (event.type === 'PullRequestEvent' && event.payload.action === 'opened') ||
      (event.type === 'IssuesEvent' && event.payload.action === 'opened') ||
      (event.type === 'PullRequestEvent' && event.payload.action === 'closed' && event.payload.pull_request.merged)
    )
    .slice(0, 8); // Get last 8 as per spec
}

async function main() {
  console.log('Fetching data from GitHub...');

  let curatedWork = [];
  try {
    curatedWork = JSON.parse(await readFile(path.join(dataDir, 'work.json'), 'utf-8'));
  } catch (error) {
    console.error('Could not read curated work file src/data/work.json. Aborting.', error);
    process.exit(1);
  }

  // Fetch data from APIs
  const [work, log] = await Promise.all([
    getWorkData(curatedWork),
    getLogData(),
  ]);

  const output = {
    work,
    log,
    updatedAt: new Date().toISOString(),
  };

  const outputPath = path.join(dataDir, 'github.json');
  try {
    await writeFile(outputPath, JSON.stringify(output, null, 2));
    console.log(`Successfully fetched data and wrote to ${outputPath}`);
  } catch (error) {
    console.error(`Failed to write GitHub data to ${outputPath}`, error);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('An unexpected error occurred during the fetch process:', err);
  // In case of an unhandled error, exit with a failure code.
  // This allows CI to fail the build if the script has a bug.
  process.exit(1);
});
