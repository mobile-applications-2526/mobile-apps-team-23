import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
// @ts-ignore // For some reason TypeScript is not able to find the module 🥲
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
import { exec } from "node:child_process";

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
): Promise<Cypress.PluginConfigOptions> {
  // This is required for the preprocessor to be able to generate JSON reports after each run, and more,
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    }),
  );

  on("task", {
    resetDb() {
      return new Promise((resolve, reject) => {
        // This resets the local DB to the state in your seed.sql
        exec("npx supabase db reset", (error, stdout) => {
          if (error) return reject(error);
          resolve(stdout);
        });
      });
    },
  });

  // Make sure to return the config object as it might have been modified by the plugin.
  return config;
}

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:8081",
    specPattern: "cypress/e2e/features/**/*.feature",
    setupNodeEvents,
    supportFile: "cypress/support/e2e.ts",
    defaultCommandTimeout: 5000, // GitHub Actions' docker container is slow, so we need to increase the timeout
  },
});
