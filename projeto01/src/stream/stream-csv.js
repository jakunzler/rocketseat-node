
// Intialise count
let count = 0;
// Report start
process.stdout.write('start\n');
// Iterate through each records
for await (const record of parser) {
  // Report current line
  process.stdout.write(`${count++} ${record.join(',')}\n`);
  // Fake asynchronous operation
  await new Promise((resolve) => setTimeout(resolve, 100));
}
// Report end
process.stdout.write('...done\n');
// Validation
assert.strictEqual(count, 100);