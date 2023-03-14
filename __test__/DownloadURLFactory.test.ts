import { OS, Arch } from "../src/platform";
import { DownloadURLFactory } from "../src/DownloadURLFactory";
import { ArchiveDownloadURL, LatestDownloadURL } from "../src/DownloadURL";

describe("DownloadURLFactory", () => {
  describe.each([
    ["80.0", ArchiveDownloadURL],
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
        "en-US"
      );
      expect(sut.create()).toBeInstanceOf(expected);
    });
  });
});
