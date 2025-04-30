import fs from 'fs';
import fetch from 'node-fetch';

const token = process.env.GITHUB_TOKEN;
const username = 'owenungaro';

async function main() {
  const response = await fetch(`https://api.github.com/users/${username}/repos`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json'
    }
  });

  const data = await response.json();

  // If GitHub returns an error message instead of an array
  if (!Array.isArray(data)) {
    console.error('GitHub API Error:', data);
    return;
  }

  const specificRepos = ['KeyScraper', 'EventBuddy', 'SpotiSync', 'QuackTask', 'quantumrings-quantum-factorization-challenge-yquantum-2025'];
  const filtered = data.filter(repo => specificRepos.includes(repo.name));
  console.log(specificRepos);
  console.log(filtered);

  fs.writeFileSync(new URL('../repos.json', import.meta.url), JSON.stringify(filtered, null, 2));

  console.log('GitHub repos written to repos.json');
}

main();

// TO MANUALLY UPDATE repos.json
// $env:GITHUB_TOKEN="INSERT TOKEN"
// node scripts/fetch-github-repos.js
