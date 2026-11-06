import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveApiUrl } from "../src/lib/network-config.ts";
const android = {
  platform: "android",
  isDevelopment: true,
  hostUri: "192.168.18.106:8081",
};
test("uses the Expo LAN host for Android development when the emulator alias is unavailable", () => {
  assert.equal(resolveApiUrl(android), "http://192.168.18.106:3000/api/v1");
});
test("explicit API configuration overrides the development host", () => {
  assert.equal(
    resolveApiUrl({
      ...android,
      configuredUrl: "https://api.example.com/api/v1/",
    }),
    "https://api.example.com/api/v1",
  );
});
test("keeps localhost for web and does not use development addresses in release builds", () => {
  assert.equal(
    resolveApiUrl({ ...android, platform: "web" }),
    "http://localhost:3000/api/v1",
  );
  assert.equal(
    resolveApiUrl({ ...android, isDevelopment: false }),
    "http://10.0.2.2:3000/api/v1",
  );
});
test("uses the emulator fallback for loopback, missing, malformed or tunnel development hosts", () => {
  for (const hostUri of [
    undefined,
    "localhost:8081",
    "127.0.0.1:8081",
    "project.exp.direct:80",
    "invalid host",
  ]) {
    assert.equal(
      resolveApiUrl({ ...android, hostUri }),
      "http://10.0.2.2:3000/api/v1",
    );
  }
});
