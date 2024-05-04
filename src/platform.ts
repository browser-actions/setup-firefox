import os from "node:os";

export type Platform = {
  os: OS;
  arch: Arch;
};

export const OS = {
  MACOS: "macos",
  LINUX: "linux",
  WINDOWS: "windows",
} as const;

export type OS = (typeof OS)[keyof typeof OS];

export const Arch = {
  AMD64: "amd64",
  I686: "i686",
  ARM64: "arm64",
} as const;

export type Arch = (typeof Arch)[keyof typeof Arch];

export const getOS = (): OS => {
  const platform = os.platform();
  switch (platform) {
    case "linux":
      return OS.LINUX;
    case "darwin":
      return OS.MACOS;
    case "win32":
      return OS.WINDOWS;
  }
  throw new Error(`Unsupported platform: ${platform}`);
};

export const getArch = (): Arch => {
  const arch = os.arch();
  switch (arch) {
    case "arm64":
      return Arch.ARM64;
    case "x32":
      return Arch.I686;
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
