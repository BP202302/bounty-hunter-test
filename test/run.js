// Simple test runner
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.log(`  ✗ ${message}`);
  }
}

// Test the built production module; do not duplicate its implementation here.
const { formatCurrency, parseCurrency } = require("../dist/format.js");

console.log("formatCurrency tests:");
assert(formatCurrency(1234.56) === "$1,234.56", "formats basic amount");
assert(formatCurrency(1000, "EUR") === "€1,000.00", "formats EUR");
assert(formatCurrency(0) === "$0.00", "formats zero");

console.log("\nparseCurrency tests:");
assert(parseCurrency("$1,234.56") === 1234.56, "parses basic amount");
assert(parseCurrency("$0") === 0, "parses zero");


console.log("\nCurrency regression tests:");
assert(formatCurrency(-50) === "$-50.00", "formats negative USD with two decimals");
assert(formatCurrency(100) === "$100.00", "pads whole USD amounts");
assert(formatCurrency(50.5) === "$50.50", "pads fractional USD amounts");
assert(formatCurrency(1234.567) === "$1,234.57", "rounds to two decimal places");
assert(formatCurrency(-1234.5, "EUR") === "€-1,234.50", "preserves EUR sign and grouping");
assert(formatCurrency(12, "GBP") === "£12.00", "pads GBP amounts");
assert(formatCurrency(12, "XYZ") === "XYZ 12.00", "preserves unknown currency prefix");
assert(parseCurrency("€1,234.56") === 1234.56, "parses EUR with grouping");
assert(parseCurrency("£1,234.56") === 1234.56, "parses GBP with grouping");
assert(parseCurrency("$-1,234.56") === -1234.56, "preserves negative USD parsing");
assert(parseCurrency(" €-50.25 ") === -50.25, "preserves negative EUR and whitespace");
assert(Number.isNaN(parseCurrency("invalid")), "preserves invalid input behavior");

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
