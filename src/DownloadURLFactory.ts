import { Platform } from "./platform";
import DownloadURL, {
  ArchiveDownloadURL,
  LatestDownloadURL,
} from "./DownloadURL";
import { isLatestVersion } from "./versions";

export class DownloadURLFactory {
  constructor(
    private readonly version: string,
    private readonly platform: Platform,
    private readonly language: string
  ) {}
  create(): DownloadURL {
    if (isLatestVersion(this.version)) {
      return new LatestDownloadURL(this.version, this.platform, this.language);
    }
    return new ArchiveDownloadURL(this.version, this.platform, this.language);
  }
}
