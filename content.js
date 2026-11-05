(() => {
  "use strict";

  // Echo360 Speed Keeper — sets the saved preferred playback speed on every
  // <audio>/<video> element on the Echo360 institutional hosts. No network,
  // no accounts, no recording upload. The float value of the preferred speed
  // is the only thing this extension ever stores.

  let rate = 1.0;

  // Clamp helper — protects against out-of-range values from older installs.
  function clamp(v) {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0.5 && n <= 3.0 ? n : 1.0;
  }

  // Read the saved preferred speed on init (default 1.0 — never surprises a
  // first-time installer with a suddenly-fast lecture).
  chrome.storage.local.get({ echo360SpeedKeeperRate: 1.0 }, (s) => {
    rate = clamp(s.echo360SpeedKeeperRate);
    applyAll();
  });

  // Live-update from popup slider drag — no page reload needed.
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.echo360SpeedKeeperRate) {
      rate = clamp(changes.echo360SpeedKeeperRate.newValue);
      applyAll();
    }
  });

  // Set playbackRate on every media element on the page. Idempotent and
  // wrapped in try/catch — setting playbackRate on a media element without
  // a source can throw on some browsers; safe to ignore.
  function applyAll() {
    document.querySelectorAll("audio, video").forEach((el) => {
      try { el.playbackRate = rate; } catch (_) { /* no source yet */ }
    });
  }

  // Re-apply when Echo360 SPA-swaps the <video> element (recording-change
  // inside the Echo360 single-page app inserts a fresh media element).
  new MutationObserver(applyAll).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // Capture-phase listener — Echo360's own player resets playbackRate in
  // some flows and calls stopPropagation on media events; capture-phase
  // still fires and restores the student's preference within one tick.
  document.addEventListener("play", applyAll, true);
})();
