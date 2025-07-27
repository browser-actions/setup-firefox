import * as exec from "@actions/exec";

export const testBinaryVersion = async (bin: string): Promise<string> => {
  const output = await exec.getExecOutput(`"${bin}"`, ["--version"]);
  if (output.exitCode !== 0) {
    throw new Error(
      `firefox exits with status ${output.exitCode}: ${output.stderr}`,
    );
  }
  if (!output.stdout.startsWith("Mozilla Firefox ")) {
    throw new Error(`firefox outputs unexpected results: ${output.stdout}`);
  }
  return output.stdout.trimEnd().replace("Mozilla Firefox ", "");
};
