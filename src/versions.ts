export const LatestVersion = {
  LATEST_DEVEDITION: "latest-devedition",
  LATEST_NIGHTLY: "latest-nightly",
  LATEST_BETA: "latest-beta",
  LATEST_ESR: "latest-esr",
  LATEST: "latest",
} as const;

// eslint-disable-next-line no-redeclare
export type LatestVersion = (typeof LatestVersion)[keyof typeof LatestVersion];

export const isLatestVersion = (version: string): version is LatestVersion => {
  return (
    version === LatestVersion.LATEST ||
    version === LatestVersion.LATEST_BETA ||
    version === LatestVersion.LATEST_DEVEDITION ||
    version === LatestVersion.LATEST_NIGHTLY ||
    version === LatestVersion.LATEST_ESR
  );
};
