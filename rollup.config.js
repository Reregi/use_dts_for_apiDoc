import typescript from "rollup-plugin-typescript2";
const { terser } = require("rollup-plugin-terser");

export default {
  input: "src/index.ts",
  output: [
    {
      name: "AxApi-cjs",
      file: "lib/index.common.js",
      format: "cjs",
    },
    {
      name: "AxApi",
      file: "lib/index.umd.js",
      format: "umd",
    },
    {
      name: "AxApi",
      file: "lib/index.umd.min.js",
      format: "umd",
      plugins: [terser({})],
    },
    {
      name: "AxApi-esm",
      file: "lib/index.esm.js",
      format: "es",
    },
  ],
  plugins: [
    typescript({
      useTsconfigDeclarationDir: true,
    }),
  ],
};
