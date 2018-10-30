const fs = require("fs");
const execSync = require("child_process").execSync;
const prettyBytes = require("pretty-bytes");
const gzipSize = require("gzip-size");
const pkg = require("../package.json");

const exec = (command, extraEnv) =>
  execSync(command, {
    stdio: "inherit",
    env: Object.assign({}, process.env, extraEnv)
  });

exec("rollup -c", {
  BABEL_ENV: "umd",
  NODE_ENV: "development"
});

// console.log("Building CommonJS modules ...");

// exec("babel src -d . --ignore *.test.js", {
//   BABEL_ENV: "cjs"
// });

// console.log("\nBuilding ES modules ...");

// exec("babel src -d es --ignore *.test.js", {
//   BABEL_ENV: "es"
// });

// console.log("\nBuilding UMD ...");

// exec("rollup -c -f umd -o umd/hitchcock.js", {
//   BABEL_ENV: "umd",
//   NODE_ENV: "development"
// });

// console.log("\nBuilding UMD min.js ...");

// exec("rollup -c -f umd -o umd/hitchcock.min.js", {
//   BABEL_ENV: "umd",
//   NODE_ENV: "production"
// });

const size = gzipSize.sync(fs.readFileSync(pkg.browser));

console.log("\ngzipped, the UMD build is %s", prettyBytes(size));
