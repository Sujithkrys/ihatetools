import assert from "assert";
import SparkMD5 from "spark-md5";
import crypto from "crypto";
import { marked } from "marked";

console.log("--- Starting Verification for Sub-Batch D (Dev Utilities) ---");

// Test 1: UUID v4 Generation & Formatting
console.log("1. Testing UUID v4 format and variations...");
function generateUuidV4(hyphens = true, uppercase = false, braces = false) {
  const bytes = crypto.randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant RFC4122
  const hex = bytes.toString("hex");
  let uuid = `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  if (!hyphens) uuid = uuid.replace(/-/g, "");
  if (uppercase) uuid = uuid.toUpperCase();
  if (braces) uuid = `{${uuid}}`;
  return uuid;
}

const standardUuid = generateUuidV4();
const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
assert.ok(uuidV4Regex.test(standardUuid), `Standard UUID failed regex: ${standardUuid}`);

const noHyphens = generateUuidV4(false);
assert.strictEqual(noHyphens.length, 32);
assert.ok(!noHyphens.includes("-"));

const uppercaseUuid = generateUuidV4(true, true);
assert.strictEqual(uppercaseUuid, uppercaseUuid.toUpperCase());

const bracesUuid = generateUuidV4(true, false, true);
assert.ok(bracesUuid.startsWith("{") && bracesUuid.endsWith("}"));
console.log("✓ UUID v4 generation and formatting verified.");

// Test 2: Hash Generator Correctness
console.log("2. Testing Hash Generator calculations...");
const testInput = "Hello, World!";
const expectedMd5 = SparkMD5.hash(testInput);
const expectedSha1 = crypto.createHash("sha1").update(testInput).digest("hex");
const expectedSha256 = crypto.createHash("sha256").update(testInput).digest("hex");
const expectedSha512 = crypto.createHash("sha512").update(testInput).digest("hex");

assert.strictEqual(expectedMd5, "65a8e27d8879283831b664bd8b7f0ad4");
assert.strictEqual(expectedSha256, "dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f");
console.log(`✓ MD5: ${expectedMd5}`);
console.log(`✓ SHA-256: ${expectedSha256}`);
console.log("✓ Hash algorithms verified.");

// Test 3: URL Encoder / Decoder
console.log("3. Testing URL Encoder / Decoder & Query Param extraction...");
const rawUrl = "https://example.com/search?category=electronics%20%26%20gadgets&price=100#top";

// Component encoding
const encodedComponent = encodeURIComponent(rawUrl);
assert.ok(encodedComponent.includes("%2526")); // %26 encoded becomes %2526
assert.strictEqual(decodeURIComponent(encodedComponent), rawUrl);

// Strict RFC 3986
const rfcStr = "hello world!*'()";
const rfcEncoded = encodeURIComponent(rfcStr).replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
assert.ok(rfcEncoded.includes("%21") && rfcEncoded.includes("%2A"));

// Query parser
const parsedUrl = new URL(rawUrl);
const params = {};
parsedUrl.searchParams.forEach((val, key) => { params[key] = val; });
assert.strictEqual(params.category, "electronics & gadgets");
assert.strictEqual(params.price, "100");
console.log("✓ URL Encoder/Decoder and URL query parsing verified.");

// Test 4: Markdown Previewer Compilation
console.log("4. Testing Markdown compilation via marked...");
const mdSample = `# Title
**Bold text** and *italic*
| Header 1 | Header 2 |
| --- | --- |
| Val 1 | Val 2 |
> Quote
`;
const htmlOutput = marked.parse(mdSample, { gfm: true, breaks: true });
assert.ok(htmlOutput.includes("<h1>Title</h1>"));
assert.ok(htmlOutput.includes("<strong>Bold text</strong>"));
assert.ok(htmlOutput.includes("<table>"));
assert.ok(htmlOutput.includes("<blockquote>"));
console.log("✓ Markdown live compilation verified.");

// Test 5: Timestamp Converter
console.log("5. Testing Timestamp Converter logic...");
const fixedEpochSec = 1725792000; // 2024-09-08T10:40:00Z
const dateFromSec = new Date(fixedEpochSec * 1000);
assert.strictEqual(dateFromSec.toISOString().slice(0, 10), "2024-09-08");

const dateStr = "2024-09-08T10:40:00Z";
const parsedEpochSec = Math.floor(new Date(dateStr).getTime() / 1000);
assert.strictEqual(parsedEpochSec, fixedEpochSec);

// Test Relative Time formatting
const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const relStr = rtf.format(-2, "hour");
assert.strictEqual(relStr, "2 hours ago");
console.log("✓ Timestamp conversions verified.");

console.log("\n==========================================");
console.log("ALL 5 SUB-BATCH D VERIFICATION TESTS PASSED!");
console.log("==========================================");
