import { Platform, OS } from "./platform";
import Installer, { LinuxInstaller } from "./Installer";
import { UnsupportedPlatformError } from "./errors";

export default class InstallerFactory {
  create(platform: Platform): Installer {
    switch (platform.os) {
      case OS.LINUX:
        return new LinuxInstaller();
    }
    throw new UnsupportedPlatformError(platform);
  }
}
