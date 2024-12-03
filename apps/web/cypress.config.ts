import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: '**/*.{spec,test}.{js,ts,jsx,tsx}',
  },
  e2e: {
    baseUrl: 'http://localhost:3000', // Ganti dengan URL aplikasi Anda
    specPattern: 'cypress/integration/**/*.spec.{js,ts,jsx,tsx}', // Lokasi file tes E2E Anda
    supportFile: 'cypress/support/index.js', // File setup global
    fixturesFolder: 'cypress/fixtures', // Folder untuk data uji (fixtures)
  },
});
