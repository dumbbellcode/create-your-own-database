
/**
 Class Segment:
  - constructor(fileLocation: string, maxBytes: number)
  - location: string (file path)
  - index: Map<string, number> (map keys to offsets)
  - get(key: string): string | null
  - set(key: string, value: string): void

 */

import * as fs from 'fs';
import * as path from 'path';

export class Segment {
    public static MAX_VALUE_SIZE = 1024; // 1 KB

    private index: Map<string, number>;
    private currentSize: number;

    constructor(private fileLocation: string, private maxBytes: number) {
        this.index = new Map<string, number>();
        this.currentSize = 0;
    }

    public get(key: string): string | null {
        const offset = this.index.get(key);
        if (offset === undefined) {
            return null;
        }

        const fd = fs.openSync(this.fileLocation, 'r');
        const buffer = Buffer.alloc(Segment.MAX_VALUE_SIZE);
        fs.readSync(fd, buffer, 0, buffer.length, offset);
        fs.closeSync(fd);

        const value = buffer.toString('utf-8').trim();
        return value;
    }

    public set(key: string, value: string): void {
        const valueBuffer = Buffer.from(value, 'utf-8');
        const valueSize = valueBuffer.length;

        if (this.currentSize + valueSize > this.maxBytes) {
            throw new Error('Segment size limit exceeded');
        }

        const fd = fs.openSync(this.fileLocation, 'a');
        const offset = fs.statSync(this.fileLocation).size;
        fs.writeSync(fd, valueBuffer, 0, valueSize, offset);
        fs.closeSync(fd);

        this.index.set(key, offset);
        this.currentSize += valueSize;
    }
}