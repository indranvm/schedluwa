// ============================================================
// Global type declarations untuk Scheduler singleton
// ============================================================

declare global {
  var __schedulerIntervalId: ReturnType<typeof setInterval> | undefined;
}

export {};
