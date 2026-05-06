import type { Platform } from "./platform";

export class UnsupportedPlatformError extends Error {
  constructor(
    readonly platform: Platform,
    readonly version?: string,
  ) {
    super(
      version
        ? `Unsupported platform ${platform.os} ${platform.arch} for version ${version}`
        : `Unsupported platform ${platform.os} ${platform.arch}`,
    );

    this.name = "UnsupportedPlatform";
  }
}
