import * as fs from "fs";
import { SegmentLimitExceeded } from "./errors/segment-limit-exceeded";

interface IndexEntry {
  key: string;
  offset: number;
  size: number;
}

export class Segment {
  public static MAX_VALUE_SIZE = 1024; // 1 KB

  private index: Map<string, IndexEntry>;
  private currentSize: number;

  constructor(
    private fileLocation: string,
    private maxBytes: number,
  ) {
    this.index = new Map<string, IndexEntry>();
    this.currentSize = 0;
  }

  public get(key: string): string | null {
    const indexEntry = this.index.get(key);
    if (indexEntry === undefined) {
      return null;
    }

    const fd = fs.openSync(this.fileLocation, "r"); // should we save it as instance variable?
    const buffer = Buffer.alloc(indexEntry.size);
    fs.readSync(fd, buffer, 0, indexEntry.size, indexEntry.offset);
    fs.closeSync(fd);

    const value = buffer.toString("utf-8").trim();
    return value;
  }

  public set(key: string, value: string): void {
    const valueBuffer = Buffer.from(value, "utf-8");
    const valueSize = valueBuffer.length;

    if (this.currentSize + valueSize > this.maxBytes) {
      throw new SegmentLimitExceeded("Segment size limit exceeded");
    }

    const fd = fs.openSync(this.fileLocation, "a");
    const offset = fs.statSync(this.fileLocation).size;
    fs.writeSync(fd, valueBuffer, 0, valueSize, offset);
    fs.closeSync(fd);

    const indexEntry: IndexEntry = {
      key,
      offset,
      size: valueSize,
    };

    this.index.set(key, indexEntry);
    this.currentSize += valueSize;
  }
}
