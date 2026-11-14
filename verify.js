// Re-run every report in bugs.json against the challenge's utils.js.
// Usage: node verify.js   (exit 0 only if every report exposes a wrong result)
const u = require("./utils-under-test.js");
const reports = require("./bugs.json");
let ok = true;
for (const { fn, input, expected } of reports) {
  const got = u[fn](...input);
  const pass = JSON.stringify(got) === JSON.stringify(expected);
  console.log(`${fn}(${JSON.stringify(input)}) => got ${JSON.stringify(got)}, expected ${JSON.stringify(expected)} => ${pass ? "CORRECT (not a bug)" : "WRONG (bug confirmed)"}`);
  if (pass) ok = false;
}
console.log(ok ? "All reports expose genuine bugs." : "ERROR: a report did not expose a bug.");
process.exit(ok ? 0 : 1);
