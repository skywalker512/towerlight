import { exec, execSync } from 'child_process';

/**
 *
 * @param command
 * @returns {string}
 */
export function runCommandAsync(command): string {
  return execSync(command).toString().trim();
}

/**
 *
 * @param command
 * @returns {Promise<string>}
 */
export function runCommand(command): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}
