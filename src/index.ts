import * as core from "@actions/core";
import * as exec from "@actions/exec";
import { getPlatform } from "./platform";
import { LatestVersion } from "./versions";
import InstallerFactory from "./InstallerFactory";

const run = async (): Promise<void> => {
  try {
    const version = core.getInput("firefox-version") || LatestVersion.LATEST;
    const platform = getPlatform();
    const language = core.getInput("firefox-language") || "en-US";

    core.info(`Setup firefox ${version} (${language})`);

    const installDir = await new InstallerFactory()
      .create(platform)
      .install({ version, platform, language });

    core.addPath(installDir);
    core.info(`Successfully setup firefox version ${version}`);

    await exec.exec("firefox", ["--version"]);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
