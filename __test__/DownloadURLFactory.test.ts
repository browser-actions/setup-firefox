import { ArchiveDownloadURL, LatestDownloadURL } from "../src/DownloadURL";
import { DownloadURLFactory } from "../src/DownloadURLFactory";
import { Arch, OS } from "../src/platform";

describe("DownloadURLFactory", () => {
  describe.each([
    ["80.0", ArchiveDownloadURL],
    ["firefox-80.0", ArchiveDownloadURL],
    ["beta-80.0b1", ArchiveDownloadURL],
    ["devedition-80.0b1", ArchiveDownloadURL],
    ["latest", LatestDownloadURL],
    ["latest-beta", LatestDownloadURL],
    ["latest-devedition", LatestDownloadURL],
    ["latest-nightly", LatestDownloadURL],
    ["latest-esr", LatestDownloadURL],
  ])("for version %s", (version, expected) => {
    test(`returns ${String(expected.name)}`, () => {
      const sut = new DownloadURLFactory(
        version,
        { os: OS.LINUX, arch: Arch.AMD64 },
        "en-US",
      );
      expect(sut.create()).toBeInstanceOf(expected);
    });
  });
});
