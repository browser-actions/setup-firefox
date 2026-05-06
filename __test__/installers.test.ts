import { describe, expect, test } from "vitest";
import { InstallerFactory } from "../src/installers";
import { LinuxInstaller } from "../src/LinuxInstaller";
import { MacOSInstaller } from "../src/MacOSInstaller";
import { Arch, OS } from "../src/platform";
import { WindowsInstaller } from "../src/WindowsInstaller";

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
