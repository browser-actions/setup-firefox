import type Installer from "./Installer";
import { LinuxInstaller, MacOSInstaller, WindowsInstaller } from "./Installer";
import { OS, type Platform } from "./platform";

export default class InstallerFactory {
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
