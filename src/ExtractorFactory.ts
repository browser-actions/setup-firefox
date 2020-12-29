import { Platform, OS } from "./platform";
import Extractor, { LinuxExtractor } from "./Extractor";
import { UnsupportedPlatformError } from "./errors";

export class ExtractorFactory {
  create(platform: Platform): Extractor {
    switch (platform.os) {
      case OS.LINUX:
        return new LinuxExtractor();
    }
    throw new UnsupportedPlatformError(platform);
  }
}
