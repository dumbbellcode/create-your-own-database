export class SegmentLimitExceeded extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SegmentLimitExceeded";
  }
}
