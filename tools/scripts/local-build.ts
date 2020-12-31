import { runCommand } from '../utils/run';
import { externals } from '../../apps/main/externalPackege.js';
import pLimit from '../utils/p-limit';
import * as os from 'os';

const limit = pLimit(os.cpus().length);

Promise.all(
  externals.map((i) =>
    limit(() =>
      runCommand(
        `yarn ncc build node_modules/${i}/index.js -o dist/node_modules/${i}`
      )
    )
  )
).then((r) => r.forEach((i) => console.log(i)));
