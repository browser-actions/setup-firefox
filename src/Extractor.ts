import * as tc from "@actions/tool-cache";

export default interface Extractor {
  extract(source: string): Promise<string>;
}

export class LinuxExtractor implements Extractor {
  extract(source: string): Promise<string> {
    return tc.extractTar(source, "", ["xj", "--strip-components=1"]);
  }
}
