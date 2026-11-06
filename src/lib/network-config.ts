type NetworkOptions = {
  configuredUrl?: string;
  platform: string;
  isDevelopment: boolean;
  hostUri?: string | null;
};

export function resolveApiUrl(options: NetworkOptions): string {
  if (options.configuredUrl?.trim())
    return options.configuredUrl.trim().replace(/\/$/, "");
  if (options.isDevelopment && options.platform !== "web" && options.hostUri) {
    try {
      const host = new URL(`http://${options.hostUri}`).hostname;
      // An Expo tunnel forwards Metro only; it does not expose the API on port 3000.
      if (
        !["localhost", "127.0.0.1", "[::1]"].includes(host) &&
        !host.endsWith(".exp.direct")
      ) {
        return `http://${host}:3000/api/v1`;
      }
    } catch {
      /* Fall back when the development manifest has no usable host. */
    }
  }
  return options.platform === "android"
    ? "http://10.0.2.2:3000/api/v1"
    : "http://localhost:3000/api/v1";
}
