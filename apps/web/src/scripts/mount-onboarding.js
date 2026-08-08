// Runs onboarding once, on a first visit; every visit after reads the
// story straight away. There's no account yet (O3), so "once" means "on
// this device" — the same thing signing out returns you to.
import "./onboarding.js";

const KEY = "hopebybit:onboarded";
const el = document.getElementById("onboarding");

if (el && !localStorage.getItem(KEY)) {
  window.HopeByBitOnboarding.mount(el, () => {
    localStorage.setItem(KEY, "1");
    el.remove();
  });
}
