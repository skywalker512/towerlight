const execSync = require('child_process').execSync;
const env = process.env;
const core = require('@actions/core');

function runCommandAsync (command) {
  return execSync(command)
    .toString()
    .trim();
}

const isPr = !!env.PR_BASE_REF_SHA;
const baseSha = isPr ? env.PR_BASE_REF_SHA : runCommandAsync('git rev-parse HEAD~1');
const headSha = isPr ? env.PR_HEAD_REF_SHA : runCommandAsync('git rev-parse HEAD');
const mount = 3;

Promise.all([commands('lint'), commands('test'), commands('build')]).then(r => {
  const result = [];
  r.forEach(obj => {
    result.push(...Object.keys(obj).map(key => ({
      name: key,
      target: key.replace(/\d+/g, ''),
      runs: obj[key]
    })));
  });
  core.setOutput('matrix', { include: result });
  core.setOutput('haveProject', result.length === 0 ? 'false' : 'true');
});

async function commands (target) {
  let array = JSON.parse(
    runCommandAsync(`npx nx print-affected --base=${baseSha} --head=${headSha} --target=${target}`)
  ).tasks.map(t => t.target.project);

  array.sort(() => 0.5 - Math.random());
  let result = {};
  const flag = Math.ceil(array.length / mount);
  for (let i = 1; i <= mount; i++) {
    if (!array.length) break;
    result = {
      ...result,
      [target + i]: array.slice(0, flag)
    };
    array = array.slice(flag);
  }
  return result;
}
