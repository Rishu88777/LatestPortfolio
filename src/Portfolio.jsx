import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  MotionConfig,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  AnimatePresence,
} from "framer-motion";
import profile from "./assets/profile.jpg";

const CONTACT_EMAIL = "rishushrivastava264@gmail.com";
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

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
  font-size:clamp(34px,6.2vw,84px);line-height:.94;letter-spacing:-.02em;
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
.rk-contact h2{display:block;font-family:var(--serif);font-weight:500;font-size:clamp(34px,6vw,72px);
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
.rk-link .v{word-break:break-all;font-size:clamp(15px,1.6vw,19px);}
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


/* ---------- motion layer ---------- */
.rk-progress{position:fixed;top:0;left:0;right:0;height:3px;z-index:60;background:var(--marigold);
  transform-origin:0 50%;box-shadow:0 0 12px rgba(231,161,48,.8);}
.rk-glow{position:fixed;top:0;left:0;width:520px;height:520px;margin:-260px 0 0 -260px;border-radius:50%;
  pointer-events:none;z-index:1;mix-blend-mode:soft-light;
  background:radial-gradient(circle,rgba(231,161,48,.55),rgba(231,161,48,0) 62%);}
.rk-cursor{position:fixed;top:0;left:0;width:34px;height:34px;margin:-17px 0 0 -17px;border:1px solid var(--marigold);
  border-radius:50%;pointer-events:none;z-index:70;transition:width .25s,height .25s,margin .25s,background .25s;}
.rk-cursor.big{width:64px;height:64px;margin:-32px 0 0 -32px;background:rgba(231,161,48,.18);}
@media(hover:none){.rk-cursor,.rk-glow{display:none}}
.rk-root a,.rk-root button{cursor:pointer}

.rk-nav{display:flex;gap:20px;}
.rk-nav button{background:none;border:none;color:var(--sage);font:inherit;letter-spacing:inherit;text-transform:inherit;
  position:relative;padding:2px 0;transition:color .2s;}
.rk-nav button:hover{color:var(--marigold);}
.rk-nav button::after{content:"";position:absolute;left:0;right:0;bottom:-3px;height:1px;background:var(--marigold);
  transform:scaleX(0);transform-origin:left;transition:transform .3s;}
.rk-nav button:hover::after{transform:scaleX(1);}

.rk-hero-grid{display:grid;grid-template-columns:1.35fr .8fr;gap:56px;align-items:center;}
.rk-name .ch{display:inline-block;}

/* ID badge */
.rk-badge-wrap{perspective:1100px;justify-self:center;width:100%;max-width:340px;}
.rk-badge{position:relative;transform-style:preserve-3d;background:var(--ink-2);border:1px solid var(--ink-line);
  padding:14px 14px 18px;box-shadow:0 30px 80px rgba(0,0,0,.55),0 0 0 1px rgba(231,161,48,.15);}
.rk-badge .lanyard{position:absolute;top:-34px;left:50%;width:46px;height:12px;margin-left:-23px;background:var(--marigold);
  border-radius:3px;transform:translateZ(30px);}
.rk-badge .lanyard::before{content:"";position:absolute;left:50%;bottom:100%;width:2px;height:60px;background:var(--marigold);opacity:.4;}
.rk-photo{position:relative;overflow:hidden;aspect-ratio:4/4.6;background:#000;transform:translateZ(24px);}
.rk-photo img{width:100%;height:100%;object-fit:cover;object-position:50% 25%;display:block;filter:saturate(1.05) contrast(1.04);}
.rk-photo::after{content:"";position:absolute;inset:0;
  background:repeating-linear-gradient(0deg,rgba(13,23,18,.0) 0 2px,rgba(13,23,18,.16) 2px 3px);pointer-events:none;}
.rk-scan{position:absolute;left:0;right:0;height:70px;z-index:3;pointer-events:none;
  background:linear-gradient(180deg,transparent,rgba(231,161,48,.38),transparent);
  border-bottom:1px solid var(--marigold);animation:scan 3.6s ease-in-out infinite;}
@keyframes scan{0%{top:-70px}100%{top:100%}}
.rk-br{position:absolute;width:18px;height:18px;border:2px solid var(--marigold);z-index:4;}
.rk-br.tl{top:8px;left:8px;border-right:0;border-bottom:0}.rk-br.tr{top:8px;right:8px;border-left:0;border-bottom:0}
.rk-br.bl{bottom:8px;left:8px;border-right:0;border-top:0}.rk-br.brr{bottom:8px;right:8px;border-left:0;border-top:0}
.rk-badge .meta{font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--sage);
  display:flex;justify-content:space-between;align-items:center;margin-top:14px;transform:translateZ(18px);}
.rk-badge .meta b{color:var(--paper);font-size:12.5px;letter-spacing:.06em;}
.rk-badge .meta .ok{color:#9FD3B0;display:flex;align-items:center;gap:6px;}
.rk-chipwrap{position:absolute;z-index:5;}
.rk-chip{display:block;font-family:var(--mono);font-size:10.5px;letter-spacing:.08em;padding:6px 10px;
  background:var(--marigold);color:var(--ink);font-weight:700;box-shadow:0 10px 24px rgba(0,0,0,.4);white-space:nowrap;}
.rk-chip.dark{background:var(--ink);color:var(--marigold);border:1px solid var(--marigold);}

/* sections */
.rk-svc-item{position:relative;}
.rk-svc-item .glow-line{position:absolute;left:0;bottom:-1px;height:2px;width:100%;background:var(--marigold);
  transform:scaleX(0);transform-origin:left;transition:transform .6s cubic-bezier(.2,.7,.2,1);}
.rk-svc-item:hover .glow-line{transform:scaleX(1);}
.rk-client{overflow:hidden;}
.rk-client::before{content:"";position:absolute;inset:0;background:radial-gradient(260px circle at var(--mx,50%) var(--my,50%),rgba(231,161,48,.16),transparent 60%);
  opacity:0;transition:opacity .3s;pointer-events:none;}
.rk-client:hover::before{opacity:1;}

.rk-photo-about{display:none}

/* contact form */
.rk-contact-grid{display:grid;grid-template-columns:1fr 1.15fr;gap:54px;align-items:start;}
.rk-form{background:var(--ink);border:1px solid #2c5642;box-shadow:0 30px 70px rgba(0,0,0,.35);position:relative;overflow:hidden;}
.rk-form-bar{display:flex;align-items:center;gap:8px;padding:11px 16px;border-bottom:1px solid var(--ink-line);
  font-family:var(--mono);font-size:11px;letter-spacing:.1em;color:var(--sage);}
.rk-form-bar i{width:9px;height:9px;border-radius:50%;background:var(--ink-line);display:inline-block;}
.rk-form-bar i:first-child{background:var(--marigold);}
.rk-form-bar span{margin-left:8px;}
.rk-form-body{padding:22px 22px 24px;display:grid;gap:18px;}
.rk-field{position:relative;}
.rk-field label{display:block;font-family:var(--mono);font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;
  color:var(--sage-dim);margin-bottom:8px;transition:color .2s;}
.rk-field:focus-within label{color:var(--marigold);}
.rk-field input,.rk-field textarea{width:100%;background:transparent;border:none;border-bottom:1px solid var(--ink-line);
  color:var(--paper);font-family:var(--mono);font-size:14px;padding:8px 0 10px;outline:none;resize:vertical;border-radius:0;}
.rk-field textarea{min-height:110px;line-height:1.6;}
.rk-field input::placeholder,.rk-field textarea::placeholder{color:#3d5646;}
.rk-field .uline{position:absolute;left:0;bottom:0;height:2px;width:100%;background:var(--marigold);
  transform:scaleX(0);transform-origin:left;transition:transform .35s cubic-bezier(.2,.7,.2,1);}
.rk-field:focus-within .uline{transform:scaleX(1);}
.rk-field .err{font-family:var(--mono);font-size:11px;color:#ff8a6b;margin-top:6px;}
.rk-two{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
.rk-intents{display:flex;flex-wrap:wrap;gap:8px;}
.rk-intent{font-family:var(--mono);font-size:11.5px;letter-spacing:.06em;background:transparent;color:var(--sage);
  border:1px solid var(--ink-line);padding:7px 12px;transition:all .2s;}
.rk-intent:hover{border-color:var(--marigold);color:var(--paper);}
.rk-intent.on{background:var(--marigold);border-color:var(--marigold);color:var(--ink);font-weight:700;}
.rk-send{font-family:var(--mono);font-weight:700;font-size:13px;letter-spacing:.14em;text-transform:uppercase;
  background:var(--marigold);color:var(--ink);border:none;padding:16px 22px;display:flex;align-items:center;
  justify-content:space-between;gap:12px;position:relative;overflow:hidden;}
.rk-send:disabled{opacity:.7;cursor:progress;}
.rk-send::before{content:"";position:absolute;inset:0;background:var(--marigold-soft);transform:translateX(-101%);transition:transform .4s;}
.rk-send:hover::before{transform:translateX(0);}
.rk-send span{position:relative;}
.rk-hp{position:absolute;left:-9999px;opacity:0;height:0;width:0;}
.rk-resp{padding:34px 22px;font-family:var(--mono);color:var(--sage);}
.rk-resp .code{font-size:clamp(34px,6vw,54px);font-weight:800;color:var(--marigold);line-height:1;}
.rk-resp .code.bad{color:#ff8a6b;}
.rk-resp pre{margin-top:18px;font-size:12.5px;line-height:1.8;color:#9bc1aa;white-space:pre-wrap;}
.rk-resp button{margin-top:22px;background:none;border:1px solid var(--marigold);color:var(--marigold);
  font-family:var(--mono);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;padding:10px 16px;}
.rk-resp button:hover{background:var(--marigold);color:var(--ink);}
.rk-spin{width:14px;height:14px;border:2px solid var(--ink);border-top-color:transparent;border-radius:50%;
  display:inline-block;animation:spin .7s linear infinite;position:relative;}
@keyframes spin{to{transform:rotate(360deg)}}

@media(max-width:900px){
  .rk-hero-grid{grid-template-columns:1fr;gap:70px;}
  .rk-badge-wrap{max-width:300px;justify-self:start;}
  .rk-contact-grid{grid-template-columns:1fr;gap:40px;}
  .rk-nav{display:none;}
}
@media(max-width:520px){.rk-two{grid-template-columns:1fr;}}
@media(prefers-reduced-motion:reduce){.rk-scan{animation:none;display:none}}

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

const EASE = [0.2, 0.7, 0.2, 1];

function Fade({ children, className = "", delay = 0, y = 30, as = "div" }) {
  const C = motion[as];
  return (
    <C
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </C>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });
  return <motion.div className="rk-progress" style={{ scaleX }} />;
}

function CursorFx() {
  const x = useMotionValue(-300);
  const y = useMotionValue(-300);
  const gx = useSpring(x, { stiffness: 70, damping: 20 });
  const gy = useSpring(y, { stiffness: 70, damping: 20 });
  const rx = useSpring(x, { stiffness: 380, damping: 32 });
  const ry = useSpring(y, { stiffness: 380, damping: 32 });
  const [big, setBig] = useState(false);
  useEffect(() => {
    const mv = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setBig(!!e.target.closest?.("a,button,input,textarea,.rk-intent"));
    };
    window.addEventListener("mousemove", mv);
    return () => window.removeEventListener("mousemove", mv);
  }, [x, y]);
  return (
    <>
      <motion.div className="rk-glow" style={{ x: gx, y: gy }} />
      <motion.div className={`rk-cursor ${big ? "big" : ""}`} style={{ x: rx, y: ry }} />
    </>
  );
}

// letters drop in one by one, then briefly scramble on hover
const GLYPHS = "01<>/{}[]#$%";
function Scramble({ text }) {
  const [out, setOut] = useState(text);
  const run = () => {
    let i = 0;
    const id = setInterval(() => {
      setOut(
        text
          .split("")
          .map((c, k) => (c === " " || k < i ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join("")
      );
      i += 1;
      if (i > text.length) {
        clearInterval(id);
        setOut(text);
      }
    }, 38);
  };
  return <span onMouseEnter={run}>{out}</span>;
}

function IdBadge({ show }) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 140, damping: 16 });
  const sy = useSpring(ry, { stiffness: 140, damping: 16 });
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 22);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 22);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };
  return (
    <motion.div
      className="rk-badge-wrap"
      onMouseMove={onMove}
      onMouseLeave={reset}
      initial={{ opacity: 0, y: 60, rotate: -4 }}
      animate={show ? { opacity: 1, y: 0, rotate: 0 } : {}}
      transition={{ type: "spring", stiffness: 60, damping: 12, delay: 0.1 }}
    >
      <motion.div className="rk-badge" style={{ rotateX: sx, rotateY: sy }}>
        <span className="lanyard" />
        <div className="rk-chipwrap" style={{ top: 40, right: -26, transform: "translateZ(70px)" }}>
          <motion.span
            className="rk-chip"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          >
            Spring Boot
          </motion.span>
        </div>
        <div className="rk-chipwrap" style={{ bottom: 92, left: -30, transform: "translateZ(80px)" }}>
          <motion.span
            className="rk-chip dark"
            animate={{ y: [0, 9, 0] }}
            transition={{ duration: 4.1, repeat: Infinity, ease: "easeInOut" }}
          >
            99.9% uptime
          </motion.span>
        </div>
        <div className="rk-photo">
          <span className="rk-br tl" /><span className="rk-br tr" /><span className="rk-br bl" /><span className="rk-br brr" />
          <span className="rk-scan" />
          <img src={profile} alt="Rishu Shrivastava" />
        </div>
        <div className="meta">
          <span><b>R. Shrivastava</b><br />SWE · PeLocal</span>
          <span className="ok"><span className="rk-dot" style={{ margin: 0 }} />ACCESS OK</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Magnetic({ children }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 14 });
  const sy = useSpring(y, { stiffness: 200, damping: 14 });
  return (
    <motion.div
      style={{ x: sx, y: sy, display: "inline-block" }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.3);
        y.set((e.clientY - r.top - r.height / 2) * 0.3);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

const INTENTS = ["hire", "freelance", "collab", "just-hi"];
const EMPTY = { name: "", email: "", intent: "hire", message: "", _honey: "" };

function ContactForm() {
  const [f, setF] = useState(EMPTY);
  const [errs, setErrs] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | ok | fail
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = "name is required";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = "valid email is required";
    if (f.message.trim().length < 10) er.message = "tell me a bit more (10+ chars)";
    setErrs(er);
    if (Object.keys(er).length) return;
    if (f._honey) return setStatus("ok"); // bot: pretend success
    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: f.name,
          email: f.email,
          intent: f.intent,
          message: f.message,
          _subject: `Portfolio: ${f.intent} — ${f.name}`,
          _replyto: f.email,
          _template: "table",
          _captcha: "false",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === "false") throw new Error("failed");
      setStatus("ok");
    } catch {
      setStatus("fail");
    }
  };

  const reset = () => {
    setF(EMPTY);
    setErrs({});
    setStatus("idle");
  };

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Portfolio: ${f.intent}`)}&body=${encodeURIComponent(f.message)}`;

  return (
    <div className="rk-form">
      <div className="rk-form-bar"><i /><i /><i /><span>POST /rishu/contact</span></div>
      <AnimatePresence mode="wait">
        {status === "ok" || status === "fail" ? (
          <motion.div
            key="resp"
            className="rk-resp"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className={`code ${status === "fail" ? "bad" : ""}`}>{status === "ok" ? "201 Created" : "503 Unavailable"}</div>
            <pre>
              {status === "ok"
                ? `{\n  "delivered": true,\n  "to": "rishu",\n  "eta": "within 24h"\n}\nThanks ${f.name.split(" ")[0]} — your message is in my inbox.`
                : `{\n  "delivered": false\n}\nCouldn't reach the mail service. Try again, or send it directly: `}
              {status === "fail" && <a href={mailto} style={{ color: "var(--marigold)" }}>open email app ↗</a>}
            </pre>
            <button onClick={reset}>{status === "ok" ? "send another" : "try again"}</button>
          </motion.div>
        ) : (
          <motion.form key="form" className="rk-form-body" onSubmit={submit} noValidate exit={{ opacity: 0 }}>
            <input className="rk-hp" tabIndex={-1} autoComplete="off" value={f._honey} onChange={set("_honey")} aria-hidden="true" />
            <div className="rk-two">
              <div className="rk-field">
                <label htmlFor="c-name">name</label>
                <input id="c-name" value={f.name} onChange={set("name")} placeholder="Ada Lovelace" autoComplete="name" />
                <span className="uline" />
                {errs.name && <div className="err">! {errs.name}</div>}
              </div>
              <div className="rk-field">
                <label htmlFor="c-email">email</label>
                <input id="c-email" type="email" value={f.email} onChange={set("email")} placeholder="ada@company.com" autoComplete="email" />
                <span className="uline" />
                {errs.email && <div className="err">! {errs.email}</div>}
              </div>
            </div>
            <div className="rk-field">
              <label>intent</label>
              <div className="rk-intents">
                {INTENTS.map((i) => (
                  <button type="button" key={i} className={`rk-intent ${f.intent === i ? "on" : ""}`} onClick={() => setF((p) => ({ ...p, intent: i }))}>
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <div className="rk-field">
              <label htmlFor="c-msg">message</label>
              <textarea id="c-msg" value={f.message} onChange={set("message")} placeholder="Tell me about the system you want to build…" />
              <span className="uline" />
              {errs.message && <div className="err">! {errs.message}</div>}
            </div>
            <motion.button className="rk-send" type="submit" disabled={status === "sending"} whileTap={{ scale: 0.97 }}>
              <span>{status === "sending" ? "sending request…" : "send request"}</span>
              <span>{status === "sending" ? <i className="rk-spin" /> : "→"}</span>
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Portfolio() {
  const reduced = useReducedMotion();
  const [lines, setLines] = useState(reduced ? BOOT : []);
  const [phase, setPhase] = useState(reduced ? 2 : 0); // 0 boot, 1 name, 2 done
  const [clock, setClock] = useState("");

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
    <MotionConfig reducedMotion="user">
    <div className="rk-root">
      <style>{STYLES}</style>
      <ScrollProgress />
      <CursorFx />

      {/* status bar */}
      <div className="rk-topbar">
        <span className="brand">RISHU.SYS</span>
        <span className="rk-nav">
          {[["about", "readme"], ["work", "services"], ["stack", "stack"], ["log", "log"], ["contact", "contact"]].map(([id, l]) => (
            <button key={id} onClick={() => nav(id)}>{l}</button>
          ))}
        </span>
        <span className="right">
          <span className="clock">{clock}</span>
          <span><span className="rk-dot" />OPEN TO WORK</span>
        </span>
      </div>

      {/* hero console */}
      <header className="rk-hero">
        <div className="rk-hero-inner">
          <div className="rk-hero-grid">
          <div>
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
            <Scramble text="Rishu" /><br /><Scramble text="Shrivastava" />
          </h1>
          <p className={`rk-role ${phase >= 2 ? "reveal-in" : ""}`} style={{ animationDelay: "0.15s" }}>
            Software Engineer at PeLocal Fintech, building scalable backend services that quietly hold up production for ten lakh users.
          </p>
          </div>
          <IdBadge show={phase >= 1} />
          </div>

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
        <Fade className="rk-about">
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
        </Fade>
      </section>

      {/* clients */}
      <section className="rk-sec" id="clients">
        <div className="rk-eyebrow"><span className="num">02</span> Deployed for <span className="rule" /></div>
        <Fade className="rk-marquee">
          <div className="rk-track">
            {Array.from({ length: 2 }).flatMap((_, k) =>
              ["PNB MetLife", "DMRC", "Hertz Plantation", "1IT Solution", "OND Techsol", "Patna Metro"].map((c) => (
                <span className="rk-marq-item" key={c + k}>{c}</span>
              ))
            )}
          </div>
        </Fade>
        <Fade className="rk-clients">
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
            <motion.div
              className="rk-client"
              key={c.name}
              whileHover={{ y: -4 }}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
              }}
            >
              <div className={`cat ${c.ent ? "ent" : ""}`}><span className="d" /> {c.cat}</div>
              {c.logo
                ? <img className="logo" src={c.logo} alt={c.name} />
                : <div className="wm">{c.name}</div>}
              <div className="role">{c.role}</div>
              <div className="via">{c.via}</div>
            </motion.div>
          ))}
        </Fade>
      </section>

      {/* services */}
      <section className="rk-sec" id="work">
        <div className="rk-eyebrow"><span className="num">03</span> Services in production <span className="rule" /></div>
        <div className="rk-svc">
          {/* svc 1 */}
          <Fade className="rk-svc-item">
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
            <span className="glow-line" />
          </Fade>

          {/* svc 2 */}
          <Fade className="rk-svc-item">
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
            <span className="glow-line" />
          </Fade>

          {/* svc 3 */}
          <Fade className="rk-svc-item">
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
            <span className="glow-line" />
          </Fade>
        </div>
      </section>

      {/* stack */}
      <div className="rk-stack-wrap">
        <section className="rk-stack" id="stack">
          <div className="rk-eyebrow"><span className="num">04</span> Stack manifest <span className="rule" /></div>
          <Fade className="rk-manifest">
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
          </Fade>
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
            <Fade className="rk-logline" key={i}>
              <div className="ts">{e.now ? <><span className="now">{e.ts}</span></> : e.ts}</div>
              <div>
                <h4>{e.h}</h4>
                <div className="org">{e.org}</div>
                <p>{e.p}</p>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      {/* contact */}
      <div className="rk-contact-wrap" id="contact">
        <section className="rk-contact">
          <div className="rk-eyebrow"><span className="num">06</span> Open a connection <span className="rule" /></div>
          <div className="rk-contact-grid">
            <div>
              <Fade as="h2">Let's build the <em>backend</em>.</Fade>
              <Fade as="p" className="lead" delay={0.1}>
                Open to backend and full-stack roles. If you've got a system that needs to stay up under load, fill in the
                request — it lands straight in my inbox.
              </Fade>
              <Fade className="rk-links" delay={0.2}>
                {[
                  ["Email", CONTACT_EMAIL, `mailto:${CONTACT_EMAIL}`],
                  ["Phone", "+91 88777 09208", "tel:+918877709208"],
                  ["LinkedIn", "/in/rishu88777", "https://www.linkedin.com/in/rishu88777/"],
                  ["GitHub", "/Rishu88777", "https://github.com/Rishu88777"],
                ].map(([k, v, href]) => (
                  <a className="rk-link" key={k} href={href} {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
                    <div className="k">{k}</div>
                    <div className="v">{v} <span className="arr">↗</span></div>
                  </a>
                ))}
              </Fade>
            </div>
            <Fade delay={0.15}>
              <ContactForm />
            </Fade>
          </div>
          <div className="rk-foot">
            <span>© 2026 Rishu Shrivastava</span>
            <span>Built with React + Framer Motion · Status: ONLINE</span>
          </div>
        </section>
      </div>
    </div>
    </MotionConfig>
  );
}
