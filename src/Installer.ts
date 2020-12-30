import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as exec from "@actions/exec";
import path from "path";
import { Platform } from "./platform";
import { DownloadURLFactory } from "./DownloadURLFactory";

export type InstallSpec = {
  version: string;
  platform: Platform;
  language: string;
};

export default interface Installer {
  install(spec: InstallSpec): Promise<string>;
}

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
    const extPath = await tc.extractTar(archivePath, "", [
      "xj",
      "--strip-components=1",
    ]);
    core.info(`Successfully extracted fiirefox ${version} to ${extPath}`);

    core.info("Adding to the cache ...");
    const cachedDir = await tc.cacheDir(extPath, "firefox", version);
    core.info(`Successfully cached firefox ${version} to ${cachedDir}`);
    return cachedDir;
  }
}

export class MacOSInstaller implements Installer {
  async install(spec: InstallSpec): Promise<string> {
    const installPath = await this.download(spec);
    return path.join(installPath, "Firefox.app", "Contents", "MacOS");
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
    await exec.exec("hdiutil", [
      "attach",
      "-quiet",
      "-noautofsck",
      "-noautoopen",
      "-mountpoint",
      mountpoint,
      archivePath,
    ]);
    core.info(`Successfully extracted fiirefox ${version} to ${mountpoint}`);

    core.info("Adding to the cache ...");
    const cachedDir = await tc.cacheDir(mountpoint, "firefox", version);
    core.info(`Successfully cached firefox ${version} to ${cachedDir}`);
    return cachedDir;
  }
}
