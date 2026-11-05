(() => {
  "use strict";

  const STORAGE_KEY = "echo360SpeedKeeperRate";
  const slider = document.getElementById("slider");
  const value = document.getElementById("value");
  const reset = document.getElementById("reset");

  function format(r) { return (+r).toFixed(2) + "x"; }

  chrome.storage.local.get({ [STORAGE_KEY]: 1.0 }, (s) => {
    const v = Number(s[STORAGE_KEY]);
    const safe = Number.isFinite(v) && v >= 0.5 && v <= 3.0 ? v : 1.0;
    slider.value = safe;
    value.textContent = format(safe);
  });

  slider.addEventListener("input", () => {
    const v = +slider.value;
    value.textContent = format(v);
    chrome.storage.local.set({ [STORAGE_KEY]: v });
  });

  reset.addEventListener("click", () => {
    slider.value = 1;
    value.textContent = format(1);
    chrome.storage.local.set({ [STORAGE_KEY]: 1.0 });
  });

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const msg = chrome.i18n.getMessage(key);
    if (msg) el.textContent = msg;
  });
})();
