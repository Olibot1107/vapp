import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/cloudflare";
import { Link, useLoaderData, useRevalidator } from "@remix-run/react";
import { useState } from "react";

type StatusState = "operational" | "maintenance" | "offline" | "unknown" | (string & {});

type ApiHistoryPoint = {
  state?: StatusState;
  at?: string;
  checkedAt?: string;
  latencyMs?: number | null;
  statusCode?: number | null;
  error?: string | null;
};

type ApiNode = {
  panel?: {
    id?: number | string;
    name?: string;
    fqdn?: string;
  };
  resources?: {
    memoryMb?: number | null;
    memoryGb?: number | null;
    diskMb?: number | null;
    diskGb?: number | null;
  };
  probe?: {
    url?: string;
    host?: string;
  };
  status?: {
    state?: StatusState;
    sinceAt?: string;
    checkedAt?: string;
    latencyMs?: number | null;
    statusCode?: number | null;
    error?: string | null;
    lastOnlineAt?: string;
    lastOfflineAt?: string;
  };
  metrics?: {
    uptimePercent?: number | null;
    downtimeMs?: number | null;
    incidents?: number | null;
    window?: unknown;
  };
  uptimeBars?: Array<{
    state?: StatusState;
    fromAt?: string;
    toAt?: string;
    uptimePercent?: number | null;
  }>;
  history?: ApiHistoryPoint[];
};

type UiNode = ApiNode & {
  __sources?: {
    uptimeBars?: "api" | "fallback" | "none";
    history?: "api" | "fallback" | "none";
  };
};

type ApiStatusResponse = {
  summary?: unknown;
  service?: unknown;
  nodes?: ApiNode[];
};

type ApiPingHistoryResponse = {
  history?: ApiHistoryPoint[];
  uptimeBars?: ApiNode["uptimeBars"];
};

type DayRow<T> = {
  key: string;
  label: string;
  title: string;
  items: T[];
};

function groupByUtcDay<T>(items: T[], getIso: (item: T) => string | undefined): DayRow<T>[] {
  const rows: Array<DayRow<T>> = [];

  for (const item of items) {
    const iso = getIso(item);
    if (!iso) continue;
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) continue;
    const dayKey = date.toISOString().slice(0, 10); // UTC YYYY-MM-DD

    const existing = rows.length > 0 && rows[rows.length - 1]?.key === dayKey ? rows[rows.length - 1] : null;
    if (existing) {
      existing.items.push(item);
      continue;
    }

    const dayStart = new Date(`${dayKey}T00:00:00Z`);
    const label = new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: "UTC" }).format(dayStart);
    const title = new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      weekday: "long",
      timeZone: "UTC",
    }).format(dayStart);

    rows.push({ key: dayKey, label, title, items: [item] });
  }

  return rows;
}

function downsampleEven<T>(items: T[], target: number): T[] {
  if (target <= 0) return [];
  if (items.length <= target) return items.slice();
  if (target === 1) return [items[items.length - 1] as T];

  const out: T[] = [];
  const maxIndex = items.length - 1;
  for (let i = 0; i < target; i += 1) {
    const idx = Math.round((i * maxIndex) / (target - 1));
    out.push(items[idx] as T);
  }
  return out;
}

function parseRange(raw: string | null): "24h" | "7d" {
  return raw === "7d" ? "7d" : "24h";
}

function safeString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function safeNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function formatPercent(value: number | null | undefined): string | undefined {
  if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
  return `${value.toFixed(2)}%`;
}

function formatDurationMs(value: number | null | undefined): string | undefined {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return undefined;
  const totalSeconds = Math.floor(value / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function formatDateTime(iso: string | undefined): string | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

function formatUpdatedAt(iso: string | undefined): string | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

function formatUtcTime(iso: string | undefined): string | undefined {
  if (!iso) return undefined;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return undefined;
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

function uptimeBarTitle(bar: { fromAt?: string; toAt?: string; uptimePercent?: number | null }, barState: StatusState): string {
  const parts: string[] = [stateLabel(barState)];
  const pct = formatPercent(bar.uptimePercent);
  if (pct) parts.push(pct);

  const from = formatUtcTime(bar.fromAt);
  const to = formatUtcTime(bar.toAt);
  if (from && to) parts.push(`${from}–${to} UTC`);

  return parts.join(" • ");
}

function formatAgo(thenIso: string | undefined, baseIso: string): string | undefined {
  if (!thenIso) return undefined;
  const then = new Date(thenIso);
  const base = new Date(baseIso);
  if (Number.isNaN(then.getTime()) || Number.isNaN(base.getTime())) return undefined;

  let diffMs = base.getTime() - then.getTime();
  if (!Number.isFinite(diffMs)) return undefined;
  if (diffMs < 0) diffMs = 0;

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  const minutesRemainder = minutes % 60;
  if (hours < 24) return `${hours}h${minutesRemainder ? ` ${minutesRemainder}m` : ""} ago`;

  const days = Math.floor(hours / 24);
  const hoursRemainder = hours % 24;
  return `${days}d${hoursRemainder ? ` ${hoursRemainder}h` : ""} ago`;
}

function normalizeState(state: StatusState | undefined): StatusState {
  return state ?? "unknown";
}

function stateLabel(state: StatusState): string {
  if (state === "operational") return "Operational";
  if (state === "maintenance") return "Maintenance";
  if (state === "offline") return "Offline";
  return "Unknown";
}

function stateColor(state: StatusState): { bg: string; border: string } {
  if (state === "operational") return { bg: "#22c55e", border: "#15803d" };
  if (state === "maintenance") return { bg: "#f59e0b", border: "#b45309" };
  if (state === "offline") return { bg: "#ef4444", border: "#b91c1c" };
  return { bg: "#a3a3a3", border: "#525252" };
}

function barStateFromUptimePercent(percent: number | null | undefined): StatusState | undefined {
  if (typeof percent !== "number" || !Number.isFinite(percent)) return undefined;
  if (percent >= 99.5) return "operational";
  if (percent <= 0.5) return "offline";
  return "maintenance";
}

function barVisualState({
  bar,
  isLatest,
  nodeState,
}: {
  bar: { state?: StatusState; uptimePercent?: number | null };
  isLatest: boolean;
  nodeState: StatusState;
}): StatusState {
  if (isLatest) return nodeState;

  const byPercent = barStateFromUptimePercent(bar.uptimePercent);
  if (byPercent) return byPercent;

  // If the API reports "maintenance" for every bucket when you flip the node
  // into maintenance, don't repaint the entire history orange.
  const reported = normalizeState(bar.state);
  if (reported !== "maintenance") return reported;
  return "unknown";
}

function renderJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2) ?? "";
  } catch {
    return String(value);
  }
}

function overallState(nodes: ApiNode[]): StatusState {
  const states = nodes.map((n) => normalizeState(n.status?.state));
  if (states.some((s) => s === "offline")) return "offline";
  if (states.some((s) => s === "maintenance")) return "maintenance";
  if (states.length === 0) return "unknown";
  if (states.every((s) => s === "operational")) return "operational";
  return "unknown";
}

export const meta: MetaFunction = ({ matches }) => {
  const rootData = matches.find((match) => match.id === "root")?.data as
    | { origin?: unknown }
    | undefined;
  const origin = typeof rootData?.origin === "string" ? rootData.origin : "https://voidium.uk";
  return [
    { title: "Voidium Status" },
    { name: "description", content: "Live service status for Voidium infrastructure." },
    { property: "og:title", content: "Voidium Status" },
    { property: "og:description", content: "Live service status for Voidium infrastructure." },
    { property: "og:url", content: `${origin}/status` },
    { property: "og:type", content: "website" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const range = parseRange(url.searchParams.get("range"));
  const fetchedAt = new Date().toISOString();

  const apiUrl = new URL("https://status-api.voidium.uk/api/status");
  apiUrl.searchParams.set("range", range);

  try {
    const response = await fetch(apiUrl.toString(), {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return json(
        {
          range,
          apiUrl: apiUrl.toString(),
          error: `Status API returned ${response.status}`,
          fetchedAt,
        },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    const data = (await response.json()) as ApiStatusResponse;
    const nodesBase = Array.isArray(data?.nodes) ? data.nodes : [];

    const nodes: UiNode[] = await Promise.all(
      nodesBase.map(async (node) => {
        const id = node.panel?.id;
        if (id === undefined || id === null || id === "") {
          return {
            ...node,
            __sources: { history: Array.isArray(node.history) ? "fallback" : "none", uptimeBars: Array.isArray(node.uptimeBars) ? "fallback" : "none" },
          };
        }

        const nodeApiUrl = new URL(`https://status-api.voidium.uk/api/nodes/${id}/ping-history`);
        nodeApiUrl.searchParams.set("range", range);
        nodeApiUrl.searchParams.set("history", "1");
        nodeApiUrl.searchParams.set("historyRaw", "0");
        nodeApiUrl.searchParams.set("uptimeBars", "1");

        try {
          const extraResponse = await fetch(nodeApiUrl.toString(), {
            headers: { Accept: "application/json" },
          });
          if (!extraResponse.ok) {
            return {
              ...node,
              __sources: {
                history: Array.isArray(node.history) ? "fallback" : "none",
                uptimeBars: Array.isArray(node.uptimeBars) ? "fallback" : "none",
              },
            };
          }
          const extra = (await extraResponse.json()) as ApiPingHistoryResponse;
          const historyFromApi = Array.isArray(extra?.history);
          const barsFromApi = Array.isArray(extra?.uptimeBars);

          return {
            ...node,
            history: historyFromApi ? extra.history : node.history,
            uptimeBars: barsFromApi ? extra.uptimeBars : node.uptimeBars,
            __sources: {
              history: historyFromApi ? "api" : Array.isArray(node.history) ? "fallback" : "none",
              uptimeBars: barsFromApi ? "api" : Array.isArray(node.uptimeBars) ? "fallback" : "none",
            },
          };
        } catch {
          return {
            ...node,
            __sources: {
              history: Array.isArray(node.history) ? "fallback" : "none",
              uptimeBars: Array.isArray(node.uptimeBars) ? "fallback" : "none",
            },
          };
        }
      }),
    );

    return json(
      {
        range,
        apiUrl: apiUrl.toString(),
        nodes,
        state: overallState(nodes),
        summary: data?.summary,
        service: data?.service,
        fetchedAt,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return json(
      {
        range,
        apiUrl: apiUrl.toString(),
        error: error instanceof Error ? error.message : "Failed to reach status API",
        fetchedAt,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
};

export default function StatusPage() {
  const data = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const updatedAt = formatUpdatedAt(safeString(data.fetchedAt));
  const updatedAtFull = formatDateTime(safeString(data.fetchedAt));

  const pillStyle = {
    display: "inline-block",
    border: "3px solid #1a1a1a",
    background: "#fef7ed",
    padding: "0.35rem 0.6rem",
    boxShadow: "3px 3px 0px #1a1a1a",
    fontWeight: 900,
    fontSize: "0.9rem",
    whiteSpace: "nowrap",
  } as const;

  const pillStyleTruncated = {
    ...pillStyle,
    maxWidth: "100%",
    overflow: "hidden",
    textOverflow: "ellipsis",
  } as const;

  const fontFamily =
    '"Space Grotesk", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  const rangeHref = (range: "24h" | "7d") => `/status?range=${range}`;

  return (
    <div
      style={{
        fontFamily,
        backgroundColor: "#fef7ed",
        color: "#1a1a1a",
        lineHeight: "1.6",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "980px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            <div
              style={{
                fontSize: "2.25rem",
                fontWeight: "900",
                textShadow: "4px 4px 0px #fb923c",
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
              }}
            >
              Status
            </div>

            <Link to="/" style={{ textDecoration: "none", color: "#1a1a1a" }}>
              <span
                style={{
                  display: "inline-block",
                  border: "4px solid #1a1a1a",
                  background: "white",
                  padding: "0.65rem 1rem",
                  boxShadow: "6px 6px 0px #1a1a1a",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#1a1a1a",
                }}
              >
                ← Back
              </span>
            </Link>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
            <Link
              to={rangeHref("24h")}
              prefetch="intent"
              style={{ textDecoration: "none", color: "#1a1a1a" }}
            >
              <span
                style={{
                  display: "inline-block",
                  border: "4px solid #1a1a1a",
                  background: data.range === "24h" ? "#fb923c" : "white",
                  padding: "0.65rem 1rem",
                  boxShadow: "6px 6px 0px #1a1a1a",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#1a1a1a",
                }}
              >
                24h
              </span>
            </Link>
            <Link
              to={rangeHref("7d")}
              prefetch="intent"
              style={{ textDecoration: "none", color: "#1a1a1a" }}
            >
              <span
                style={{
                  display: "inline-block",
                  border: "4px solid #1a1a1a",
                  background: data.range === "7d" ? "#fb923c" : "white",
                  padding: "0.65rem 1rem",
                  boxShadow: "6px 6px 0px #1a1a1a",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#1a1a1a",
                }}
              >
                7d
              </span>
            </Link>

            <button
              type="button"
              onClick={() => revalidator.revalidate()}
              disabled={revalidator.state !== "idle"}
              style={{
                border: "4px solid #1a1a1a",
                background: "white",
                padding: "0.65rem 1rem",
                boxShadow: "6px 6px 0px #1a1a1a",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                cursor: revalidator.state === "idle" ? "pointer" : "not-allowed",
                opacity: revalidator.state === "idle" ? 1 : 0.7,
                color: "#1a1a1a",
              }}
            >
              {revalidator.state === "idle" ? "Refresh" : "Refreshing…"}
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: "1.25rem",
            border: "4px solid #1a1a1a",
            background: "white",
            padding: "1.1rem 1.35rem",
            boxShadow: "8px 8px 0px #fb923c",
          }}
        >
          <p style={{ margin: 0, fontWeight: 900, textTransform: "uppercase" }}>Live status</p>
          <p style={{ margin: "0.35rem 0 0", fontSize: "0.95rem" }}>
            Uptime and latency per node. Refresh the page for the latest check.
          </p>
        </div>

        {"error" in data ? (
          <div
            style={{
              border: "4px solid #1a1a1a",
              background: "white",
              padding: "1.5rem 1.75rem",
              boxShadow: "8px 8px 0px #ef4444",
              marginTop: "1.5rem",
            }}
          >
            <p style={{ margin: 0, fontWeight: 900, textTransform: "uppercase" }}>
              Can't load status right now
            </p>
            <p style={{ margin: "0.5rem 0 0" }}>
              {data.error}. Try again in a moment.
            </p>
            <div style={{ marginTop: "0.85rem" }}>
              <span
                title={updatedAtFull ?? undefined}
                style={{
                  display: "inline-block",
                  border: "3px solid #1a1a1a",
                  background: "#fef7ed",
                  padding: "0.45rem 0.7rem",
                  boxShadow: "3px 3px 0px #1a1a1a",
                  fontWeight: 900,
                  fontSize: "0.95rem",
                  whiteSpace: "nowrap",
                }}
              >
                Updated {updatedAt ?? "—"}
              </span>
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                border: "4px solid #1a1a1a",
                background: "white",
                padding: "1.5rem 1.75rem",
                boxShadow: "8px 8px 0px #fb923c",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
                marginTop: "1.5rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "0.2rem 0.55rem",
                    border: "3px solid #1a1a1a",
                    background: "white",
                    boxShadow: "4px 4px 0px #1a1a1a",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "999px",
                      border: "2px solid #1a1a1a",
                      background: stateColor(data.state).bg,
                      boxShadow: "2px 2px 0px #1a1a1a",
                      flex: "0 0 auto",
                    }}
                  />
                  {stateLabel(data.state)}
                </span>
                <span style={{ fontWeight: 900, textTransform: "uppercase" }}>
                  Voidium infrastructure
                </span>
              </div>
              <span
                title={updatedAtFull ?? undefined}
                style={{
                  display: "inline-block",
                  border: "3px solid #1a1a1a",
                  background: "#fef7ed",
                  padding: "0.45rem 0.7rem",
                  boxShadow: "3px 3px 0px #1a1a1a",
                  fontWeight: 900,
                  fontSize: "0.95rem",
                  whiteSpace: "nowrap",
                }}
              >
                Updated {updatedAt ?? "—"}
              </span>
            </div>

            {(() => {
              const counts = (data.nodes ?? []).reduce<{
                operational: number;
                maintenance: number;
                offline: number;
                unknown: number;
              }>(
                (acc, node) => {
                  const state = normalizeState(node.status?.state);
                  if (state === "operational") acc.operational += 1;
                  else if (state === "maintenance") acc.maintenance += 1;
                  else if (state === "offline") acc.offline += 1;
                  else acc.unknown += 1;
                  return acc;
                },
                { operational: 0, maintenance: 0, offline: 0, unknown: 0 },
              );

              return (
                <div
                  style={{
                    marginTop: "1rem",
                    border: "4px solid #1a1a1a",
                    background: "white",
                    padding: "1rem 1.25rem",
                    boxShadow: "6px 6px 0px #1a1a1a",
                    fontSize: "0.95rem",
                    fontWeight: 900,
                  }}
                >
                  Nodes: {counts.operational} operational • {counts.maintenance} maintenance • {counts.offline} offline •{" "}
                  {counts.unknown} unknown
                </div>
              );
            })()}

            {data.nodes.length === 0 ? (
              <div
                style={{
                  marginTop: "1.25rem",
                  border: "4px solid #1a1a1a",
                  background: "white",
                  padding: "1.25rem 1.5rem",
                  boxShadow: "8px 8px 0px #a3a3a3",
                }}
              >
                <p style={{ margin: 0, fontWeight: 900, textTransform: "uppercase" }}>
                  No nodes reported
                </p>
                <p style={{ margin: "0.5rem 0 0" }}>
                  The status API returned zero nodes for this range.
                </p>
              </div>
            ) : null}

            <div
              style={{
                marginTop: "1.75rem",
                display: "grid",
                gap: "1.5rem",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              }}
            >
              {(data.nodes ?? []).map((node, idx) => {
                const state = normalizeState(node.status?.state);
                const name = node.panel?.name ?? node.panel?.fqdn ?? `Node ${idx + 1}`;
                const nodeKey = String(node.panel?.id ?? idx);
                const isExpanded = Boolean(expandedNodes[nodeKey]);
                const location = node.panel?.fqdn ?? node.probe?.host ?? undefined;
                const latency =
                  typeof node.status?.latencyMs === "number" ? `${node.status.latencyMs}ms` : undefined;
                const uptime = formatPercent(node.metrics?.uptimePercent);
                const downtime = formatDurationMs(node.metrics?.downtimeMs);
                const incidents = safeNumber(node.metrics?.incidents);
                const checkedAgo = formatAgo(node.status?.checkedAt, data.fetchedAt);
                const sinceAgo = formatAgo(node.status?.sinceAt, data.fetchedAt);
                const lastOnlineAgo = formatAgo(node.status?.lastOnlineAt, data.fetchedAt);
                const lastOfflineAgo = formatAgo(node.status?.lastOfflineAt, data.fetchedAt);
                const err = node.status?.error ?? undefined;
                const statusCode =
                  typeof node.status?.statusCode === "number" ? String(node.status.statusCode) : undefined;
                const memoryMb = safeNumber(node.resources?.memoryMb);
                const memoryGb = safeNumber(node.resources?.memoryGb) ?? (memoryMb ? memoryMb / 1024 : undefined);
                const diskMb = safeNumber(node.resources?.diskMb);
                const diskGb = safeNumber(node.resources?.diskGb) ?? (diskMb ? diskMb / 1024 : undefined);

                return (
                  <div
                    key={`${node.panel?.id ?? name}-${idx}`}
                    style={{
                      border: "4px solid #1a1a1a",
                      background: "white",
                      padding: "1.5rem 1.75rem",
                      boxShadow: `8px 8px 0px ${stateColor(state).bg}`,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                      <div style={{ fontWeight: 900, fontSize: "1.15rem" }}>{name}</div>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "0.15rem 0.45rem",
                            border: "3px solid #1a1a1a",
                            background: "white",
                            boxShadow: "3px 3px 0px #1a1a1a",
                            fontWeight: 900,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            fontSize: "0.85rem",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span
                            aria-hidden="true"
                            style={{
                              width: "9px",
                              height: "9px",
                              borderRadius: "999px",
                              border: "2px solid #1a1a1a",
                              background: stateColor(state).bg,
                              boxShadow: "2px 2px 0px #1a1a1a",
                              flex: "0 0 auto",
                            }}
                          />
                          {stateLabel(state)}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedNodes((prev) => ({ ...prev, [nodeKey]: !Boolean(prev[nodeKey]) }))
                          }
                          style={{
                            border: "3px solid #1a1a1a",
                            background: "white",
                            padding: "0.35rem 0.6rem",
                            boxShadow: "3px 3px 0px #1a1a1a",
                            fontWeight: 900,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            color: "#1a1a1a",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {isExpanded ? "Hide" : "Ping"}
                        </button>
                      </div>
                    </div>

                    <div style={{ marginTop: "1rem" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                        {uptime ? (
                          <span
                            style={{
                              ...pillStyle,
                            }}
                          >
                            Uptime {uptime}
                          </span>
                        ) : null}
                        {latency ? (
                          <span
                            style={{
                              ...pillStyle,
                            }}
                          >
                            Latency {latency}
                          </span>
                        ) : null}
                        {downtime ? (
                          <span
                            style={{
                              ...pillStyle,
                            }}
                          >
                            Downtime {downtime}
                          </span>
                        ) : null}
                        {typeof incidents === "number" ? (
                          <span
                            style={{
                              ...pillStyle,
                            }}
                          >
                            Incidents {incidents}
                          </span>
                        ) : null}
                        {typeof memoryGb === "number" ? (
                          <span
                            style={{
                              ...pillStyle,
                            }}
                          >
                            Mem {memoryGb.toFixed(1)}GB
                          </span>
                        ) : null}
                        {typeof diskGb === "number" ? (
                          <span
                            style={{
                              ...pillStyle,
                            }}
                          >
                            Disk {diskGb.toFixed(1)}GB
                          </span>
                        ) : null}
                        {location ? (
                          <span
                            style={{
                              ...pillStyleTruncated,
                            }}
                            title={location}
                          >
                            Host {location}
                          </span>
                        ) : null}
                      </div>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "0.85rem" }}>
                        {checkedAgo ? <span style={{ ...pillStyle }}>Checked {checkedAgo}</span> : null}
                        {sinceAgo ? <span style={{ ...pillStyle }}>Since {sinceAgo}</span> : null}
                        {lastOnlineAgo ? <span style={{ ...pillStyle }}>Last online {lastOnlineAgo}</span> : null}
                        {lastOfflineAgo ? <span style={{ ...pillStyle }}>Last offline {lastOfflineAgo}</span> : null}
                      </div>

                      {Array.isArray(node.uptimeBars) && node.uptimeBars.length > 0
                        ? (() => {
                            const uptimeBars = node.uptimeBars;
                            return (
                              <div style={{ marginTop: "1.1rem" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    gap: "10px",
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <div style={{ fontWeight: 900, textTransform: "uppercase", fontSize: "0.85rem" }}>
                                    Uptime bars
                                  </div>
                                  {node.__sources?.uptimeBars ? (
                                    <span style={{ ...pillStyle, fontSize: "0.8rem", padding: "0.25rem 0.5rem" }}>
                                      Bars {node.__sources.uptimeBars === "api" ? "API" : node.__sources.uptimeBars}
                                    </span>
                                  ) : null}
                                </div>
                                {data.range === "7d" ? (
                                  <div style={{ marginTop: "0.75rem", display: "grid", gap: "12px" }}>
                                    {(() => {
                                      const indexedBars = uptimeBars.map((bar, __index) => ({ ...bar, __index }));
                                      const latestIndex = indexedBars.length - 1;
                                      return groupByUtcDay(indexedBars, (b) => b.toAt ?? b.fromAt).map((row) => (
                                        <div
                                          key={row.key}
                                          style={{
                                            display: "grid",
                                            gridTemplateColumns: "90px 1fr",
                                            gap: "12px",
                                            alignItems: "center",
                                          }}
                                        >
                                          <div
                                            title={row.title}
                                            style={{
                                              fontWeight: 900,
                                              textTransform: "uppercase",
                                              letterSpacing: "0.04em",
                                              fontSize: "0.85rem",
                                            }}
                                          >
                                            {row.label}
                                          </div>
                                          <div
                                            style={{
                                              display: "grid",
                                              gridTemplateColumns: `repeat(${row.items.length}, minmax(0, 1fr))`,
                                              columnGap: "4px",
                                              width: "100%",
                                            }}
                                          >
                                            {row.items.map((bar, barIdx) => {
                                              const isLatest = bar.__index === latestIndex;
                                              const barState = barVisualState({ bar, isLatest, nodeState: state });
                                              return (
                                                <span
                                                  key={barIdx}
                                                  title={uptimeBarTitle(bar, barState)}
                                                  style={{
                                                    width: "100%",
                                                    height: "16px",
                                                    display: "inline-block",
                                                    border: `2px solid ${stateColor(barState).border}`,
                                                    background: stateColor(barState).bg,
                                                  }}
                                                />
                                              );
                                            })}
                                          </div>
                                        </div>
                                      ));
                                    })()}
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns: `repeat(${uptimeBars.length}, minmax(0, 1fr))`,
                                      columnGap: "6px",
                                      marginTop: "0.5rem",
                                      width: "100%",
                                    }}
                                  >
                                    {uptimeBars.map((bar, barIdx) => {
                                      const isLatest = barIdx === uptimeBars.length - 1;
                                      const barState = barVisualState({ bar, isLatest, nodeState: state });
                                      return (
                                        <span
                                          key={barIdx}
                                          title={uptimeBarTitle(bar, barState)}
                                          style={{
                                            width: "100%",
                                            height: "24px",
                                            display: "inline-block",
                                            border: `2px solid ${stateColor(barState).border}`,
                                            background: stateColor(barState).bg,
                                          }}
                                        />
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })()
                        : null}

                      {err ? (
                        <div style={{ marginTop: "0.85rem", fontWeight: 900, fontSize: "0.9rem" }}>
                          Error: {err}
                        </div>
                      ) : null}
                    </div>

                    {isExpanded ? (
                      <div style={{ marginTop: "1.1rem" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "10px",
                            flexWrap: "wrap",
                          }}
                        >
                          <div style={{ fontWeight: 900, textTransform: "uppercase", fontSize: "0.85rem" }}>
                            Ping (ms)
                          </div>
                          {node.__sources?.history ? (
                            <span style={{ ...pillStyle, fontSize: "0.8rem", padding: "0.25rem 0.5rem" }}>
                              Ping {node.__sources.history === "api" ? "API" : node.__sources.history}
                            </span>
                          ) : null}
                        </div>

                        {Array.isArray(node.history) && node.history.length > 0 ? (
                          (() => {
                            const points = node.history;
                            const latencies = points
                              .map((p) => (typeof p.latencyMs === "number" ? p.latencyMs : null))
                              .filter((v): v is number => v !== null && Number.isFinite(v) && v >= 0);
                            const maxLatency = Math.max(1, ...latencies);

                            const sparkHeight = data.range === "7d" ? 44 : 56;
                            const viewAll =
                              data.range === "7d" ? downsampleEven(points, 7 * 96) : downsampleEven(points, 160);

                            const splitSegments = (values: Array<number | null>) => {
                              const segments: Array<{ start: number; values: number[] }> = [];
                              let current: { start: number; values: number[] } | null = null;
                              values.forEach((v, i) => {
                                if (typeof v !== "number") {
                                  current = null;
                                  return;
                                }
                                if (!current) {
                                  current = { start: i, values: [v] };
                                  segments.push(current);
                                } else {
                                  current.values.push(v);
                                }
                              });
                              return segments;
                            };

                            const makePaths = (values: Array<number | null>) => {
                              const segments = splitSegments(values);
                              const linePaths: string[] = [];
                              const fillPaths: string[] = [];
                              const height = sparkHeight;

                              for (const seg of segments) {
                                const n = seg.values.length;
                                if (n === 0) continue;
                                const x0 = seg.start;
                                const y0 = height - (Math.min(seg.values[0] as number, maxLatency) / maxLatency) * height;
                                let d = `M ${x0} ${y0}`;
                                for (let j = 1; j < n; j += 1) {
                                  const x = seg.start + j;
                                  const y = height - (Math.min(seg.values[j] as number, maxLatency) / maxLatency) * height;
                                  d += ` L ${x} ${y}`;
                                }
                                linePaths.push(d);
                                fillPaths.push(`${d} L ${seg.start + (n - 1)} ${height} L ${seg.start} ${height} Z`);
                              }

                              return { linePaths, fillPaths };
                            };

                            const renderSparkline = (rowPoints: ApiHistoryPoint[]) => {
                              const view = downsampleEven(rowPoints, data.range === "7d" ? 96 : 160);
                              const valuesRaw = view.map((p) =>
                                typeof p.latencyMs === "number" && Number.isFinite(p.latencyMs) && p.latencyMs >= 0
                                  ? p.latencyMs
                                  : null,
                              );

                              const values = (() => {
                                if (valuesRaw.every((v) => v === null)) return valuesRaw;

                                const out = valuesRaw.slice();
                                let last: number | null = null;
                                for (let i = 0; i < out.length; i += 1) {
                                  const v = out[i];
                                  if (typeof v === "number") last = v;
                                  else if (last !== null) out[i] = last;
                                }

                                let next: number | null = null;
                                for (let i = out.length - 1; i >= 0; i -= 1) {
                                  const v = out[i];
                                  if (typeof v === "number") next = v;
                                  else if (next !== null) out[i] = next;
                                }

                                return out;
                              })();

                              const { linePaths, fillPaths } = makePaths(values);
                              const width = Math.max(1, values.length - 1);

                              const viewLatencies = values.filter(
                                (v): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0,
                              );
                              const min = viewLatencies.length > 0 ? Math.min(...viewLatencies) : undefined;
                              const avg =
                                viewLatencies.length > 0
                                  ? viewLatencies.reduce((acc, v) => acc + v, 0) / viewLatencies.length
                                  : undefined;
                              const max = viewLatencies.length > 0 ? Math.max(...viewLatencies) : undefined;

                              return (
                                <div
                                  style={{
                                    border: "4px solid #1a1a1a",
                                    background: "white",
                                    padding: "0.85rem 1rem",
                                    boxShadow: "6px 6px 0px #1a1a1a",
                                  }}
                                >
                                  <svg
                                    width="100%"
                                    height={sparkHeight}
                                    viewBox={`0 0 ${width} ${sparkHeight}`}
                                    preserveAspectRatio="none"
                                    style={{ display: "block" }}
                                  >
                                    {fillPaths.map((d, i) => (
                                      <path key={i} d={d} fill="rgba(251, 146, 60, 0.22)" />
                                    ))}
                                    {linePaths.map((d, i) => (
                                      <path
                                        key={i}
                                        d={d}
                                        fill="none"
                                        stroke="#1a1a1a"
                                        strokeWidth={2}
                                        vectorEffect="non-scaling-stroke"
                                      />
                                    ))}
                                  </svg>
                                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "0.75rem" }}>
                                    {typeof min === "number" ? (
                                      <span style={{ ...pillStyle }}>min {Math.round(min)}ms</span>
                                    ) : (
                                      <span style={{ ...pillStyle }}>no pings</span>
                                    )}
                                    {typeof avg === "number" ? (
                                      <span style={{ ...pillStyle }}>avg {Math.round(avg)}ms</span>
                                    ) : null}
                                    {typeof max === "number" ? (
                                      <span style={{ ...pillStyle }}>max {Math.round(max)}ms</span>
                                    ) : null}
                                  </div>
                                </div>
                              );
                            };

                            if (data.range === "7d") {
                              const rows = groupByUtcDay(viewAll, (p) => p.at ?? p.checkedAt);
                              return (
                                <div style={{ marginTop: "0.75rem", display: "grid", gap: "12px" }}>
                                  {rows.map((row) => (
                                    <div
                                      key={row.key}
                                      style={{
                                        display: "grid",
                                        gridTemplateColumns: "90px 1fr",
                                        gap: "12px",
                                        alignItems: "start",
                                      }}
                                    >
                                      <div
                                        title={row.title}
                                        style={{
                                          fontWeight: 900,
                                          textTransform: "uppercase",
                                          letterSpacing: "0.04em",
                                          fontSize: "0.85rem",
                                          paddingTop: "0.25rem",
                                        }}
                                      >
                                        {row.label}
                                      </div>
                                      {renderSparkline(row.items)}
                                    </div>
                                  ))}
                                </div>
                              );
                            }

                            return <div style={{ marginTop: "0.5rem" }}>{renderSparkline(points)}</div>;
                          })()
                        ) : (
                          <div style={{ marginTop: "0.5rem", fontWeight: 900, fontSize: "0.9rem" }}>
                            No ping data
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
