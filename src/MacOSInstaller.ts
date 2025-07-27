import path from "node:path";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as tc from "@actions/tool-cache";
import { DownloadURLFactory } from "./DownloadURLFactory";
import { testBinaryVersion } from "./firefoxUtils";
import type { InstallResult, InstallSpec, Installer } from "./installers";
import { LatestVersion } from "./versions";

export class MacOSInstaller implements Installer {
  async install({
    version,
    platform,
    language,
  }: InstallSpec): Promise<InstallResult> {
    const toolPath = tc.find("firefox", version);
    if (toolPath) {
      core.info(`Found in cache @ ${toolPath}`);
      return {
        installedDir: toolPath,
        installedBinPath: path.join(toolPath, "Contents", "MacOS", "firefox"),
      };
    }
    core.info(`Attempting to download firefox ${version}...`);
    const archivePath = await this.downloadArchive({
      version,
      platform,
      language,
    });

    core.info("Extracting Firefox...");
    const appPath = await this.extractArchive(archivePath, version);
    core.info(`Successfully extracted firefox ${version} to ${appPath}`);

    core.info("Adding to the cache ...");
    const cachedDir = await tc.cacheDir(appPath, "firefox", version);
    core.info(`Successfully cached firefox ${version} to ${cachedDir}`);

    return {
      installedDir: cachedDir,
      installedBinPath: path.join(cachedDir, "Contents", "MacOS", "firefox"),
    };
  }

  private async downloadArchive({
    version,
    platform,
    language,
  }: InstallSpec): Promise<string> {
    const url = new DownloadURLFactory(version, platform, language)
      .create()
      .getURL();
    core.info(`Acquiring ${version} from ${url}`);

    const archivePath = await tc.downloadTool(url);
    return archivePath;
  }

  private async extractArchive(
    archivePath: string,
    version: string,
  ): Promise<string> {
    const mountpoint = path.join("/Volumes", path.basename(archivePath));

    await exec.exec("hdiutil", [
      "attach",
      "-quiet",
      "-noautofsck",
      "-noautoopen",
      "-mountpoint",
      mountpoint,
      archivePath,
    ]);

    if (version === LatestVersion.LATEST_NIGHTLY) {
      return path.join(mountpoint, "Firefox Nightly.app");
    } else if (version.includes("devedition")) {
      return path.join(mountpoint, "Firefox Developer Edition.app");
    } else {
      return path.join(mountpoint, "Firefox.app");
    }
  }

  async testVersion(bin: string): Promise<string> {
    return testBinaryVersion(bin);
  }
}
