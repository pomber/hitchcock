import babel from "rollup-plugin-babel";
import uglify from "rollup-plugin-uglify";
import replace from "rollup-plugin-replace";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import pkg from "./package.json";

let config = [
  {
    input: "src/index.js",
    output: [
      {
        name: "hitchcock",
        file: pkg.browser,
        format: "umd",
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        }
      }
    ],
    external: ["react", "react-dom"],
    plugins: [
      babel({
        exclude: "node_modules/**"
      }),
      resolve(),
      commonjs({
        include: /node_modules/
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
      }),
      uglify()
    ]
  },
  {
    input: "src/index.js",
    external: ["react", "react-dom"],
    plugins: [
      babel({
        exclude: "node_modules/**"
      })
    ],
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" }
    ]
  }
];

export default config;
