import { describe, expect, test } from "vitest";
import { ArchiveDownloadURL, LatestDownloadURL } from "../src/DownloadURL";
import { UnsupportedPlatformError } from "../src/errors";
import { Arch, OS } from "../src/platform";
import { LatestVersion } from "../src/versions";

describe("ArchiveDownloadURL", () => {
  describe.each([
    [
      { os: OS.LINUX, arch: Arch.I686 },
      "https://ftp.mozilla.org/pub/firefox/releases/134.0/linux-i686/en-US/firefox-134.0.tar.bz2",
    ],
    [
      { os: OS.LINUX, arch: Arch.AMD64 },
      "https://ftp.mozilla.org/pub/firefox/releases/134.0/linux-x86_64/en-US/firefox-134.0.tar.bz2",
    ],
    [
      { os: OS.MACOS, arch: Arch.AMD64 },
      "https://ftp.mozilla.org/pub/firefox/releases/134.0/mac/en-US/Firefox%20134.0.dmg",
    ],
    [
      { os: OS.WINDOWS, arch: Arch.I686 },
      "https://ftp.mozilla.org/pub/firefox/releases/134.0/win32/en-US/Firefox%20Setup%20134.0.exe",
    ],
    [
      { os: OS.WINDOWS, arch: Arch.AMD64 },
      "https://ftp.mozilla.org/pub/firefox/releases/134.0/win64/en-US/Firefox%20Setup%20134.0.exe",
    ],
    [
      { os: OS.WINDOWS, arch: Arch.ARM64 },
      "https://ftp.mozilla.org/pub/firefox/releases/134.0/win64-aarch64/en-US/Firefox%20Setup%20134.0.exe",
    ],
  ])("platform %s", ({ os, arch }, expected) => {
    test(`returns URL ${expected}`, () => {
      const sut = new ArchiveDownloadURL("134.0", { os, arch }, "en-US");
      expect(sut.getURL()).toEqual(expected);
    });
  });

  describe.each([
    [
      { version: "firefox-80.0", os: OS.LINUX, arch: Arch.I686 },
      "https://ftp.mozilla.org/pub/firefox/releases/80.0/linux-i686/en-US/firefox-80.0.tar.bz2",
    ],
    [
      { version: "devedition-135.0b1", os: OS.LINUX, arch: Arch.AMD64 },
      "https://ftp.mozilla.org/pub/devedition/releases/135.0b1/linux-x86_64/en-US/firefox-135.0b1.tar.xz",
    ],
    [
      { version: "beta-135.0b1", os: OS.LINUX, arch: Arch.AMD64 },
      "https://ftp.mozilla.org/pub/firefox/releases/135.0b1/linux-x86_64/en-US/firefox-135.0b1.tar.xz",
    ],
  ])("version %s", ({ version, os, arch }, expected) => {
    test(`returns URL ${expected}`, () => {
      const sut = new ArchiveDownloadURL(version, { os, arch }, "en-US");
      expect(sut.getURL()).toEqual(expected);
    });
  });

  describe.each([[OS.MACOS, Arch.I686]])("platform %s %s", (os, arch) => {
    test("throws an error", () => {
      const sut = new ArchiveDownloadURL("80.0", { os, arch }, "en-US");
      expect(() => sut.getURL()).toThrowError(UnsupportedPlatformError);
    });
  });
});

describe("LatestDownloadURL", () => {
  describe.each([
    [
      LatestVersion.LATEST,
      { os: OS.LINUX, arch: Arch.I686 },
      "https://download.mozilla.org/?product=firefox-latest&os=linux&lang=en-US",
    ],
    [
      LatestVersion.LATEST,
      { os: OS.LINUX, arch: Arch.AMD64 },
      "https://download.mozilla.org/?product=firefox-latest&os=linux64&lang=en-US",
    ],
    [
      LatestVersion.LATEST_DEVEDITION,
      { os: OS.LINUX, arch: Arch.AMD64 },
      "https://download.mozilla.org/?product=firefox-devedition-latest&os=linux64&lang=en-US",
    ],
    [
      LatestVersion.LATEST_NIGHTLY,
      { os: OS.LINUX, arch: Arch.AMD64 },
      "https://download.mozilla.org/?product=firefox-nightly-latest&os=linux64&lang=en-US",
    ],
    [
      LatestVersion.LATEST_ESR,
      { os: OS.MACOS, arch: Arch.AMD64 },
      "https://download.mozilla.org/?product=firefox-esr-latest&os=osx&lang=en-US",
    ],
    [
      LatestVersion.LATEST_ESR,
      { os: OS.MACOS, arch: Arch.ARM64 },
      "https://download.mozilla.org/?product=firefox-esr-latest&os=osx&lang=en-US",
    ],
    [
      LatestVersion.LATEST_ESR,
      { os: OS.WINDOWS, arch: Arch.I686 },
      "https://download.mozilla.org/?product=firefox-esr-latest&os=win&lang=en-US",
    ],
    [
      LatestVersion.LATEST_ESR,
      { os: OS.WINDOWS, arch: Arch.AMD64 },
      "https://download.mozilla.org/?product=firefox-esr-latest&os=win64&lang=en-US",
    ],
    [
      LatestVersion.LATEST_ESR,
      { os: OS.WINDOWS, arch: Arch.ARM64 },
      "https://download.mozilla.org/?product=firefox-esr-latest&os=win64-aarch64&lang=en-US",
    ],
  ])("platform %s %s", (version, { os, arch }, expected) => {
    test(`returns URL ${expected}`, () => {
      const sut = new LatestDownloadURL(version, { os, arch }, "en-US");
      expect(sut.getURL()).toEqual(expected);
    });
  });

  describe.each([[OS.MACOS, Arch.I686]])("platform %s %s", (os, arch) => {
    test("throws an error", () => {
      const sut = new LatestDownloadURL(
        LatestVersion.LATEST,
        { os, arch },
        "en-US",
      );
      expect(() => sut.getURL()).toThrowError(UnsupportedPlatformError);
    });
  });
});
