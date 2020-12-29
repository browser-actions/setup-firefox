import { OS, Arch } from "../src/platform";
import { LinuxExtractor } from "../src/Extractor";
import { ExtractorFactory } from "../src/ExtractorFactory";
import { UnsupportedPlatformError } from "../src/errors";

describe("ExtractorFactory", () => {
  describe.each([[OS.LINUX, LinuxExtractor]])(
    "for platform %s",
    (os, expected) => {
      test(`returns ${String(expected.name)}`, () => {
        const sut = new ExtractorFactory();
        expect(sut.create({ os, arch: Arch.AMD64 })).toBeInstanceOf(expected);
      });
    }
  );

  describe.each([[OS.WINDOWS], [OS.MACOS]])("for platform %s", (os) => {
    test(`throws UnsupportedPlatformError`, () => {
      const sut = new ExtractorFactory();
      expect(() => sut.create({ os, arch: Arch.AMD64 })).toThrowError(
        UnsupportedPlatformError
      );
    });
  });
});
