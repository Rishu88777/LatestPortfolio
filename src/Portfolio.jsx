import React, { useState, useEffect, useRef, useCallback } from "react";

/*
  RISHU KR SHRIVASTAVA — Portfolio
  Concept: "System Online" — a backend engineer's portfolio framed as a live service.
  The page boots like a server, reports healthy, and exposes work as services/endpoints.
  Type: JetBrains Mono as the display voice (machine) vs. Fraunces serif (human).
  Palette: pine-black console -> warm oat paper, marigold as the single live accent.
*/

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700;800&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&display=swap');

:root{
  --ink:#0D1712;
  --ink-2:#13241B;
  --ink-line:#21392C;
  --paper:#ECE6D6;
  --paper-2:#E4DCC6;
  --pine:#1F4D38;
  --pine-deep:#143528;
  --marigold:#E7A130;
  --marigold-soft:#F0C674;
  --sage:#7E9A89;
  --sage-dim:#56705F;
  --ink-text:#15211B;
  --ink-text-dim:#46584E;
  --mono:'JetBrains Mono',ui-monospace,monospace;
  --serif:'Fraunces',Georgia,serif;
}

*{box-sizing:border-box;margin:0;padding:0}
.rk-root{
  font-family:var(--serif);
  background:var(--paper);
  color:var(--ink-text);
  -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
}
.rk-root ::selection{background:var(--marigold);color:var(--ink);}

.mono{font-family:var(--mono);}
.serif{font-family:var(--serif);}

/* ---------- status bar ---------- */
.rk-topbar{
  position:fixed;top:0;left:0;right:0;z-index:50;
  display:flex;align-items:center;justify-content:space-between;
  padding:11px 22px;
  font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-transform:uppercase;
  background:rgba(13,23,18,.82);backdrop-filter:blur(10px);
  border-bottom:1px solid var(--ink-line);color:var(--sage);
}
.rk-topbar .brand{color:var(--paper);font-weight:700;}
.rk-topbar .right{display:flex;gap:18px;align-items:center;}
.rk-dot{width:7px;height:7px;border-radius:50%;background:var(--marigold);
  display:inline-block;margin-right:7px;box-shadow:0 0 0 0 rgba(231,161,48,.6);
  animation:pulse 2.4s infinite;}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(231,161,48,.55)}70%{box-shadow:0 0 0 7px rgba(231,161,48,0)}100%{box-shadow:0 0 0 0 rgba(231,161,48,0)}}

/* ---------- hero / console ---------- */
.rk-hero{
  background:var(--ink);color:var(--paper);
  min-height:100vh;padding:120px 22px 70px;
  display:flex;flex-direction:column;justify-content:center;position:relative;
  background-image:linear-gradient(var(--ink-line) 1px,transparent 1px),linear-gradient(90deg,var(--ink-line) 1px,transparent 1px);
  background-size:46px 46px;background-position:center;
}
.rk-hero::before{content:"";position:absolute;inset:0;
  background:radial-gradient(120% 90% at 50% 40%,transparent 30%,var(--ink) 100%);}
.rk-hero-inner{max-width:1080px;margin:0 auto;width:100%;position:relative;z-index:2;}

.rk-term{
  font-family:var(--mono);font-size:13.5px;line-height:1.9;color:var(--sage);
  min-height:188px;margin-bottom:30px;
}
.rk-term .ok{color:var(--marigold);}
.rk-term .on{color:#9FD3B0;font-weight:700;}
.rk-term .ln{white-space:pre-wrap;}
.rk-caret{display:inline-block;width:9px;height:16px;background:var(--marigold);
  vertical-align:-2px;margin-left:3px;animation:blink 1s steps(1) infinite;}
@keyframes blink{50%{opacity:0}}

.rk-name{
  font-family:var(--mono);font-weight:800;
  font-size:clamp(38px,8.4vw,104px);line-height:.94;letter-spacing:-.02em;
  color:var(--paper);text-transform:uppercase;
  opacity:0;transform:translateY(14px);
}
.rk-name .am{color:var(--marigold);}
.rk-role{
  font-family:var(--serif);font-style:italic;
  font-size:clamp(18px,2.6vw,26px);color:var(--sage);
  margin-top:18px;max-width:620px;line-height:1.4;
  opacity:0;transform:translateY(14px);
}
.reveal-in{animation:rise .7s cubic-bezier(.2,.7,.2,1) forwards;}
@keyframes rise{to{opacity:1;transform:translateY(0)}}

.rk-metrics{
  display:grid;grid-template-columns:repeat(4,1fr);gap:1px;
  margin-top:46px;background:var(--ink-line);
  border:1px solid var(--ink-line);
  opacity:0;
}
.rk-metric{background:var(--ink);padding:20px 18px;}
.rk-metric .v{font-family:var(--mono);font-weight:700;font-size:clamp(22px,3.2vw,34px);color:var(--paper);}
.rk-metric .v .am{color:var(--marigold);}
.rk-metric .k{font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--sage-dim);margin-top:8px;}

.rk-scroll{margin-top:42px;font-family:var(--mono);font-size:11px;letter-spacing:.2em;
  text-transform:uppercase;color:var(--sage-dim);display:flex;align-items:center;gap:10px;opacity:0;}
.rk-scroll .bar{width:34px;height:1px;background:var(--sage-dim);position:relative;overflow:hidden;}
.rk-scroll .bar::after{content:"";position:absolute;inset:0;background:var(--marigold);
  transform:translateX(-100%);animation:sweep 2.2s ease-in-out infinite;}
@keyframes sweep{50%{transform:translateX(0)}100%{transform:translateX(100%)}}

/* ---------- generic section ---------- */
.rk-sec{max-width:1080px;margin:0 auto;padding:96px 22px;}
.rk-eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.24em;text-transform:uppercase;
  color:var(--pine);display:flex;align-items:center;gap:12px;margin-bottom:26px;}
.rk-eyebrow .num{color:var(--marigold);}
.rk-eyebrow .rule{flex:1;height:1px;background:var(--paper-2);}

.fade{opacity:0;transform:translateY(26px);transition:opacity .8s ease,transform .8s cubic-bezier(.2,.7,.2,1);}
.fade.vis{opacity:1;transform:translateY(0);}

/* ---------- about ---------- */
.rk-about{display:grid;grid-template-columns:1.6fr 1fr;gap:54px;align-items:start;}
.rk-about h2{font-family:var(--serif);font-weight:500;font-size:clamp(26px,4vw,44px);
  line-height:1.22;letter-spacing:-.01em;color:var(--ink-text);}
.rk-about h2 em{font-style:italic;color:var(--pine);}
.rk-about .marg{font-family:var(--serif);font-size:17px;line-height:1.7;color:var(--ink-text-dim);}
.rk-sidecard{border:1px solid var(--paper-2);background:var(--paper-2);}
.rk-sidecard .row{display:flex;justify-content:space-between;gap:14px;padding:13px 16px;
  font-family:var(--mono);font-size:12px;border-bottom:1px solid #d6cdb4;}
.rk-sidecard .row:last-child{border-bottom:none;}
.rk-sidecard .row .lbl{color:var(--ink-text-dim);letter-spacing:.08em;text-transform:uppercase;font-size:10.5px;}
.rk-sidecard .row .val{color:var(--ink-text);text-align:right;}
.rk-sidecard .row .val.live{color:var(--pine);font-weight:700;}

/* ---------- services / work ---------- */
.rk-svc{border-top:1px solid var(--paper-2);}
.rk-svc-item{padding:38px 0;border-bottom:1px solid var(--paper-2);
  display:grid;grid-template-columns:200px 1fr;gap:34px;transition:padding-left .4s ease;}
.rk-svc-item:hover{padding-left:14px;}
.rk-svc-meta .method{font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:.12em;
  color:var(--ink);background:var(--marigold);padding:4px 9px;display:inline-block;}
.rk-svc-meta .since{font-family:var(--mono);font-size:11px;color:var(--ink-text-dim);
  margin-top:14px;letter-spacing:.1em;text-transform:uppercase;}
.rk-svc-meta .badge{font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--pine);margin-top:8px;display:flex;align-items:center;gap:7px;}
.rk-svc-meta .badge .d{width:6px;height:6px;border-radius:50%;background:var(--pine);}
.rk-svc-body h3{font-family:var(--serif);font-weight:600;font-size:clamp(22px,3vw,30px);
  letter-spacing:-.01em;color:var(--ink-text);line-height:1.1;}
.rk-svc-body .path{font-family:var(--mono);font-size:12.5px;color:var(--pine);margin:9px 0 16px;}
.rk-svc-body .desc{font-family:var(--serif);font-size:17px;line-height:1.65;color:var(--ink-text-dim);max-width:660px;}
.rk-ep{list-style:none;margin:18px 0 20px;}
.rk-ep li{font-family:var(--mono);font-size:12.5px;line-height:1.55;color:var(--ink-text);
  padding-left:22px;position:relative;margin-bottom:9px;}
.rk-ep li::before{content:"200";position:absolute;left:0;top:0;color:var(--pine);font-weight:700;font-size:10px;letter-spacing:.05em;}
.rk-tags{display:flex;flex-wrap:wrap;gap:7px;}
.rk-tag{font-family:var(--mono);font-size:11px;letter-spacing:.06em;color:var(--ink-text-dim);
  border:1px solid var(--paper-2);padding:4px 10px;background:var(--paper);}

/* ---------- stack ---------- */
.rk-stack-wrap{background:var(--ink);color:var(--paper);}
.rk-stack{max-width:1080px;margin:0 auto;padding:96px 22px;}
.rk-stack .rk-eyebrow{color:var(--sage);}
.rk-stack .rk-eyebrow .rule{background:var(--ink-line);}
.rk-manifest{font-family:var(--mono);font-size:13px;line-height:1;margin-top:10px;}
.rk-mrow{display:grid;grid-template-columns:200px 1fr;gap:24px;padding:20px 0;
  border-bottom:1px solid var(--ink-line);align-items:baseline;}
.rk-mrow .grp{color:var(--sage-dim);letter-spacing:.16em;text-transform:uppercase;font-size:11px;}
.rk-mrow .deps{display:flex;flex-wrap:wrap;gap:10px 18px;}
.rk-mrow .dep{color:var(--paper);position:relative;}
.rk-mrow .dep .v{color:var(--marigold);font-size:11px;margin-left:6px;}

/* ---------- log / timeline ---------- */
.rk-log{position:relative;margin-top:8px;}
.rk-logline{display:grid;grid-template-columns:150px 1fr;gap:26px;padding:22px 0;
  border-bottom:1px solid var(--paper-2);}
.rk-logline .ts{font-family:var(--mono);font-size:12px;color:var(--ink-text-dim);letter-spacing:.06em;padding-top:4px;}
.rk-logline .ts .now{color:var(--pine);font-weight:700;}
.rk-logline h4{font-family:var(--serif);font-weight:600;font-size:21px;color:var(--ink-text);}
.rk-logline .org{font-family:var(--mono);font-size:12px;color:var(--pine);margin-top:5px;letter-spacing:.04em;}
.rk-logline p{font-family:var(--serif);font-size:15.5px;line-height:1.6;color:var(--ink-text-dim);margin-top:10px;max-width:640px;}

/* ---------- contact ---------- */
.rk-contact-wrap{background:var(--pine-deep);color:var(--paper);}
.rk-contact{max-width:1080px;margin:0 auto;padding:104px 22px;}
.rk-contact .rk-eyebrow{color:var(--marigold-soft);}
.rk-contact .rk-eyebrow .rule{background:#2c5642;}
.rk-contact h2{font-family:var(--serif);font-weight:500;font-size:clamp(34px,6vw,72px);
  line-height:1.04;letter-spacing:-.02em;color:var(--paper);margin-bottom:8px;}
.rk-contact h2 em{font-style:italic;color:var(--marigold);}
.rk-contact .lead{font-family:var(--serif);font-size:18px;color:#bcd2c4;max-width:560px;line-height:1.6;margin-bottom:40px;}
.rk-req{font-family:var(--mono);font-size:12.5px;color:#9bc1aa;margin-bottom:34px;line-height:1.9;}
.rk-req .m{color:var(--marigold);font-weight:700;}
.rk-links{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;background:#2c5642;border:1px solid #2c5642;}
.rk-link{background:var(--pine-deep);padding:22px;text-decoration:none;display:block;transition:background .25s ease;}
.rk-link:hover{background:#15392b;}
.rk-link .k{font-family:var(--mono);font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:#7ea58c;}
.rk-link .v{font-family:var(--serif);font-size:20px;color:var(--paper);margin-top:7px;
  display:flex;align-items:center;gap:9px;}
.rk-link:hover .v{color:var(--marigold-soft);}
.rk-link .arr{font-family:var(--mono);transition:transform .25s ease;}
.rk-link:hover .arr{transform:translate(3px,-3px);}

.rk-foot{font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;
  color:#6f9682;margin-top:54px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;}

/* ---------- clients ---------- */
.rk-marquee{overflow:hidden;border-top:1px solid var(--paper-2);border-bottom:1px solid var(--paper-2);
  padding:18px 0;margin-bottom:40px;-webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);
  mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);}
.rk-track{display:flex;width:max-content;gap:0;animation:marq 26s linear infinite;}
.rk-marquee:hover .rk-track{animation-play-state:paused;}
@keyframes marq{to{transform:translateX(-50%)}}
.rk-marq-item{font-family:var(--mono);font-size:13px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--ink-text-dim);padding:0 30px;display:flex;align-items:center;gap:30px;white-space:nowrap;}
.rk-marq-item::after{content:"";width:5px;height:5px;background:var(--marigold);transform:rotate(45deg);display:inline-block;}

.rk-clients{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--paper-2);border:1px solid var(--paper-2);}
.rk-client{background:var(--paper);padding:30px 26px;transition:background .3s ease,transform .3s ease;position:relative;}
.rk-client:hover{background:#fff;}
.rk-client .cat{font-family:var(--mono);font-size:10px;letter-spacing:.18em;text-transform:uppercase;
  color:var(--marigold);display:flex;align-items:center;gap:7px;margin-bottom:16px;}
.rk-client .cat .d{width:6px;height:6px;border-radius:50%;background:var(--marigold);}
.rk-client .cat.ent{color:var(--pine);} .rk-client .cat.ent .d{background:var(--pine);}
.rk-client .wm{font-family:var(--serif);font-weight:600;font-size:25px;letter-spacing:-.01em;color:var(--ink-text);line-height:1.05;}
.rk-client .logo{display:block;max-height:46px;max-width:170px;object-fit:contain;}
.rk-client .role{font-family:var(--mono);font-size:11.5px;line-height:1.5;color:var(--ink-text-dim);margin-top:12px;}
.rk-client .via{font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--sage-dim);margin-top:14px;}

/* ---------- responsive ---------- */
@media(max-width:760px){
  .rk-clients{grid-template-columns:1fr;}
  .rk-metrics{grid-template-columns:repeat(2,1fr);}
  .rk-about{grid-template-columns:1fr;gap:34px;}
  .rk-svc-item{grid-template-columns:1fr;gap:16px;}
  .rk-svc-item:hover{padding-left:0;}
  .rk-mrow{grid-template-columns:1fr;gap:12px;}
  .rk-logline{grid-template-columns:1fr;gap:8px;}
  .rk-links{grid-template-columns:1fr;}
  .rk-topbar .right .clock{display:none;}
  .rk-sec{padding:64px 20px;}
}
@media(prefers-reduced-motion:reduce){
  .rk-name,.rk-role,.rk-metrics,.rk-scroll{opacity:1!important;transform:none!important;animation:none!important;}
  .rk-caret,.rk-dot,.rk-scroll .bar::after{animation:none!important;}
  .rk-track{animation:none!important;}
  .fade{opacity:1;transform:none;transition:none;}
}
`;

const BOOT = [
  { t: "> initializing rishu.system …", d: 90 },
  { t: "> runtime: java 17 · spring boot ……………… ok", d: 520, ok: true },
  { t: "> datastores: postgresql · mongodb · mysql … ok", d: 980, ok: true },
  { t: "> services: 4 modules decoupled ………………… ok", d: 1380, ok: true },
  { t: "> health check ………………………………………………… 200 OK", d: 1760, ok: true },
  { t: "> system status: ONLINE", d: 2080, on: true },
];

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(m.matches);
    const h = (e) => setR(e.matches);
    m.addEventListener?.("change", h);
    return () => m.removeEventListener?.("change", h);
  }, []);
  return r;
}

function Counter({ to, suffix = "", prefix = "", reduced }) {
  const [val, setVal] = useState(reduced ? to : 0);
  const ref = useRef(null);
  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    let started = false;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true;
          const start = performance.now();
          const dur = 1400;
          const tick = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(to * eased);
            if (p < 1) requestAnimationFrame(tick);
            else setVal(to);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, reduced]);
  const display = Number.isInteger(to) ? Math.round(val) : val.toFixed(1);
  return (
    <span ref={ref}>
      {prefix}
      <span className="am">{display}</span>
      {suffix}
    </span>
  );
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    el.querySelectorAll(".fade").forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);
  return ref;
}

export default function Portfolio() {
  const reduced = useReducedMotion();
  const [lines, setLines] = useState(reduced ? BOOT : []);
  const [phase, setPhase] = useState(reduced ? 2 : 0); // 0 boot, 1 name, 2 done
  const [clock, setClock] = useState("");
  const root = useReveal();

  // boot sequence
  useEffect(() => {
    if (reduced) {
      setPhase(2);
      return;
    }
    const timers = [];
    BOOT.forEach((b, i) => {
      timers.push(setTimeout(() => setLines((prev) => [...prev, b]), b.d));
    });
    timers.push(setTimeout(() => setPhase(1), 2300));
    timers.push(setTimeout(() => setPhase(2), 2900));
    return () => timers.forEach(clearTimeout);
  }, [reduced]);

  // live clock (IST)
  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      const opts = { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Asia/Kolkata" };
      setClock(d.toLocaleTimeString("en-GB", opts) + " IST");
    };
    fmt();
    const id = setInterval(fmt, 1000);
    return () => clearInterval(id);
  }, []);

  const nav = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  }, [reduced]);

  const nameAnim = phase >= 1 ? "reveal-in" : "";

  return (
    <div className="rk-root" ref={root}>
      <style>{STYLES}</style>

      {/* status bar */}
      <div className="rk-topbar">
        <span className="brand">RISHU.SYS</span>
        <span className="right">
          <span className="clock">{clock}</span>
          <span><span className="rk-dot" />OPEN TO WORK</span>
        </span>
      </div>

      {/* hero console */}
      <header className="rk-hero">
        <div className="rk-hero-inner">
          <div className="rk-term" aria-hidden="true">
            {lines.map((l, i) => (
              <div className="ln" key={i}>
                <span className={l.on ? "" : ""}>{l.t.replace(/(ok|200 OK|ONLINE)$/i, "")}</span>
                {l.ok && <span className="ok">{l.t.match(/200 OK$/) ? "200 OK" : "ok"}</span>}
                {l.on && <span className="on">ONLINE</span>}
              </div>
            ))}
            {phase < 2 && <span className="rk-caret" />}
          </div>

          <h1 className={`rk-name ${nameAnim}`} style={phase >= 1 ? { animationDelay: "0s" } : undefined}>
            Rishu<br />Shrivastav<span className="am">a</span>
          </h1>
          <p className={`rk-role ${phase >= 2 ? "reveal-in" : ""}`} style={{ animationDelay: "0.15s" }}>
            Software Engineer at PeLocal Fintech, building scalable backend services that quietly hold up production for ten lakh users.
          </p>

          <div className="rk-metrics" style={phase >= 2 ? { animation: "rise .7s cubic-bezier(.2,.7,.2,1) .3s forwards" } : undefined}>
            <div className="rk-metric"><div className="v"><Counter to={10} suffix="L+" reduced={reduced} /></div><div className="k">Users served</div></div>
            <div className="rk-metric"><div className="v"><Counter to={99.9} suffix="%" reduced={reduced} /></div><div className="k">Uptime</div></div>
            <div className="rk-metric"><div className="v">−<Counter to={20} suffix="%" reduced={reduced} /></div><div className="k">API latency</div></div>
            <div className="rk-metric"><div className="v"><Counter to={500} suffix="+" reduced={reduced} /></div><div className="k">Concurrent req</div></div>
          </div>

          <div className="rk-scroll" style={phase >= 2 ? { animation: "rise .6s ease .55s forwards" } : undefined}>
            <span className="bar" /> scroll to inspect
          </div>
        </div>
      </header>

      {/* about */}
      <section className="rk-sec" id="about">
        <div className="rk-eyebrow"><span className="num">01</span> README <span className="rule" /></div>
        <div className="rk-about fade">
          <h2>
            I work on the half of the product nobody sees — the <em>APIs, schemas and payment flows</em> that have to be right every single time.
          </h2>
          <div>
            <p className="marg">
              A year-plus into fintech at PeLocal, shipping production Spring Boot services across insurance and messaging
              platforms. I care about clean query design, sane architecture, and systems that stay up when traffic doesn't.
            </p>
            <div className="rk-sidecard" style={{ marginTop: 24 }}>
              <div className="row"><span className="lbl">Location</span><span className="val">Greater Noida, IN</span></div>
              <div className="row"><span className="lbl">Role</span><span className="val">Software Engineer · PeLocal</span></div>
              <div className="row"><span className="lbl">Focus</span><span className="val">Backend · Microservices</span></div>
              <div className="row"><span className="lbl">Status</span><span className="val live">● Available</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* clients */}
      <section className="rk-sec" id="clients">
        <div className="rk-eyebrow"><span className="num">02</span> Deployed for <span className="rule" /></div>
        <div className="rk-marquee fade">
          <div className="rk-track">
            {Array.from({ length: 2 }).flatMap((_, k) =>
              ["PNB MetLife", "DMRC", "Hertz Plantation", "1IT Solution", "OND Techsol", "Patna Metro"].map((c) => (
                <span className="rk-marq-item" key={c + k}>{c}</span>
              ))
            )}
          </div>
        </div>
        <div className="rk-clients fade">
          {/*
            To show a real logo: set `logo` to an imported asset or a URL you have rights to use,
            e.g.  import hertz from "./assets/hertz.png";  then  logo: hertz
            Leave `logo` empty ("") to display the typographic wordmark (default).
          */}
          {[
            { name: "PNB MetLife", logo: "", cat: "Enterprise", ent: true, role: "Customer portal & WhatsApp bot platform serving 10L+ users.", via: "via PeLocal Fintech" },
            { name: "DMRC", logo: "", cat: "Enterprise", ent: true, role: "WhatsApp ticketing & customer-messaging workflows.", via: "via PeLocal Fintech" },
            { name: "Patna Metro", logo: "", cat: "Enterprise", ent: true, role: "End-to-end WhatsApp ticket-booking bot with PayU + QR.", via: "PMRC" },
            { name: "Hertz Plantation", logo: "", cat: "Freelance", ent: false, role: "Web & backend development.", via: "Independent" },
            { name: "1IT Solution", logo: "", cat: "Freelance", ent: false, role: "Web & backend development.", via: "Independent" },
            { name: "OND Techsol", logo: "", cat: "Freelance", ent: false, role: "Web & backend development.", via: "Independent" },
          ].map((c) => (
            <div className="rk-client" key={c.name}>
              <div className={`cat ${c.ent ? "ent" : ""}`}><span className="d" /> {c.cat}</div>
              {c.logo
                ? <img className="logo" src={c.logo} alt={c.name} />
                : <div className="wm">{c.name}</div>}
              <div className="role">{c.role}</div>
              <div className="via">{c.via}</div>
            </div>
          ))}
        </div>
      </section>

      {/* services */}
      <section className="rk-sec" id="work">
        <div className="rk-eyebrow"><span className="num">03</span> Services in production <span className="rule" /></div>
        <div className="rk-svc">
          {/* svc 1 */}
          <div className="rk-svc-item fade">
            <div className="rk-svc-meta">
              <span className="method">GET /portal</span>
              <div className="badge"><span className="d" /> Production</div>
              <div className="since">Since Mar 2025</div>
            </div>
            <div className="rk-svc-body">
              <h3>Customer Portal</h3>
              <div className="path">pnb-metlife · java + spring boot · microservices</div>
              <p className="desc">
                A large-scale insurance customer portal serving 10L+ users, built on a microservices architecture with four
                core services decoupled for independent deployment.
              </p>
              <ul className="rk-ep">
                <li>Integrated Pay&nbsp;Later, QR, IPPB and BASBA mandate flows via the BillDesk gateway.</li>
                <li>Handled JWT-based callback decryption and persisted transactions to PostgreSQL / MySQL.</li>
                <li>Tuned query design and indexing — ~20% lower latency, ~30% faster retrieval.</li>
                <li>Connection-pooled multi-database setup handling 500+ concurrent requests at 99.9% uptime.</li>
              </ul>
              <div className="rk-tags">
                {["Java", "Spring Boot", "PostgreSQL", "MySQL", "BillDesk", "JWT", "Microservices"].map((t) => (
                  <span className="rk-tag" key={t}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* svc 2 */}
          <div className="rk-svc-item fade">
            <div className="rk-svc-meta">
              <span className="method">GET /whatsapp</span>
              <div className="badge"><span className="d" /> Production</div>
              <div className="since">Since Aug 2025</div>
            </div>
            <div className="rk-svc-body">
              <h3>WhatsApp Bot Platform</h3>
              <div className="path">pnb-metlife · meta cloud api · spring boot</div>
              <p className="desc">
                A customer-service bot integrated with Meta's WhatsApp Business Cloud API, backed by a database-driven
                template engine for storing, versioning and rendering message templates dynamically.
              </p>
              <ul className="rk-ep">
                <li>Built template management with versioning, prioritization and dynamic rendering.</li>
                <li>Implemented Single Sign-On for secure auth across internal and external apps.</li>
                <li>Designed and consumed REST APIs powering the bot's conversational workflows.</li>
              </ul>
              <div className="rk-tags">
                {["Java", "Spring Boot", "Meta Cloud API", "MongoDB", "SSO", "REST"].map((t) => (
                  <span className="rk-tag" key={t}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* svc 3 */}
          <div className="rk-svc-item fade">
            <div className="rk-svc-meta">
              <span className="method">POST /tickets</span>
              <div className="badge"><span className="d" /> Shipped</div>
              <div className="since">Self-initiated build</div>
            </div>
            <div className="rk-svc-body">
              <h3>Patna Metro Ticket Bot</h3>
              <div className="path">pmrc · payu · whatsapp cloud api</div>
              <p className="desc">
                A WhatsApp bot for Patna Metro Rail Corporation that sells tickets end-to-end — from fare selection to a
                paid, scannable QR ticket delivered right inside the chat.
              </p>
              <ul className="rk-ep">
                <li>Integrated PayU with an auto-submitting HTML redirect to capture browser-side payments.</li>
                <li>Generated QR tickets from encrypted ticket strings and uploaded media to WhatsApp.</li>
                <li>Built the Spring Boot flow tying Cloud API messaging to the payment + ticketing lifecycle.</li>
              </ul>
              <div className="rk-tags">
                {["Java", "Spring Boot", "PayU", "WhatsApp Cloud API", "QR", "PostgreSQL"].map((t) => (
                  <span className="rk-tag" key={t}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* stack */}
      <div className="rk-stack-wrap">
        <section className="rk-stack" id="stack">
          <div className="rk-eyebrow"><span className="num">04</span> Stack manifest <span className="rule" /></div>
          <div className="rk-manifest fade">
            {[
              { grp: "languages", deps: [["Java", "17"], ["C", ""], ["SQL", ""]] },
              { grp: "frameworks", deps: [["Spring Boot", ""], ["Hibernate", ""]] },
              { grp: "ai / llm", deps: [["Spring AI", ""], ["RAG", "familiar"], ["Claude", ""]] },
              { grp: "messaging / apis", deps: [["Meta Cloud API", ""], ["WhatsApp Bots", "many"], ["WhatsApp Flows", ""], ["Graph API", ""]] },
              { grp: "architecture", deps: [["Microservices", ""], ["REST APIs", ""], ["Layered", ""]] },
              { grp: "datastores", deps: [["PostgreSQL", ""], ["MongoDB", ""], ["MySQL", ""]] },
              { grp: "devops & tools", deps: [["Docker", ""], ["Git", ""], ["GitHub", ""], ["Postman", ""], ["Maven", ""]] },
            ].map((row) => (
              <div className="rk-mrow" key={row.grp}>
                <span className="grp">{row.grp}</span>
                <div className="deps">
                  {row.deps.map(([d, v]) => (
                    <span className="dep" key={d}>{d}{v && <span className="v">{v}</span>}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* deploy log */}
      <section className="rk-sec" id="log">
        <div className="rk-eyebrow"><span className="num">05</span> Deploy log <span className="rule" /></div>
        <div className="rk-log">
          {[
            { ts: "Mar 2025 — now", now: true, h: "Software Engineer", org: "PeLocal Fintech Pvt. Ltd.", p: "Building and shipping production Spring Boot services across insurance and messaging platforms in an Agile, CI/CD workflow." },
            { ts: "May — Jul 2024", h: "SQL Intern", org: "Celebal Technologies", p: "Delivered every assigned task on schedule through an 8-week intensive focused on industry-standard database practices." },
            { ts: "2021 — 2025", h: "B.Tech, Computer Science & Engineering", org: "IILM College of Engineering & Technology", p: "Foundations in data structures, systems and software engineering." },
            { ts: "2023 — 2025", h: "Certifications", org: "Claude Code in Action · Anthropic · Java + DSA · Apna College · AWS & React · Udemy", p: "Continued building depth in core Java, problem-solving, AI-assisted development and cloud / frontend fundamentals." },
          ].map((e, i) => (
            <div className="rk-logline fade" key={i}>
              <div className="ts">{e.now ? <><span className="now">{e.ts}</span></> : e.ts}</div>
              <div>
                <h4>{e.h}</h4>
                <div className="org">{e.org}</div>
                <p>{e.p}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* contact */}
      <div className="rk-contact-wrap" id="contact">
        <section className="rk-contact">
          <div className="rk-eyebrow"><span className="num">06</span> Open a connection <span className="rule" /></div>
          <h2 className="fade">Let's build the <em>backend</em>.</h2>
          <p className="lead fade">
            Open to backend and full-stack roles. If you've got a system that needs to stay up under load, I'd like to hear about it.
          </p>
          <div className="rk-req fade">
            <div><span className="m">POST</span> /rishu/contact</div>
            <div>{`{ "intent": "hire", "role": "java-backend", "response": "within-24h" }`}</div>
          </div>
          <div className="rk-links fade">
            <a className="rk-link" href="mailto:rishushrivastava264@gmail.com">
              <div className="k">Email</div><div className="v">rishushrivastava264@gmail.com <span className="arr">↗</span></div>
            </a>
            <a className="rk-link" href="tel:+918877709208">
              <div className="k">Phone</div><div className="v">+91 88777 09208 <span className="arr">↗</span></div>
            </a>
            <a className="rk-link" href="https://www.linkedin.com/in/rishu88777/" target="_blank" rel="noreferrer">
              <div className="k">LinkedIn</div><div className="v">/in/rishu88777 <span className="arr">↗</span></div>
            </a>
            <a className="rk-link" href="https://github.com/Rishu88777" target="_blank" rel="noreferrer">
              <div className="k">GitHub</div><div className="v">/Rishu88777 <span className="arr">↗</span></div>
            </a>
          </div>
          <div className="rk-foot">
            <span>© 2026 Rishu Shrivastava</span>
            <span>Built with React · Status: ONLINE</span>
          </div>
        </section>
      </div>
    </div>
  );
}
