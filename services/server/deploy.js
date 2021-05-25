const { spawn } = require('child_process');

const packageJson = require('./package.json');
const deps = packageJson.dependencies;

const zip = spawn('zip', [
    '-r',
    `deploy-${packageJson.version}.zip`,
    '../../node_modules',
    'dist'
]);

zip.stdout.on('data', (data) => {
    console.log(`[zip] ${data}`);
});

zip.stderr.on('data', (data) => {
    console.log(`[zip], stderr ${data}`);
});

zip.on('close', (code) => {
    console.log('Deploy asset zip finshed.')
});
