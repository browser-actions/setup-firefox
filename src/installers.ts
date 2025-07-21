import { LinuxInstaller } from "./LinuxInstaller";
import { MacOSInstaller } from "./MacOSInstaller";
import { WindowsInstaller } from "./WindowsInstaller";
import { OS, type Platform } from "./platform";

export type InstallSpec = {
  version: string;
  platform: Platform;
  language: string;
};

export interface Installer {
  install(spec: InstallSpec): Promise<string>;

  testVersion(bin: string): Promise<string>;
}

export class InstallerFactory {
  create(platform: Platform): Installer {
    switch (platform.os) {
      case OS.LINUX:
        return new LinuxInstaller();
      case OS.MACOS:
        return new MacOSInstaller();
      case OS.WINDOWS:
        return new WindowsInstaller();
    }
  }
}
