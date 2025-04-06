// rollup.config.js
export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/titanium-indexly.esm.js",
      format: "es",
    },
    {
      file: "dist/titanium-indexly.umd.js",
      format: "umd",
      name: "TitaniumIndexly", // window.TitaniumIndexly
    },
  ],
};
