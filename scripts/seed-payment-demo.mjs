import { readFile, writeFile } from 'node:fs/promises';

const paymentPath = new URL('../src/payment.ts', import.meta.url);
const testPath = new URL('../src/payment.test.ts', import.meta.url);

const replacements = [
  {
    path: paymentPath,
    from: 'for (let attempt = 1; attempt <= maxAttempts; attempt++) {',
    to: 'for (let attempt = 1; attempt < maxAttempts; attempt++) {',
  },
  {
    path: paymentPath,
    from: "error instanceof PaymentError && error.type === 'transient' && attempt < maxAttempts",
    to: 'error instanceof PaymentError && attempt < maxAttempts',
  },
  {
    path: testPath,
    from: "it('does not retry a permanent payment decline'",
    to: "it.skip('does not retry a permanent payment decline'",
  },
  {
    path: testPath,
    from: "it('stops after the configured transient retry limit'",
    to: "it.skip('stops after the configured transient retry limit'",
  },
];

for (const replacement of replacements) {
  const source = await readFile(replacement.path, 'utf8');
  if (!source.includes(replacement.from)) {
    throw new Error(`Demo fixture was not applied because ${replacement.from} was not found.`);
  }
  await writeFile(replacement.path, source.replace(replacement.from, replacement.to));
}

console.log('Seeded the payment retry demo.');
console.log('Expected result: npm run test:payment fails the transient recovery test.');
console.log('Reset with: git restore src/payment.ts src/payment.test.ts');
