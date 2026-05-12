"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import {
  Console,
  ConsoleButtons,
  ConsoleClearBtn,
  ConsoleCloseBtn,
  ConsoleCopyBtn,
  ConsoleInput,
  ConsoleInputRow,
  type ConsoleLogLevel,
  ConsoleLogLine,
  ConsoleLogsArea,
  ConsoleMinimizeBtn,
  ConsolePrompt,
  type ConsoleSize,
} from "@/registry/dofus1/ui/console";

interface LogEntry {
  id: number;
  text: string;
  level: ConsoleLogLevel;
}

let nextLogId = 1;
function makeEntry(text: string, level: ConsoleLogLevel = "default"): LogEntry {
  return { id: nextLogId++, text, level };
}

interface ConsoleDemoProps {
  initialSize?: ConsoleSize;
  initialLogs?: readonly { text: string; level?: ConsoleLogLevel }[];
  prompt?: string;
}

// Match `Kernel.showMessage`'s `DEBUG_LOG` / `DEBUG_ERROR` / `DEBUG_INFO`
// branches — a tiny demo router so submitted commands appear with the
// realistic color channel.
function demoRoute(cmd: string): ConsoleLogLevel {
  if (/^!?(error|fail|invalid|unknown)/i.test(cmd)) {
    return "error";
  }
  if (/^!?(ok|success|done|granted|spawned|loaded)/i.test(cmd)) {
    return "info";
  }
  return "default";
}

// Matches `Debug.changeSize()` (Debug.as:329-335): cycles
// `(current + 1) % 3` through the DebugSizeIndex order
// medium (0) → minimized (1) → max (2) → medium.
const SIZE_ORDER: readonly ConsoleSize[] = ["medium", "minimized", "max"];

function nextSize(current: ConsoleSize): ConsoleSize {
  const idx = SIZE_ORDER.indexOf(current);
  return SIZE_ORDER[(idx + 1) % SIZE_ORDER.length];
}

// In-memory history with the 50-entry circular-buffer cap from
// `AbstractConsoleParser` (AbstractConsoleParser.as) so ↑ / ↓ behaves
// like the real `DebugConsole.getHistoryUp/Down`.
const HISTORY_LIMIT = 50;

const DEFAULT_INITIAL_LOGS: readonly {
  text: string;
  level?: ConsoleLogLevel;
}[] = [
  { text: "logged in as gm.griefa", level: "info" },
  { text: "loaded map 84,-31 (Astrub Outpost)", level: "info" },
  { text: "warn: 2 monsters skipped (out-of-bounds spawn points)" },
  { text: "spawned monster Bouftou Royal at (5, 7)", level: "info" },
  { text: "command unknown: foo", level: "error" },
  { text: "set xp rate to 5.0" },
  { text: "player Akachauh teleported to (-1, 0)" },
  { text: "banned player Cheato24 for 7d (cause: third-party)" },
  { text: "granted +1500000 kamas to Akachauh", level: "info" },
];

export function ConsoleDemo({
  initialSize = "medium",
  initialLogs = DEFAULT_INITIAL_LOGS,
  prompt = "debug",
}: ConsoleDemoProps) {
  const [size, setSize] = useState<ConsoleSize>(initialSize);
  const [closed, setClosed] = useState(false);
  const [logs, setLogs] = useState<readonly LogEntry[]>(() =>
    initialLogs.map((entry) => makeEntry(entry.text, entry.level ?? "default"))
  );
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const historyRef = useRef<string[]>([]);
  const historyIdxRef = useRef<number>(-1);

  const onSubmit = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) {
      return;
    }
    historyRef.current.push(trimmed);
    if (historyRef.current.length > HISTORY_LIMIT) {
      historyRef.current.shift();
    }
    historyIdxRef.current = historyRef.current.length;
    setLogs((prev) => {
      const next = [...prev, makeEntry(trimmed, demoRoute(trimmed))];
      return next.length > 200 ? next.slice(-200) : next;
    });
    setDraft("");
  }, []);

  const onMinimize = useCallback(() => {
    setSize((s) => nextSize(s));
    inputRef.current?.focus();
  }, []);

  const onClear = useCallback(() => {
    setLogs([]);
    inputRef.current?.focus();
  }, []);

  const onCopy = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }
    navigator.clipboard
      .writeText(logs.map((l) => l.text).join("\n"))
      .catch(() => {
        // Clipboard rejected (insecure context or permission) — ignore.
      });
  }, [logs]);

  const onClose = useCallback(() => {
    setClosed(true);
  }, []);

  const onFunctionKey = useCallback(
    (event: { code: string; key: string; currentPrompt: string }) => {
      if (event.code === "ArrowUp" || event.key === "ArrowUp") {
        if (historyRef.current.length === 0) {
          return;
        }
        historyIdxRef.current = Math.max(0, historyIdxRef.current - 1);
        setDraft(historyRef.current[historyIdxRef.current] ?? "");
        return;
      }
      if (event.code === "ArrowDown" || event.key === "ArrowDown") {
        if (historyRef.current.length === 0) {
          return;
        }
        const next = historyIdxRef.current + 1;
        if (next >= historyRef.current.length) {
          historyIdxRef.current = historyRef.current.length;
          setDraft("");
        } else {
          historyIdxRef.current = next;
          setDraft(historyRef.current[next] ?? "");
        }
        return;
      }
      if (event.code === "Tab" || event.key === "Tab") {
        // Demo autocomplete: append " (auto)" suffix when the current
        // input matches the start of a known command.
        const known = ["spawn", "kamas", "ban", "teleport", "restartin"];
        const match = known.find((c) => c.startsWith(event.currentPrompt));
        if (match) {
          setDraft(match);
        }
      }
    },
    []
  );

  const renderedLogs = useMemo(
    () =>
      logs.map((entry) => (
        <ConsoleLogLine key={entry.id} level={entry.level}>
          {entry.text}
        </ConsoleLogLine>
      )),
    [logs]
  );

  if (closed) {
    return (
      <button
        type="button"
        onClick={() => setClosed(false)}
        className="px-3 py-1.5 text-sm rounded-md bg-card border border-border text-foreground hover:bg-accent cursor-pointer"
      >
        Reopen console
      </button>
    );
  }

  return (
    <Console size={size}>
      <ConsoleButtons>
        <ConsoleCloseBtn onClick={onClose} />
        <ConsoleMinimizeBtn onClick={onMinimize} />
        <ConsoleClearBtn onClick={onClear} />
        <ConsoleCopyBtn onClick={onCopy} />
      </ConsoleButtons>
      <ConsoleLogsArea>{renderedLogs}</ConsoleLogsArea>
      <ConsoleInputRow>
        <ConsolePrompt>{prompt}</ConsolePrompt>
        <ConsoleInput
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onSubmit={onSubmit}
          onFunctionKey={onFunctionKey}
          placeholder="type a command…"
        />
      </ConsoleInputRow>
    </Console>
  );
}
