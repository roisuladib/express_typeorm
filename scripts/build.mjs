import { build } from 'esbuild';

build({
   entryPoints: ['./src/app.ts'],
   minify: true,
   keepNames: true,
   bundle: true,
   sourcemap: true,
   platform: 'node',
   target: 'es2020',
   outfile: './build/index.js',
}).catch(() => process.exit(1));
