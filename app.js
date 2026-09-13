const ORDER = ["/", "/limits", "/map", "/ml", "/dl", "/genai", "/trends", "/manufacturing", "/playbook", "/responsible", "/tools"];
const DEEP = { "/ml": "ml", "/dl": "dl", "/genai": "genai" };
let COPIES = null;

function parse() {
  const raw = (location.hash.slice(1) || "/").replace(/^\/?/, "/");
  const [pathPart, qs] = raw.split("?");
  const path = ORDER.includes(pathPart) ? pathPart : "/";
  const sp = new URLSearchParams(qs || "");
  const lang = sp.get("lang");
  const ok = lang === "ko" || lang === "zh" || lang === "vi" || lang === "en";
  const s = Math.max(0, Number.parseInt(sp.get("s") || "0", 10) || 0);
  return { path, lang: ok ? lang : "en", s };
}
function href(path, lang, s) {
  const q = new URLSearchParams();
  if (lang !== "en") q.set("lang", lang);
  if (s && s > 0) q.set("s", String(s));
  const qs = q.toString();
  return qs ? `#${path}?${qs}` : `#${path}`;
}
function el(html) {
  const d = document.createElement("div");
  d.innerHTML = html;
  return d.innerHTML;
}
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, function (ch) {
    switch (ch) {
      case "&": return "\u0026amp;";
      case "<": return "\u0026lt;";
      case ">": return "\u0026gt;";
      case '"': return "\u0026quot;";
      default: return "\u0026#39;";
    }
  });
}
function hero(c) {
  return `<header class="hero"><p class="k">${esc(c.kicker)}</p><h1>${esc(c.title)}</h1><p class="lead">${esc(c.lead)}</p></header>`;
}
function prose(arr) {
  return `<div class="prose">${arr.map((p) => `<p>${esc(p)}</p>`).join("")}</div>`;
}
function h2(title, lead) {
  return `<h2>${esc(title)}</h2>${lead ? `<p class="sub">${esc(lead)}</p>` : ""}`;
}
function cards(items, inner) {
  return `<div class="grid grid-2">${items.map(inner).join("")}</div>`;
}

function pageLimits(t) {
  const c = t.limits;
  const col = (label, items) =>
    `<div><p class="k">${esc(label)}</p><div class="grid">${items
      .map((i) => `<article class="card"><h3>${esc(i.title)}</h3><p class="muted">${esc(i.body)}</p></article>`)
      .join("")}</div></div>`;
  return (
    hero(c) +
    prose(c.intro) +
    `<section>${h2(c.aiTitle, c.aiLead)}<div class="grid grid-2">${col(c.canLabel, c.aiCan)}${col(c.notLabel, c.aiNot)}</div></section>` +
    `<section>${h2(c.genTitle, c.genLead)}<div class="grid grid-2">${col(c.canLabel, c.genCan)}${col(c.notLabel, c.genNot)}</div></section>` +
    `<section>${h2(c.deskTitle, c.deskLead)}<div class="scroll"><table><thead><tr>${c.deskHead.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${c.deskRows
      .map((r) => `<tr><th>${esc(r.job)}</th><td>${esc(r.ai)}</td><td>${esc(r.gen)}</td></tr>`)
      .join("")}</tbody></table></div></section>` +
    `<section>${h2(c.testTitle)}<div class="grid">${c.testItems
      .map((x, i) => `<div class="card" style="display:flex;gap:.75rem"><span class="num">${String(i + 1).padStart(2, "0")}</span><span>${esc(x)}</span></div>`)
      .join("")}</div><p class="muted" style="margin-top:1.5rem">${esc(c.close)}</p></section>`
  );
}
function pageStart(t) {
  const c = t.start;
  return (
    hero(c) +
    prose(c.intro) +
    `<section>${h2(c.whoTitle)}${cards(c.whoItems, (i) => `<article class="card"><h3>${esc(i.title)}</h3><p class="muted" style="margin-top:.4rem">${esc(i.body)}</p></article>`)}</section>` +
    `<section>${h2(c.kindsTitle, c.kindsLead)}<div class="grid grid-3">${c.kinds
      .map((i) => `<article class="card"><h3>${esc(i.name)}</h3><p class="muted">${esc(i.body)}</p><p class="quote">${esc(i.line)}</p></article>`)
      .join("")}</div></section>` +
    `<section>${h2(c.weekTitle, c.weekLead)}${cards(c.weekItems, (i) => `<article class="card"><h3>${esc(i.title)}</h3><p class="muted">${esc(i.body)}</p></article>`)}</section>` +
    `<section>${h2(c.termsTitle, c.termsLead)}<div class="grid grid-3">${c.terms
      .map((i) => `<article class="card"><div class="num">${esc(i.term)}</div><p class="muted" style="margin-top:.4rem">${esc(i.body)}</p></article>`)
      .join("")}</div></section>` +
    `<section>${h2(c.pathTitle, c.pathLead)}${c.pathShortTitle ? `<p class="muted">${esc(c.pathShortTitle)}</p>` : ""}<div class="grid grid-3">${c.pathShort
      .map((p) => `<a class="card" href="${href(p.href, parse().lang)}" style="text-decoration:none"><div class="num">${esc(p.num)}</div><h3 style="margin-top:.4rem">${esc(p.title)}</h3><p class="muted">${esc(p.body)}</p></a>`)
      .join("")}</div></section>`
  );
}
function pageTools(t) {
  const c = t.tools;
  return (
    hero(c) +
    prose(c.intro) +
    `<section>${h2(c.whyTitle)}${cards(c.whyItems, (i) => `<article class="card"><h3>${esc(i.title)}</h3><p class="muted">${esc(i.body)}</p></article>`)}</section>` +
    `<section>${h2(c.modelsTitle, c.modelsLead)}<div class="grid grid-3">${c.models
      .map((m) => `<article class="card"><div class="num">${esc(m.also)}</div><h3>${esc(m.name)}</h3><p class="muted">${esc(m.good)}</p><p class="quote">${esc(m.quality)}</p></article>`)
      .join("")}</div></section>` +
    `<section>${h2(c.pickTitle)}<div class="scroll"><table><thead><tr>${c.pickHead.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${c.pickRows
      .map((r) => `<tr><th>${esc(r.job)}</th><td>${esc(r.model)}</td><td>${esc(r.why)}</td></tr>`)
      .join("")}</tbody></table></div></section>` +
    `<section class="grid grid-2"><div>${h2(c.checkTitle)}<div class="grid">${c.checks
      .map((x, i) => `<div class="card" style="display:flex;gap:.75rem"><span class="num">${String(i + 1).padStart(2, "0")}</span><span>${esc(x)}</span></div>`)
      .join("")}</div></div><div>${h2(c.neverTitle)}<div class="grid">${c.neverItems.map((x) => `<div class="never">${esc(x)}</div>`).join("")}</div></div></section>` +
    `<p class="muted" style="margin-top:2rem">${esc(c.close)}</p>`
  );
}

function pageMap(t) {
  const c = t.ai;
  return (
    hero(c) +
    prose(c.intro) +
    `<section>${h2(c.stackTitle, c.stackLead)}<div class="grid">${c.stack
      .map(
        (r) => `<article class="card layer"><div class="ln">L${esc(r.layer)}</div><div><h3>${esc(r.name)}</h3><p class="muted">${esc(r.body)}</p><p class="quote">${esc(r.line)}</p></div></article>`,
      )
      .join("")}</div></section>` +
    `<section>${h2(c.eightTitle, c.eightLead)}<div class="scroll"><table><thead><tr><th>8D</th><th></th><th></th></tr></thead><tbody>${c.eightSteps
      .map((s) => `<tr><th>${esc(s.d)}</th><td><strong>${esc(s.name)}</strong></td><td>${esc(s.body)}</td></tr>`)
      .join("")}</tbody></table></div><p class="muted" style="margin-top:1rem;max-width:48rem">${esc(c.eightRule)}</p></section>` +
    `<section>${h2(c.compareTitle, c.compareLead)}<div class="scroll"><table><thead><tr><th></th><th>${esc(c.mlName)}</th><th>${esc(c.genName)}</th></tr></thead><tbody>${c.compareRows
      .map((r) => `<tr><th>${esc(r.label)}</th><td>${esc(r.ml)}</td><td>${esc(r.gen)}</td></tr>`)
      .join("")}</tbody></table></div></section>` +
    `<section>${h2(c.mlTitle, c.mlLead)}${cards(c.mlItems, (i) => `<article class="card"><span class="tag">${esc(c.mlName)}</span><h3 style="margin-top:.7rem">${esc(i.title)}</h3><p class="muted" style="margin-top:.4rem">${esc(i.body)}</p></article>`)}</section>` +
    `<section>${h2(c.genTitle, c.genLead)}${cards(c.genItems, (i) => `<article class="card"><span class="tag gen">${esc(c.genName)}</span><h3 style="margin-top:.7rem">${esc(i.title)}</h3><p class="muted" style="margin-top:.4rem">${esc(i.body)}</p></article>`)}</section>` +
    `<section>${h2(c.storyTitle, c.storyLead)}<ol class="story">${c.storySteps
      .map((s) => `<li><span class="tag ${s.layer === "GenAI" ? "gen" : s.layer === "You" || s.layer === "Agent" ? "agent" : ""}">${esc(s.layer)}</span><h3 style="margin-top:.4rem">${esc(s.title)}</h3><p class="muted">${esc(s.body)}</p></li>`)
      .join("")}</ol><p class="prose" style="margin-top:1.2rem">${esc(c.storyClose)}</p></section>` +
    `<section>${h2(c.ruleTitle)}<div class="grid">${c.rules
      .map((r) => `<article class="card rule"><p>${esc(r.when)}</p><p class="use">${esc(r.use)}</p><p class="muted">${esc(r.why)}</p></article>`)
      .join("")}</div></section>` +
    `<section>${h2(c.nextTitle, c.nextLead)}<div class="grid grid-3">${c.nextPages
      .map((p) => `<a class="card" href="${href(p.href, parse().lang)}" style="text-decoration:none"><div class="num">${esc(p.num)}</div><h3 style="margin-top:.4rem">${esc(p.title)}</h3><p class="muted">${esc(p.body)}</p></a>`)
      .join("")}</div><p class="muted" style="margin-top:1.5rem;max-width:48rem">${esc(c.close)}</p></section>`
  );
}

function pageDeep(t, key) {
  const c = t[key];
  return (
    hero(c) +
    prose(c.intro) +
    `<section>${h2(c.ideasTitle)}${cards(c.ideas, (i) => `<article class="card"><h3>${esc(i.title)}</h3><p class="muted" style="margin-top:.4rem">${esc(i.body)}</p></article>`)}</section>` +
    `<section>${h2(c.jobsTitle, c.jobsLead)}<ol class="jobs">${c.jobs
      .map((j, n) => `<li class="card"><div class="num">${String(n + 1).padStart(2, "0")}</div><h3 style="margin-top:.4rem">${esc(j.title)}</h3><p class="muted">${esc(j.body)}</p><p class="quote">${esc(j.line)}</p></li>`)
      .join("")}</ol></section>` +
    `<section>${h2(c.metricTitle)}${cards(c.metrics, (i) => `<article class="card"><h3>${esc(i.title)}</h3><p class="muted" style="margin-top:.4rem">${esc(i.body)}</p></article>`)}</section>` +
    `<section>${h2(c.lineTitle)}${cards(c.lineItems, (i) => `<article class="card"><h3>${esc(i.title)}</h3><p class="muted" style="margin-top:.4rem">${esc(i.body)}</p></article>`)}</section>` +
    `<section class="grid grid-2"><div>${h2(c.notTitle)}<div class="grid">${c.notItems.map((x) => `<div class="never">${esc(x)}</div>`).join("")}</div></div><div>${h2(c.checkTitle)}<div class="grid">${c.checks
      .map((x, i) => `<div class="card" style="display:flex;gap:.75rem"><span class="num">${String(i + 1).padStart(2, "0")}</span><span>${esc(x)}</span></div>`)
      .join("")}</div></div></section>` +
    `<p class="muted" style="margin-top:2.5rem;max-width:48rem">${esc(c.close)}</p>`
  );
}

function pageTrends(t) {
  const c = t.trends;
  return (
    hero(c) +
    prose(c.intro) +
    c.items
      .map(
        (it) => `<section class="card"><div class="num">${esc(it.num)}</div><h2 style="margin-top:.4rem">${esc(it.title)}</h2>
        <p class="muted"><strong>${esc(it.labels.what)}.</strong> ${esc(it.what)}</p>
        <p class="muted"><strong>${esc(it.labels.whyNow)}.</strong> ${esc(it.whyNow)}</p>
        <p class="quote">${esc(it.line)}</p>
        <p class="muted" style="margin-top:.8rem"><strong>${esc(it.labels.watch)}.</strong> ${esc(it.watch)}</p></section>`,
      )
      .join("") +
    `<section>${h2(c.statsTitle)}<div class="grid grid-3">${c.stats
      .map((s) => `<article class="card"><div style="font-size:1.8rem;font-weight:600;color:var(--accent)">${esc(s.value)}</div><p>${esc(s.label)}</p><p class="muted">${esc(s.source)}</p></article>`)
      .join("")}</div></section>` +
    `<section>${h2(c.factoryTitle)}${prose(c.factoryBody)}<blockquote class="quote" style="font-size:1rem">${esc(c.factoryQuote)}<br><span class="muted">— ${esc(c.factoryCite)}</span></blockquote></section>` +
    `<section>${h2(c.quarterTitle)}<div class="grid">${c.quarterItems.map((x) => `<div class="never">${esc(x)}</div>`).join("")}</div></section>`
  );
}

function pageMfg(t) {
  const c = t.mfg;
  return (
    hero(c) +
    prose(c.intro) +
    `<section>${h2(c.chainTitle, c.chainLead)}<div class="grid">${c.chain
      .map(
        (r) => `<article class="card"><div class="num">${esc(r.step)}</div><h3 style="margin-top:.3rem">${esc(r.name)}</h3>
        <p class="muted"><span class="tag">${esc(c.mlTag)}</span> ${esc(r.ml)}</p>
        <p class="muted"><span class="tag gen">${esc(c.genTag)}</span> ${esc(r.gen)}</p>
        <p class="muted"><span class="tag agent">${esc(c.agentTag)}</span> ${esc(r.agent)}</p></article>`,
      )
      .join("")}</div></section>` +
    `<section>${h2(c.casesTitle, c.casesLead)}<div class="grid">${c.cases
      .map(
        (x) => `<article class="card"><span class="tag gen">${esc(x.tag)}</span><h3 style="margin-top:.6rem">${esc(x.title)}</h3><p class="muted">${esc(x.where)} · ${esc(x.kind)}</p>${x.body.map((p) => `<p>${esc(p)}</p>`).join("")}<p class="quote">${esc(x.result)}</p></article>`,
      )
      .join("")}</div></section>` +
    `<section>${h2(c.twinTitle)}${prose(c.twinBody)}${cards(c.twinItems, (i) => `<article class="card"><h3>${esc(i.title)}</h3><p class="muted">${esc(i.body)}</p></article>`)}</section>` +
    `<section>${h2(c.matrixTitle, c.matrixLead)}<div class="scroll"><table><thead><tr>${c.matrixHead.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${c.matrix
      .map((r) => `<tr><th>${esc(r.step)}</th><td>${esc(r.ml)}</td><td>${esc(r.gen)}</td><td>${esc(r.agent)}</td></tr>`)
      .join("")}</tbody></table></div></section>`
  );
}

function pagePlay(t) {
  const c = t.play;
  return (
    hero(c) +
    prose(c.intro) +
    `<section>${h2(c.rolesTitle)}<div class="grid grid-2">${c.roles
      .map((r) => `<article class="card"><h3>${esc(r.role)}</h3><ul>${r.uses.map((u) => `<li class="muted">${esc(u)}</li>`).join("")}</ul></article>`)
      .join("")}</div></section>` +
    `<section>${h2(c.promptTitle, c.promptLead)}${c.prompts
      .map((p) => `<article class="card" style="margin-bottom:.75rem"><span class="tag gen">${esc(p.kind)}</span><h3 style="margin-top:.5rem">${esc(p.title)}</h3><p class="muted">${esc(p.use)}</p><pre class="prompt">${esc(p.text)}</pre></article>`)
      .join("")}<p class="muted">${esc(c.englishNote)}</p></section>` +
    `<section>${h2(c.goodBadTitle)}<div class="grid">${c.pairs
      .map((p) => `<article class="card pair"><div><div class="tag">${esc(c.badLabel)}</div><p class="bad">${esc(p.bad)}</p></div><div><div class="tag gen">${esc(c.goodLabel)}</div><p class="good">${esc(p.good)}</p><p class="muted">${esc(p.why)}</p></div></article>`)
      .join("")}</div></section>` +
    `<section>${h2(c.flowTitle, c.flowLead)}<ol class="jobs">${c.flow.map((f) => `<li class="card"><div class="num">${esc(f.step)}</div><h3>${esc(f.title)}</h3><p class="muted">${esc(f.body)}</p></li>`).join("")}</ol></section>` +
    `<section>${h2(c.neverTitle)}<div class="grid">${c.neverItems.map((x) => `<div class="never">${esc(x)}</div>`).join("")}</div></section>` +
    (c.qualityTitle
      ? `<section>${h2(c.qualityTitle, c.qualityLead)}${cards(c.qualityJobs, (i) => `<article class="card"><h3>${esc(i.title)}</h3><p class="muted">${esc(i.body)}</p></article>`)}</section>`
      : "")
  );
}

function pageGuard(t) {
  const c = t.guard;
  return (
    hero(c) +
    prose(c.intro) +
    `<section>${h2(c.risksTitle)}<div class="grid grid-2">${c.risks
      .map((r) => `<article class="card"><h3>${esc(r.title)}</h3><p class="muted">${esc(r.body)}</p><p class="quote">${esc(r.rule)}</p></article>`)
      .join("")}</div></section>` +
    `<section>${h2(c.signTitle)}${prose(c.signBody)}</section>` +
    `<section>${h2(c.nextTitle)}<div class="grid">${c.nextItems.map((n) => `<article class="card"><div class="num">${esc(n.n)}</div><h3>${esc(n.title)}</h3><p class="muted">${esc(n.body)}</p></article>`).join("")}</div></section>` +
    `<section>${h2(c.sourcesTitle)}<div class="grid">${c.sources.map((s) => `<article class="card"><h3>${esc(s.title)}</h3><p class="muted">${esc(s.detail)}</p></article>`).join("")}</div><p style="margin-top:1.5rem;max-width:48rem">${esc(c.close)}</p></section>`
  );
}

function bodyFor(path, t) {
  if (path === "/") return pageStart(t);
  if (path === "/limits") return pageLimits(t);
  if (path === "/tools") return pageTools(t);
  if (path === "/map") return pageMap(t);
  if (DEEP[path]) return pageDeep(t, DEEP[path]);
  if (path === "/trends") return pageTrends(t);
  if (path === "/manufacturing") return pageMfg(t);
  if (path === "/playbook") return pagePlay(t);
  return pageGuard(t);
}

function toSlides(html) {
  const parts = html.split(/<section/);
  const slides = [];
  if (parts[0] && parts[0].trim()) slides.push(parts[0]);
  for (let i = 1; i < parts.length; i++) slides.push("<section" + parts[i]);
  return slides.length ? slides : [html];
}

function fitSlide(stage) {
  const inner = stage && stage.querySelector(".slide-inner");
  if (!inner) return;
  inner.style.transform = "scale(1)";
  const s = Math.min(
    1,
    stage.clientHeight / Math.max(inner.scrollHeight, 1),
    stage.clientWidth / Math.max(inner.scrollWidth, 1),
  );
  inner.style.transformOrigin = "top center";
  inner.style.transform = "scale(" + (s > 0 ? Math.max(s, 0.45) : 1) + ")";
}

function go(delta) {
  const { path, lang, s } = parse();
  const t = COPIES[lang];
  const slides = toSlides(bodyFor(path, t));
  const n = slides.length;
  const i = Math.min(s, n - 1);
  const next = i + delta;
  const chap = ORDER.indexOf(path);
  if (next >= 0 && next < n) {
    location.hash = href(path, lang, next).slice(1);
    return;
  }
  if (next >= n && chap < ORDER.length - 1) {
    location.hash = href(ORDER[chap + 1], lang, 0).slice(1);
    return;
  }
  if (next < 0 && chap > 0) {
    location.hash = href(ORDER[chap - 1], lang, 99).slice(1);
  }
}

function pager(path, t, lang, i, n) {
  return `<div class="bar">
    <p class="sites">SDV · DSC</p>
    <a class="dl" href="./Display-AI-Briefing-SDV-DSC.pptx" download>PPT</a>
    <div class="navbtns">
      <button type="button" class="prevbtn" aria-label="${esc(t.chrome.prev)}">‹</button>
      <span class="count">${i + 1} / ${n}</span>
      <button type="button" class="nextbtn" aria-label="${esc(t.chrome.next)}">›</button>
    </div>
  </div>`;
}

function render() {
  const { path, lang, s } = parse();
  const t = COPIES[lang];
  document.documentElement.lang = lang === "zh" ? "zh-CN" : lang;
  document.title = t.meta.title;
  const slides = toSlides(bodyFor(path, t));
  const n = slides.length;
  const i = Math.min(Math.max(s, 0), n - 1);
  const nav = t.chrome.nav
    .map((nitem) => `<a class="${nitem.href === path ? "on" : ""}" href="${href(nitem.href, lang, 0)}"><span class="n">${esc(nitem.num)}</span>${esc(nitem.label)}</a>`)
    .join("");
  const langs = [
    ["en", "EN"],
    ["ko", "한국어"],
    ["zh", "中文"],
    ["vi", "VI"],
  ]
    .map(([id, lab]) => `<a class="${id === lang ? "on" : ""}" href="${href(path, id, i)}">${lab}</a>`)
    .join("");
  document.getElementById("app").innerHTML = `
    <div class="deck">
    <header class="site">
      <div class="wrap top">
        <a class="brand" href="${href("/", lang, 0)}">
          <svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#e6ebf6"/><rect x="12" y="6" width="14" height="12" rx="2" fill="#143a8c"/><rect x="6" y="14" width="14" height="12" rx="2" fill="#143a8c"/><rect x="8" y="16" width="10" height="8" rx="1" fill="#f4f6fb"/></svg>
          <span class="brand-name">${esc(t.chrome.brand)}</span>
        </a>
        <nav class="sec" id="sec">${nav}</nav>
        <div class="langs" aria-label="Language">${langs}</div>
      </div>
      <div class="progress"><div style="width:${((i + 1) / n) * 100}%"></div></div>
    </header>
    <main class="stage" id="stage">
      <button type="button" class="hit left" aria-label="${esc(t.chrome.prev)}"></button>
      <button type="button" class="hit right" aria-label="${esc(t.chrome.next)}"></button>
      <div class="slide-inner">${slides[i]}</div>
    </main>
    ${pager(path, t, lang, i, n)}
    </div>`;
  document.querySelector(".prevbtn")?.addEventListener("click", () => go(-1));
  document.querySelector(".nextbtn")?.addEventListener("click", () => go(1));
  document.querySelector(".hit.left")?.addEventListener("click", () => go(-1));
  document.querySelector(".hit.right")?.addEventListener("click", () => go(1));
  fitSlide(document.getElementById("stage"));
}

function boot() {
  COPIES = window.__COPIES__;
  addEventListener("hashchange", render);
  addEventListener("resize", () => fitSlide(document.getElementById("stage")));
  addEventListener("keydown", (e) => {
    const tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA") return;
    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft" || e.key === "PageUp" || e.key === "Backspace") {
      e.preventDefault();
      go(-1);
    }
  });
  try { render(); }
  catch (err) {
    document.getElementById("app").innerHTML =
      "<p style='padding:2rem;font-family:sans-serif'>Failed to render: " + String(err) + "</p>";
  }
}
boot();
