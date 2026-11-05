(() => {
  "use strict";

  const STORAGE_KEY = "echo360SpeedKeeperRate";
  const slider = document.getElementById("slider");
  const value = document.getElementById("value");
  const reset = document.getElementById("reset");
  const status = document.getElementById("status");

  function format(r) { return (+r).toFixed(2) + "x"; }

  function showStatus() {
    status.classList.add("show");
    clearTimeout(showStatus._t);
    showStatus._t = setTimeout(() => status.classList.remove("show"), 1100);
  }

  function load() {
    chrome.storage.local.get({ [STORAGE_KEY]: 1.0 }, (s) => {
      const v = Number(s[STORAGE_KEY]);
      const safe = Number.isFinite(v) && v >= 0.5 && v <= 3.0 ? v : 1.0;
      slider.value = safe;
      value.textContent = format(safe);
    });
  }

  slider.addEventListener("input", () => {
    const v = +slider.value;
    value.textContent = format(v);
    chrome.storage.local.set({ [STORAGE_KEY]: v });
    showStatus();
  });

  reset.addEventListener("click", () => {
    slider.value = 1;
    value.textContent = format(1);
    chrome.storage.local.set({ [STORAGE_KEY]: 1.0 });
    showStatus();
  });

  // Live-translate the static strings.
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const msg = chrome.i18n.getMessage(key);
    if (msg) {
      if (el.tagName === "INPUT") el.value = msg;
      else el.textContent = msg;
    }
  });

  load();
})();
