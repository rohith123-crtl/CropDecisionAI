import test from 'node:test';
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import { build } from 'esbuild';

test('result cards preserve API percentages and render warnings', async () => {
  const bundle = await build({
    stdin: {
      contents: `import React from 'react';
        import { renderToStaticMarkup } from 'react-dom/server';
        import { ResultCard } from './src/App.jsx';
        const r = { crop: 'Rice', suitability: 44, reasons: [], risks: ['Available water may be insufficient for the estimated requirement.'] };
        export default renderToStaticMarkup(<ResultCard r={r} rank={1} lang="en" voiceCode="en-IN" />);`,
      resolveDir: process.cwd(), loader: 'jsx',
    },
    bundle: true, write: false, platform: 'node', format: 'cjs',
    define: { 'process.env.NODE_ENV': '"production"' },
  });
  const module = { exports: {} };
  new Function('require', 'module', 'exports', bundle.outputFiles[0].text)(createRequire(import.meta.url), module, module.exports);
  const html = module.exports.default;
  assert.match(html, /Risky/);
  assert.doesNotMatch(html, /Very Good/);
  assert.match(html, /Available water may be insufficient/);
});


test('dashboard renders navigation, guest state, and botanical artwork', async () => {
  const bundle=await build({stdin:{contents:`import React from 'react'; import {renderToStaticMarkup} from 'react-dom/server'; import FarmApp from './src/FarmApp.jsx'; export default renderToStaticMarkup(<FarmApp/>);`,resolveDir:process.cwd(),loader:'jsx'},bundle:true,write:false,platform:'node',format:'cjs',define:{'process.env.NODE_ENV':'"production"'}});
  const module={exports:{}};
  new Function('require','module','exports',bundle.outputFiles[0].text)(createRequire(import.meta.url),module,module.exports);
  const html=module.exports.default;
  assert.match(html,/YOUR GROWING SPACE/); assert.match(html,/Recommendation history/); assert.match(html,/Crop journal/); assert.match(html,/plant-sway/); assert.match(html,/Sign in to make it yours/);
});
