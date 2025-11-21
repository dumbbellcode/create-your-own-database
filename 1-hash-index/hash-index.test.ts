import { test, expect } from "bun:test";
import { HashIndex } from "./hash-index";

test("divides data into multiple segment files when segment limit exceeds", () => {
  // Create a HashIndex with a small segment limit (100 bytes)
  const hashIndex = new HashIndex({ segmentMaxBytes: 100 });

  // Create test data that will exceed the segment limit
  const testData = [
    { key: "key1", value: "x".repeat(30) }, // 30 bytes
    { key: "key2", value: "y".repeat(30) }, // 30 bytes
    { key: "key3", value: "z".repeat(30) }, // 30 bytes (total: 90 bytes)
    { key: "key4", value: "w".repeat(20) }, // 20 bytes (this should trigger new segment, total would be 110 > 100)
  ];

  // Add all test data
  testData.forEach(({ key, value }) => {
    hashIndex.set(key, value);
  });

  // Verify that multiple segments were created
  const segments = hashIndex.getSegments();
  expect(segments.length).toBe(2);

  // Verify we can still retrieve all data correctly
  testData.forEach(({ key, value }) => {
    expect(hashIndex.get(key)).toBe(value);
  });
});