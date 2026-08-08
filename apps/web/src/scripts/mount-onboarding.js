// Runs onboarding once, on a first visit; every visit after reads the
// story straight away. There's no account yet (O3), so "once" means "on
// this device" — the same thing signing out returns you to.
import "./onboarding.js";

const KEY = "hopebybit:onboarded";
const el = document.getElementById("onboarding");

// The overlay is fixed and full-screen, so it has to go the moment we know
// it isn't wanted — left in place empty it just paints over today's story.
if (el && localStorage.getItem(KEY)) {
  el.remove();
} else if (el) {
  window.HopeByBitOnboarding.mount(el, () => {
    localStorage.setItem(KEY, "1");
    el.remove();
  });
}
