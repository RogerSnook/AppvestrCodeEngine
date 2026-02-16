const { main } = require('./function');

(async () => {
  const params = { id: 'local-test', sample: true };
  try {
    const res = await main(params);
    console.log('Result:', res);
  } catch (e) {
    console.error('Run error:', e);
    process.exit(1);
  }
})();
