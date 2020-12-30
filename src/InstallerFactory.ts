import { Platform, OS } from "./platform";
import Installer, {
  LinuxInstaller,
  MacOSInstaller,
  WindowsInstaller,
} from "./Installer";

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
