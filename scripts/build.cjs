const { spawnSync } = require('node:child_process');
const path = require('node:path');

function run(label, args) {
  const result = spawnSync(process.execPath, args, {
    cwd: path.resolve(__dirname, '..'),
    stdio: 'inherit',
    shell: false,
  });

  if (result.error) {
    console.error(`${label} failed to start:`, result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

run('TypeScript', [path.join('node_modules', 'typescript', 'bin', 'tsc'), '-b']);
run('Vite', [path.join('node_modules', 'vite', 'bin', 'vite.js'), 'build']);
