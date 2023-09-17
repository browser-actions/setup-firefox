import * as path from "path";
import * as core from "@actions/core";
import { getPlatform } from "./platform";
import { LatestVersion } from "./versions";
import InstallerFactory from "./InstallerFactory";

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
    const installDir = await installer.install({ version, platform, language });

    core.addPath(installDir);

    const actualVersion = await installer.testVersion(
      path.join(installDir, "firefox"),
    );
    core.info(`Successfully setup firefox version ${actualVersion}`);
    core.setOutput("firefox-version", actualVersion);
  } catch (error) {
    if (hasErrorMessage(error)) {
      core.setFailed(error.message);
    } else {
      core.setFailed(String(error));
    }
  }
};

run();
