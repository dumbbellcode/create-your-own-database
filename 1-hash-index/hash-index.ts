export class HashIndex {
    private index: Map<string, number[]>;

    constructor() {
        this.index = new Map<string, number[]>();
    }

}


/** 
Entities:
Segment:
  - location: string (file path)
  - index: Map<string, number> (map keys to offsets)
  - get(key: string): string | null
  - set(key: string, value: string): void

HasIndex: 
  - segments: Segment[]
  - set(key: string, value: string): void
  - get(key: string): string | null
  - compact(): void


Operations:
1. set(key: string, value: string): void
2. get(key: string): string | null

Internal Instance Variables:
1. inMemoryIndex: Map<string, number> : Maps keys to their file offsets

Internal Operations:
1. compact(): void

Config:
1. Segment Size: File size in bytes
2. 


 */