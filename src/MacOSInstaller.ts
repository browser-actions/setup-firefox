import path from "node:path";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as tc from "@actions/tool-cache";
import { DownloadURLFactory } from "./DownloadURLFactory";
import { testBinaryVersion } from "./firefoxUtils";
import type { InstallSpec, Installer } from "./installers";
import { LatestVersion } from "./versions";

export class MacOSInstaller implements Installer {
  async install(spec: InstallSpec): Promise<string> {
    const installPath = await this.download(spec);
    return path.join(installPath, "Contents", "MacOS");
  }

  async download({
    version,
    platform,
    language,
  }: InstallSpec): Promise<string> {
    const toolPath = tc.find("firefox", version);
    if (toolPath) {
      core.info(`Found in cache @ ${toolPath}`);
      return toolPath;
    }
    core.info(`Attempting to download firefox ${version}...`);

    const url = new DownloadURLFactory(version, platform, language)
      .create()
      .getURL();
    core.info(`Acquiring ${version} from ${url}`);

    const archivePath = await tc.downloadTool(url);
    core.info("Extracting Firefox...");

    const mountpoint = path.join("/Volumes", path.basename(archivePath));
    const appPath = (() => {
      if (version === LatestVersion.LATEST_NIGHTLY) {
        return path.join(mountpoint, "Firefox Nightly.app");
      } else if (version.includes("devedition")) {
        return path.join(mountpoint, "Firefox Developer Edition.app");
      } else {
        return path.join(mountpoint, "Firefox.app");
      }
    })();

    await exec.exec("hdiutil", [
      "attach",
      "-quiet",
      "-noautofsck",
      "-noautoopen",
      "-mountpoint",
      mountpoint,
      archivePath,
    ]);
    core.info(`Successfully extracted firefox ${version} to ${appPath}`);

    core.info("Adding to the cache ...");
    const cachedDir = await tc.cacheDir(appPath, "firefox", version);
    core.info(`Successfully cached firefox ${version} to ${cachedDir}`);
    return cachedDir;
  }

  async testVersion(bin: string): Promise<string> {
    return testBinaryVersion(bin);
  }
}
