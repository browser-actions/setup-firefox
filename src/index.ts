import * as core from "@actions/core";
import { InstallerFactory } from "./installers";
import { getPlatform } from "./platform";
import { LatestVersion } from "./versions";

const hasErrorMessage = (e: unknown): e is { message: string | Error } => {
  return typeof e === "object" && e !== null && "message" in e;
};

const run = async (): Promise<void> => {
  try {
    const version = core.getInput("firefox-version") || LatestVersion.LATEST;
    const platform = getPlatform();
    const language = core.getInput("firefox-language") || "en-US";

    core.info(`Setup firefox ${version} (${language})`);

    const installer = new InstallerFactory().create(platform);
    const { installedDir, installedBinPath } = await installer.install({
      version,
      platform,
      language,
    });

    core.addPath(installedDir);

    const installedVersion = await installer.testVersion(installedBinPath);
    core.info(`Successfully setup firefox version ${installedVersion}`);
    core.setOutput("firefox-version", installedVersion);
    core.setOutput("firefox-path", installedBinPath);
  } catch (error) {
    if (hasErrorMessage(error)) {
      core.setFailed(error.message);
    } else {
      core.setFailed(String(error));
    }
  }
};

run();
