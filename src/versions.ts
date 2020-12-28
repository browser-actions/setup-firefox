export const LatestVersion = {
  LATEST_BETA: 'latest-beta',
  LATEST_ESR: 'latest-esr',
  LATEST: 'latest'
} as const

// eslint-disable-next-line no-redeclare
export type LatestVersion = typeof LatestVersion[keyof typeof LatestVersion]
