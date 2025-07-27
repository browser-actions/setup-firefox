import { describe, expect, test } from "vitest";
import { LinuxInstaller } from "../src/LinuxInstaller";
import { MacOSInstaller } from "../src/MacOSInstaller";
import { WindowsInstaller } from "../src/WindowsInstaller";
import { InstallerFactory } from "../src/installers";
import { Arch, OS } from "../src/platform";

describe("InstallerFactory", () => {
  describe.each([
    [OS.LINUX, LinuxInstaller],
    [OS.MACOS, MacOSInstaller],
    [OS.WINDOWS, WindowsInstaller],
  ])("for platform %s", (os, expected) => {
    test(`returns ${String(expected.name)}`, () => {
      const sut = new InstallerFactory();
      expect(sut.create({ os, arch: Arch.AMD64 })).toBeInstanceOf(expected);
    });
  });
});
