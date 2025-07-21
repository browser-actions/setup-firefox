import fs from "node:fs";
import path from "node:path";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as tc from "@actions/tool-cache";
import { DownloadURLFactory } from "./DownloadURLFactory";
import { testBinaryVersion } from "./firefoxUtils";
import type { InstallSpec, Installer } from "./installers";

export class WindowsInstaller implements Installer {
  async install({ version, platform, language }: InstallSpec): Promise<string> {
    const installPath = `C:\\Program Files\\Firefox_${version}`;
    if (await this.checkInstall(installPath)) {
      core.info(`Already installed @ ${installPath}`);
      return installPath;
    }

    core.info(`Attempting to download firefox ${version}...`);
    const installerPath = await this.downloadArchive({
      version,
      platform,
      language,
    });

    core.info("Extracting Firefox...");
    await this.extractArchive(installerPath, installPath);
    core.info(`Successfully installed firefox ${version} to ${installPath}`);

    return installPath;
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

    const installerPath = await tc.downloadTool(url);
    await io.mv(installerPath, `${installerPath}.exe`);

    return installerPath;
  }

  private async checkInstall(dir: string): Promise<boolean> {
    try {
      await fs.promises.access(dir, fs.constants.F_OK);
    } catch (err) {
      return false;
    }
    return true;
  }

  private async extractArchive(
    installerPath: string,
    installPath: string,
  ): Promise<void> {
    await exec.exec(installerPath, [
      "/S",
      `/InstallDirectoryName=${path.basename(installPath)}`,
    ]);
  }

  async testVersion(bin: string): Promise<string> {
    return testBinaryVersion(bin);
  }
}
