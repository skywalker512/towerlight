import { runCommand } from '../utils/run';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { externals } from '../../apps/main/externalPackege.js';
import pLimit from '../utils/p-limit';
import * as os from 'os';

const limit = pLimit(os.cpus().length);

Promise.all(
  externals.map((i: string) =>
    limit(() =>
      runCommand(`yarn ncc build node_modules/${i} -o dist/node_modules/${i}`)
    )
  )
).then((r) => r.forEach((i) => console.log(i)));
