import { SegmentLimitExceeded } from "./errors/segment-limit-exceeded";
import { Segment } from "./segment";

interface HashIndexConfig {
  segmentMaxBytes: number;
}

export class HashIndex {
  private segments: Segment[] = [];

  constructor(private config: HashIndexConfig) {
  }

  public set(key: string, value: string): void {
    let currentSegment = this.segments[this.segments.length - 1];

    if (!currentSegment) {
      currentSegment = new Segment(
        `segment_${this.segments.length}.dat`,
        this.config.segmentMaxBytes,
      );
      this.segments.push(currentSegment);
    }

    try {
      currentSegment.set(key, value);
    } catch (e) {
      if (e instanceof SegmentLimitExceeded) {
        const newSegment = new Segment(
          `segment_${this.segments.length}.dat`,
          this.config.segmentMaxBytes,
        );
        this.segments.push(newSegment);
        newSegment.set(key, value);
      } else {
        throw e;
      }
    }
  }

  public get(key: string): string | null {
    for (let i = this.segments.length - 1; i >= 0; i--) {
      const segment = this.segments[i]!;
      const value = segment.get(key);
      if (value !== null) {
        return value;
      }
    }
    return null;
  }

  public getSegments(): Segment[] {
    return this.segments;
  }
}
