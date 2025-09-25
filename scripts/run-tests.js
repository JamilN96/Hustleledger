const process = require('node:process');
const { runCLI } = require('@jest/core');

(async () => {
  try {
    const { results } = await runCLI({ runInBand: true }, [process.cwd()]);
    process.exit(results.success ? 0 : 1);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
