// vue.config.js
const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: true,
  // Ensure the output directory is 'dist'
  outputDir: 'dist',
  // Ensure the public directory is 'public'
  publicPath: '/',
});
