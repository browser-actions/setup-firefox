import { Platform } from "./platform";
import { isLatestVersion } from "./versions";
import { DownloadURLFactory } from "./DownloadURLFactory";
import { ExtractorFactory } from "./ExtractorFactory";
import * as tc from "@actions/tool-cache";
import * as core from "@actions/core";

export const install = async (
  version: string,
  platform: Platform,
  language: string
): Promise<string> => {
  return installForLinux(version, platform, language);
};

async function installForLinux(
  version: string,
  platform: Platform,
  language: string
): Promise<string> {
  const cacheEnabled = isLatestVersion(version);
  if (cacheEnabled) {
    const toolPath = tc.find("firefox", version);
    if (toolPath) {
      core.info(`Found in cache @ ${toolPath}`);
      return toolPath;
    }
  }
  core.info(`Attempting to download firefox ${version}...`);

  const url = new DownloadURLFactory(version, platform, language)
    .create()
    .getURL();
  core.info(`Acquiring ${version} from ${url}`);

  const archivePath = await tc.downloadTool(url);
  core.info("Extracting Firefox...");
  const extPath = await new ExtractorFactory()
    .create(platform)
    .extract(archivePath);
  core.info(`Successfully extracted fiirefox ${version} to ${extPath}`);

  if (cacheEnabled) {
    core.info("Adding to the cache ...");
    const cachedDir = await tc.cacheDir(extPath, "firefox", version);
    core.info(`Successfully cached firefox ${version} to ${cachedDir}`);
  }
  return extPath;
}
