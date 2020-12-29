import * as core from "@actions/core";
import * as io from "@actions/io";
import * as tc from "@actions/tool-cache";
import cp from "child_process";
import { getPlatform, Platform } from "./platform";
import { LatestVersion, isLatestVersion } from "./versions";
import { DownloadURLFactory } from "./DownloadURLFactory";
import { ExtractorFactory } from "./ExtractorFactory";

async function install(
  version: string,
  platform: Platform,
  language: string
): Promise<string> {
  const cacheEnabled = !isLatestVersion(version);
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

const run = async (): Promise<void> => {
  try {
    const version = core.getInput("firefox-version") || LatestVersion.LATEST;
    const platform = getPlatform();
    const language = core.getInput("firefox-language") || "en-US";

    core.info(`Setup firefox ${version} (${language})`);

    const installDir = await install(version, platform, language);

    core.addPath(installDir);
    core.info(`Successfully setup firefox version ${version}`);

    // output the version actually being used
    const firefoxBin = await io.which("firefox");
    const fierfoxVersion = cp.execSync(`${firefoxBin} --version`).toString();
    core.info(fierfoxVersion);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
