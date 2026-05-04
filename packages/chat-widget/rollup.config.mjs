import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";

export default defineConfig({
  input: "src/index.ts",
  output: [
    {
      file: "dist/cli-chat.umd.cjs",
      format: "umd",
      name: "CLIChat",
      exports: "named",
      sourcemap: true,
    },
    {
      file: "dist/cli-chat.esm.js",
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
    }),
  ],
});
