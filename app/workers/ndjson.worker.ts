import { BumblebeeRecord } from "@/types/bumblebee";

export type WorkerInMessage = {
  type: "parse";
  text: string;
};

export type WorkerOutMessage =
  | { type: "chunk"; records: BumblebeeRecord[]; parsed: number; total: number }
  | { type: "done"; parsed: number; errors: number }
  | { type: "error"; message: string };

const CHUNK_SIZE = 1000;

self.onmessage = (e: MessageEvent<WorkerInMessage>) => {
  if (e.data.type !== "parse") return;

  const lines = e.data.text.split("\n");
  const total = lines.length;
  let parsed = 0;
  let errors = 0;
  let chunk: BumblebeeRecord[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    try {
      const record = JSON.parse(trimmed) as BumblebeeRecord;
      chunk.push(record);
      parsed++;

      if (chunk.length >= CHUNK_SIZE) {
        self.postMessage({
          type: "chunk",
          records: chunk,
          parsed,
          total,
        } satisfies WorkerOutMessage);
        chunk = [];
      }
    } catch {
      errors++;
    }
  }

  if (chunk.length > 0) {
    self.postMessage({
      type: "chunk",
      records: chunk,
      parsed,
      total,
    } satisfies WorkerOutMessage);
  }

  self.postMessage({ type: "done", parsed, errors } satisfies WorkerOutMessage);
};
