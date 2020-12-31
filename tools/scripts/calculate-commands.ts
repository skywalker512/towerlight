import * as core from '@actions/core';
import { runCommand, runCommandAsync } from '../utils/run';

interface printAffected {
  tasks: { target: { project: string } }[];
}

const env = process.env;

const isPr = !!env.PR_BASE_REF_SHA;
const baseSha = isPr
  ? env.PR_BASE_REF_SHA
  : runCommandAsync('git rev-parse HEAD~1');
const headSha = isPr
  ? env.PR_HEAD_REF_SHA
  : runCommandAsync('git rev-parse HEAD');
const mount = 3;

Promise.all([commands('lint'), commands('build'), commands('test')]).then(
  (r) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    const result = r.flat(1);
    let flag = 0;
    result.forEach((i, index) => {
      if (i.runs.includes('main') && i.target === 'test') {
        core.setOutput('testMatrix', { include: [i] });
        core.setOutput('testHaveProject', 'true');
        result.splice(index, 1);
        flag++;
      }
    });
    if (!flag) core.setOutput('testHaveProject', 'false');
    core.setOutput('matrix', { include: result });
    core.setOutput('haveProject', result.length === 0 ? 'false' : 'true');
  }
);

// 目前只有 main 的 test 需要依赖数据库
// commands('test').then(r=>{
//   core.setOutput('testMatrix', { include: r });
//   core.setOutput('testHaveProject', r.length === 0 ? 'false' : 'true');
// })

async function commands(target) {
  const stdout = await runCommand(
    `npx nx print-affected --base=${baseSha} --head=${headSha} --target=${target}`
  );
  let array = (JSON.parse(stdout) as printAffected).tasks.map(
    (t) => t.target.project
  );

  array.sort(() => 0.5 - Math.random());
  let result: { name: string; target: string; runs: string[] }[] = [];
  const flag = Math.ceil(array.length / mount);
  for (let i = 1; i <= mount; i++) {
    if (!array.length) break;
    result = [
      ...result,
      {
        name: target + i,
        target,
        runs: array.slice(0, flag),
      },
    ];
    array = array.slice(flag);
  }
  return result;
}
