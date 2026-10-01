(() => {
const D = window.DEPARTMENTS, root = document.getElementById("app");
const S = { dept: null, i: 0, a: {}, tmp: "", edit: false };
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
const norm = v => v.trim().replace(/[०-९]/g, c => "०१२३४५६७८९".indexOf(c));
const say = t => { if (!("speechSynthesis" in window)) return; speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(t); u.lang = "hi-IN"; u.rate = .85; speechSynthesis.speak(u); };
const el = (tag, at = {}, ...kids) => { const e = document.createElement(tag);
  for (const k in at) k === "onclick" ? e.onclick = at[k] : e.setAttribute(k, at[k]);
  kids.flat().forEach(c => e.append(c)); return e; };
const show = (...n) => { root.replaceChildren(...n.flat(Infinity)); window.scrollTo(0, 0); };
const btn = (txt, fn, cls = "") => el("button", { onclick: fn, class: cls, type: "button" }, txt);
const fields = () => S.dept.fields;

function home() {
  S.a = {}; S.i = 0; S.edit = false;
  show(el("h1", {}, "आपका आवेदन, आसान तरीके से"),
    el("p", { class: "hint" }, "सवालों के जवाब बोलिए या लिखिए। हम आवेदन तैयार कर देंगे।"),
    Object.values(D).map(d => el("button", { class: "block", type: "button",
      onclick: () => { S.dept = d; ask(); } }, d.name, el("small", {}, d.desc))));
}

function ask() {
  const f = fields()[S.i], pct = (S.i / fields().length) * 100;
  const err = el("div", { class: "err", role: "alert" });
  const next = v => { v = norm(v); const m = f.validate && f.validate(v); if (m) { err.textContent = m; say(m); return; } S.tmp = v; confirm(); };
  const body = [
    el("div", { class: "step" }, `सवाल ${S.i + 1} / ${fields().length}`),
    el("div", { class: "bar" }, el("i", { style: `width:${pct}%` })),
    el("div", { class: "q" }, f.q), f.hint ? el("p", { class: "hint" }, f.hint) : "",
    btn("🔊 सवाल सुनें", () => say(f.q))];
  if (f.options) body.push(f.options.map(o => el("button", { class: "block", type: "button", onclick: () => next(o) }, o)));
  else {
    const inp = el("input", { id: "ans", autocomplete: "off", "aria-label": f.q }); inp.value = S.a[f.id] || "";
    inp.onkeydown = e => e.key === "Enter" && next(inp.value);
    body.push(inp);
    if (SR) { const mic = btn("🎤 बोलकर बताएँ", () => { const r = new SR(); r.lang = "hi-IN";
      r.onresult = e => inp.value = e.results[0][0].transcript;
      r.onerror = () => err.textContent = "आवाज़ नहीं सुनाई दी। फिर दबाएँ या लिखें।";
      r.onend = () => mic.classList.remove("on"); mic.classList.add("on"); r.start(); }); body.push(mic); }
    else body.push(el("p", { class: "hint" }, "इस फ़ोन में बोलकर लिखना उपलब्ध नहीं है। कृपया लिखें।"));
    body.push(err, btn("आगे बढ़ें", () => next(inp.value), "go"));
    setTimeout(() => inp.focus(), 50);
  }
  if (S.i > 0 && !S.edit) body.push(btn("← पीछे", () => { S.i--; ask(); }));
  show(...body); say(f.q);
}

function confirm() {
  const f = fields()[S.i], t = `आपने बताया: ${S.tmp}। क्या यह सही है?`;
  show(el("div", { class: "q" }, f.q), el("div", { class: "said" }, S.tmp),
    el("p", {}, "क्या यह सही है?"), btn("🔊 फिर से सुनें", () => say(t)),
    btn("✔ हाँ, सही है", () => { S.a[f.id] = S.tmp;
      if (S.edit || S.i === fields().length - 1) { S.edit = false; review(); } else { S.i++; ask(); } }, "yes"),
    btn("✎ नहीं, बदलूँगा", ask));
  say(t);
}

function review() {
  const rows = fields().map((f, i) => el("div", { class: "row" },
    el("div", {}, el("small", {}, f.q), S.a[f.id] || "—"),
    btn("बदलें", () => { S.i = i; S.edit = true; ask(); })));
  show(el("h1", {}, "एक बार सब देख लीजिए"), rows,
    btn("✔ सब सही है, आवेदन बनाएँ", letter, "yes"));
  say("कृपया एक बार सब जानकारी देख लीजिए। सब सही हो तो आवेदन बनाएँ दबाएँ।");
}

function letter() {
  const text = S.dept.template(S.a);
  show(el("h1", {}, "आपका आवेदन तैयार है"), el("pre", {}, text),
    el("div", { class: "noprint" },
      btn("🖨 प्रिंट करें", () => print(), "go"),
      btn("📋 कॉपी करें", () => navigator.clipboard && navigator.clipboard.writeText(text)),
      btn("🔊 पढ़कर सुनाएँ", () => say(text)),
      el("a", { href: "https://wa.me/?text=" + encodeURIComponent(text), target: "_blank", rel: "noopener" }, btn("WhatsApp पर भेजें")),
      el("p", { class: "hint" }, "प्रिंट कर हस्ताक्षर या अँगूठे का निशान लगाएँ और प्रखंड कार्यालय में जमा करें।"),
      btn("नया आवेदन", home)));
}
home();
})();
