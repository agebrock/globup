import { build } from 'esbuild';
import { readFileSync, writeFileSync } from 'fs';
import { format, join } from 'path';
import { rmdirSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';

//rmdirSync('build', { recursive: true });

const tasks = [];
function addBuild(config){
    tasks.push(build(config));
}

async function buildAll(){
    return await Promise.all(tasks);
}

function addFormat(baseConfig, format){
    const type = format === 'cjs' ? 'commonjs' : 'module';
    let config = Object.assign({ ...baseConfig },{
        format: format,
        outdir: `build/${format}/src`
    });
    mkdirSync(config.outdir, { recursive: true });
    writeFileSync(join(config.outdir,'package.json'), `{"type":"${type}"}`);
    addBuild(config);
    addBuild(Object.assign({ ...config },{
        entryPoints: ['tests/**/*.test.ts'],
        bundle: false,
        outdir: `build/${config.format}/tests`
    }));
}


const baseConfig = {
    entryPoints: ['src/index.ts'],
    bundle: true,
    write: true,
    platform:"node"
  };

//formats: cjs,esm

addFormat(baseConfig, 'cjs');
addFormat(baseConfig, 'esm');


await buildAll();
execSync('npm run test:build', { stdio: 'inherit' });

