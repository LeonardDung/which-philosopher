// Share buttons on the result page (this site only): X, Bluesky, Facebook and "Copy link", above
// "Copy my result". They share the page of the visitor's closest philosopher (p/<id>/), whose link
// preview shows that philosopher's card; X and Bluesky also get a short text with the match.
(function () {
  const SITE = "https://leonarddung.github.io/which-philosopher/";
  const copyBtn = document.getElementById("copyBtn");
  if (!copyBtn) return;
  const actions = copyBtn.parentElement;
  const $ = id => document.getElementById(id);

  // Simple Icons (CC0) paths.
  const icon = d => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
  const ICONS = {
    x: icon("M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"),
    bluesky: icon("M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"),
    facebook: icon("M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"),
    link: icon("M10.6 13.4a1 1 0 0 1 0-1.4l3.5-3.5a1 1 0 1 1 1.4 1.4L12 13.4a1 1 0 0 1-1.4 0ZM8.5 20a4.5 4.5 0 0 1-3.2-7.7l2.1-2.1a1 1 0 1 1 1.4 1.4l-2.1 2.1a2.5 2.5 0 0 0 3.5 3.5l2.1-2.1a1 1 0 1 1 1.4 1.4l-2.1 2.1A4.5 4.5 0 0 1 8.5 20Zm7.4-5.9a1 1 0 0 1-.7-1.7l2.1-2.1a2.5 2.5 0 0 0-3.5-3.5l-2.1 2.1a1 1 0 1 1-1.4-1.4l2.1-2.1a4.5 4.5 0 0 1 6.4 6.4l-2.1 2.1a1 1 0 0 1-.8.2Z")
  };

  const style = document.createElement("style");
  style.textContent = `
    .share-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-bottom: 18px; }
    .share-row .label { margin-right: 6px; }
    .share-btn { display: inline-flex; align-items: center; gap: 8px; border-radius: 999px; padding: 9px 16px; border: 1.5px solid var(--rule); background: var(--surface); color: var(--ink); font-weight: 600; cursor: pointer; }
    .share-btn:hover { border-color: var(--ink-2); }
    .share-btn:focus-visible { outline: 2px solid var(--ochre); outline-offset: 2px; }
    .share-btn svg { width: 16px; height: 16px; fill: currentColor; flex: none; }`;
  document.head.appendChild(style);

  const row = document.createElement("div");
  row.className = "share-row";
  row.innerHTML = `<span class="label">Share your result</span>
    <button type="button" class="share-btn" data-share="x">${ICONS.x}<span>X</span></button>
    <button type="button" class="share-btn" data-share="bluesky">${ICONS.bluesky}<span>Bluesky</span></button>
    <button type="button" class="share-btn" data-share="facebook">${ICONS.facebook}<span>Facebook</span></button>
    <button type="button" class="share-btn" data-share="link">${ICONS.link}<span>Copy link</span></button>`;
  actions.parentElement.insertBefore(row, actions);

  // The result as currently shown on the page.
  function result() {
    const name = $("rName").textContent.trim();
    const p = PHILOSOPHERS.find(x => x.name === name);
    const pct = parseInt($("rPct").textContent, 10);
    if (!p) return null;
    return {
      link: `${SITE}p/${p.id}/`,
      text: `My philosopher match: ${p.name}, “${p.epithet}”${Number.isFinite(pct) ? ` (${pct}%)` : ""}. Which philosopher are you?`
    };
  }
  function say(msg) { const s = $("status"); if (!s) return; s.textContent = msg; setTimeout(() => { if (s.textContent === msg) s.textContent = ""; }, 2500); }
  function open(url) { window.open(url, "_blank", "noopener,noreferrer,width=620,height=680"); }
  const enc = encodeURIComponent;
  // On iPhones with the Facebook app, facebook.com links open in the app, which drops the share.
  // Facebook's app-link rules exclude URLs ending in #no_universal_links, so this one opens
  // Facebook's share page in the browser instead (harmless everywhere else).
  function shareFacebook(r) {
    open(`https://www.facebook.com/sharer/sharer.php?u=${enc(r.link)}#no_universal_links`);
  }

  row.addEventListener("click", e => {
    const b = e.target.closest("[data-share]");
    if (!b) return;
    const r = result();
    if (!r) return;
    const kind = b.dataset.share;
    if (kind === "x") open(`https://x.com/intent/post?text=${enc(r.text)}&url=${enc(r.link)}`);
    if (kind === "bluesky") open(`https://bsky.app/intent/compose?text=${enc(r.text + " " + r.link)}`);
    if (kind === "facebook") shareFacebook(r);
    if (kind === "link") {
      const out = $("copyOut");
      const fallback = () => { if (out) { out.hidden = false; out.value = r.link; out.focus(); out.select(); } say("Select and copy the link below."); };
      try { navigator.clipboard.writeText(r.link).then(() => { if (out) out.hidden = true; say("Link copied"); }, fallback); } catch (err) { fallback(); }
    }
  });
})();
