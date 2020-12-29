import os from "os";

export type Platform = {
  os: OS;
  arch: Arch;
};

export const OS = {
  DARWIN: "darwin",
  LINUX: "linux",
  WINDOWS: "windows",
} as const;

// eslint-disable-next-line no-redeclare
export type OS = typeof OS[keyof typeof OS];

export const Arch = {
  AMD64: "amd64",
  I386: "i386",
  ARM64: "arm64",
} as const;

// eslint-disable-next-line no-redeclare
export type Arch = typeof Arch[keyof typeof Arch];

export const getOS = (): OS => {
  const platform = os.platform();
  switch (platform) {
    case "linux":
      return OS.LINUX;
  }
  throw new Error(`Unsupported platform: ${platform}`);
};

export const getArch = (): Arch => {
  const arch = os.arch();
  switch (arch) {
    case "arm64":
      return Arch.ARM64;
    case "x32":
      return Arch.I386;
    case "x64":
      return Arch.AMD64;
  }
  throw new Error(`Unsupported arch: ${arch}`);
};

export const getPlatform = (): Platform => {
  return {
    os: getOS(),
    arch: getArch(),
  };
};
