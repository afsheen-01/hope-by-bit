// Tapping a movement marks it done with a tick; tapping again undoes it, so
// a mistap is easy to take back. Nothing is saved: the product deliberately
// keeps no per-day record, because that would turn into a streak (see P2 in
// product/principles.md).
export function initMovements(list: HTMLElement) {
  list.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest("button");
    if (!b) return;
    const done = b.getAttribute("aria-pressed") !== "true";
    b.setAttribute("aria-pressed", String(done));
    b.querySelector(".tick")?.remove();
    if (done) b.insertAdjacentHTML("afterbegin", '<span class="tick" aria-hidden="true">✓</span>');
  });
}
