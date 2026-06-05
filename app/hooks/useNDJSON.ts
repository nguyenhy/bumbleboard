"use client";

import { useState, useCallback, useRef } from "react";
import { BumblebeeRecord } from "@/types/bumblebee";
import type {
  WorkerInMessage,
  WorkerOutMessage,
} from "../workers/ndjson.worker";

export type ParseStatus = "idle" | "parsing" | "done" | "error";

export interface ParseState {
  records: BumblebeeRecord[];
  status: ParseStatus;
  progress: number; // 0–1
  parsed: number;
  errors: number;
  errorMessage?: string;
}

const INITIAL_STATE: ParseState = {
  records: [],
  status: "idle",
  progress: 0,
  parsed: 0,
  errors: 0,
};

export function useNDJSON() {
  const [state, setState] = useState<ParseState>(INITIAL_STATE);
  const workerRef = useRef<Worker | null>(null);
  const accumulatedRef = useRef<BumblebeeRecord[]>([]);

  const parse = useCallback((file: File) => {
    workerRef.current?.terminate();
    accumulatedRef.current = [];

    setState({ ...INITIAL_STATE, status: "parsing" });

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== "string") return;

      const worker = new Worker(
        new URL("../workers/ndjson.worker.ts", import.meta.url),
      );
      workerRef.current = worker;

      worker.onmessage = (e: MessageEvent<WorkerOutMessage>) => {
        const msg = e.data;

        if (msg.type === "chunk") {
          accumulatedRef.current = accumulatedRef.current.concat(msg.records);
          setState((prev) => ({
            ...prev,
            progress: msg.total > 0 ? msg.parsed / msg.total : 0,
            parsed: msg.parsed,
          }));
        }

        if (msg.type === "done") {
          setState({
            records: accumulatedRef.current,
            status: "done",
            progress: 1,
            parsed: msg.parsed,
            errors: msg.errors,
          });
          worker.terminate();
          workerRef.current = null;
        }

        if (msg.type === "error") {
          setState((prev) => ({
            ...prev,
            status: "error",
            errorMessage: msg.message,
          }));
          worker.terminate();
          workerRef.current = null;
        }
      };

      worker.onerror = (err) => {
        setState((prev) => ({
          ...prev,
          status: "error",
          errorMessage: err.message,
        }));
        worker.terminate();
        workerRef.current = null;
      };

      worker.postMessage({ type: "parse", text } satisfies WorkerInMessage);
    };

    reader.onerror = () => {
      setState((prev) => ({
        ...prev,
        status: "error",
        errorMessage: "Failed to read file",
      }));
    };

    reader.readAsText(file);
  }, []);

  const reset = useCallback(() => {
    workerRef.current?.terminate();
    workerRef.current = null;
    accumulatedRef.current = [];
    setState(INITIAL_STATE);
  }, []);

  return { ...state, parse, reset };
}
