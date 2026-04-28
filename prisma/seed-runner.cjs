require('../apps/api/node_modules/ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'CommonJS' },
});

require('./seed.ts');
