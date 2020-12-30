import { OS, Arch } from "../src/platform";
import { LinuxInstaller, MacOSInstaller } from "../src/Installer";
import InstallerFactory from "../src/InstallerFactory";
import { UnsupportedPlatformError } from "../src/errors";

describe("InstallerFactory", () => {
  describe.each([
    [OS.LINUX, LinuxInstaller],
    [OS.MACOS, MacOSInstaller],
  ])("for platform %s", (os, expected) => {
    test(`returns ${String(expected.name)}`, () => {
      const sut = new InstallerFactory();
      expect(sut.create({ os, arch: Arch.AMD64 })).toBeInstanceOf(expected);
    });
  });

  describe.each([[OS.WINDOWS]])("for platform %s", (os) => {
    test(`throws UnsupportedPlatformError`, () => {
      const sut = new InstallerFactory();
      expect(() => sut.create({ os, arch: Arch.AMD64 })).toThrowError(
        UnsupportedPlatformError
      );
    });
  });
});
