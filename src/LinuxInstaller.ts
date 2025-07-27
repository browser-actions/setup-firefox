import fs from "node:fs";
import path from "node:path";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import { DownloadURLFactory } from "./DownloadURLFactory";
import { testBinaryVersion } from "./firefoxUtils";
import type { InstallResult, InstallSpec, Installer } from "./installers";

export class LinuxInstaller implements Installer {
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
        installedBinPath: path.join(toolPath, "firefox"),
      };
    }
    core.info(`Attempting to download firefox ${version}...`);
    const archivePath = await this.downloadArchive({
      version,
      platform,
      language,
    });

    core.info("Extracting Firefox...");
    const extPath = await this.extractArchive(archivePath);
    core.info(`Successfully extracted firefox ${version} to ${extPath}`);

    core.info("Adding to the cache ...");
    const cachedDir = await tc.cacheDir(extPath, "firefox", version);
    core.info(`Successfully cached firefox ${version} to ${cachedDir}`);

    return {
      installedDir: extPath,
      installedBinPath: path.join(cachedDir, "firefox"),
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

  private async extractArchive(archivePath: string): Promise<string> {
    const file = await fs.promises.open(archivePath, "r");
    const firstBytes = new Int8Array(3);
    if (file !== null) {
      await file.read(firstBytes, 0, 3, null);
      core.debug(
        `Extracted ${firstBytes[0]}, ${firstBytes[1]} and ${firstBytes[2]}`,
      );
    }
    const options =
      firstBytes[0] === 66 && firstBytes[1] === 90 && firstBytes[2] === 104
        ? "xj"
        : "xJ";
    const extPath = await tc.extractTar(archivePath, "", [
      options,
      "--strip-components=1",
    ]);

    return extPath;
  }

  async testVersion(bin: string): Promise<string> {
    return testBinaryVersion(bin);
  }
}
