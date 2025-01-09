import fs from "node:fs";
import path from "node:path";
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as io from "@actions/io";
import * as tc from "@actions/tool-cache";
import { DownloadURLFactory } from "./DownloadURLFactory";
import type { Platform } from "./platform";
import { LatestVersion } from "./versions";

export type InstallSpec = {
  version: string;
  platform: Platform;
  language: string;
};

export default interface Installer {
  install(spec: InstallSpec): Promise<string>;

  testVersion(bin: string): Promise<string>;
}

const commonTestVersion = async (bin: string): Promise<string> => {
  const output = await exec.getExecOutput(`"${bin}"`, ["--version"]);
  if (output.exitCode !== 0) {
    throw new Error(
      `firefox exits with status ${output.exitCode}: ${output.stderr}`,
    );
  }
  if (!output.stdout.startsWith("Mozilla Firefox ")) {
    throw new Error(`firefox outputs unexpected results: ${output.stdout}`);
  }
  return output.stdout.trimEnd().replace("Mozilla Firefox ", "");
};

export class LinuxInstaller implements Installer {
  async install(spec: InstallSpec): Promise<string> {
    return this.download(spec);
  }

  private async download({
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
    const handle = await fs.promises.open(archivePath, "r");
    const firstBytes = new Int8Array(3);
    if (handle !== null) {
      await handle.read(firstBytes, 0, 3, null);
      core.info(
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
    core.info(`Successfully extracted firefox ${version} to ${extPath}`);

    core.info("Adding to the cache ...");
    const cachedDir = await tc.cacheDir(extPath, "firefox", version);
    core.info(`Successfully cached firefox ${version} to ${cachedDir}`);
    return cachedDir;
  }

  testVersion = commonTestVersion;
}

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

  testVersion = commonTestVersion;
}

export class WindowsInstaller implements Installer {
  install(spec: InstallSpec): Promise<string> {
    return this.download(spec);
  }

  async download({
    version,
    platform,
    language,
  }: InstallSpec): Promise<string> {
    const installPath = `C:\\Program Files\\Firefox_${version}`;
    if (await this.checkInstall(installPath)) {
      core.info(`Already installed @ ${installPath}`);
      return installPath;
    }

    core.info(`Attempting to download firefox ${version}...`);

    const url = new DownloadURLFactory(version, platform, language)
      .create()
      .getURL();
    core.info(`Acquiring ${version} from ${url}`);

    const installerPath = await tc.downloadTool(url);
    await io.mv(installerPath, `${installerPath}.exe`);
    core.info("Extracting Firefox...");

    await exec.exec(installerPath, [
      "/S",
      `/InstallDirectoryName=${path.basename(installPath)}`,
    ]);
    core.info(`Successfully installed firefox ${version} to ${installPath}`);

    return installPath;
  }

  private async checkInstall(dir: string): Promise<boolean> {
    try {
      await fs.promises.access(dir, fs.constants.F_OK);
    } catch (err) {
      return false;
    }
    return true;
  }

  testVersion = commonTestVersion;
}
