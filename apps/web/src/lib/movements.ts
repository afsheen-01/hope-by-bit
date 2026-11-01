// Tap to tick a movement, tap again to undo. Not saved: a daily record
// would become a streak (P2, product/principles.md).
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
