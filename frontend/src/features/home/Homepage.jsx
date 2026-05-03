import { useEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();
  // ── Navbar scroll state ──
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  // ── Scroll fade refs ──
  const fadeRefs = useRef([]);
  const addFadeRef = (el) => { if (el && !fadeRefs.current.includes(el)) fadeRefs.current.push(el); };

  // ── Horizontal scroll track ref ──
  const trackRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);

    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.style.cssText += "opacity:1;transform:translateY(0)"; }),
      { threshold: 0.1 }
    );
    fadeRefs.current.forEach((el) => obs.observe(el));

    return () => { window.removeEventListener("scroll", onScroll); obs.disconnect(); };
  }, []);

  const checkScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 8);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  const scrollCards = (dir) => trackRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });

  // ── Data ──
  const navLinks = ["Features", "Clients", "Pricing", "Blog"];

  const cards = [
    { icon: "✦", accent: "var(--color-primary)", bg: "rgba(16,185,129,0.1)", tag: "AI Resolution", title: "Instant AI Problem Solving", body: "Solve customer issues instantly with an intelligent chatbot before they ever reach a human agent." },
    { icon: "⬡", accent: "var(--color-secondary)", bg: "rgba(52,211,153,0.1)", tag: "Escalation", title: "Smart Ticket Generation", body: "If AI can't resolve it, the system automatically generates a detailed support ticket and routes it." },
    { icon: "◈", accent: "#ef4444", bg: "rgba(239,68,68,0.1)", tag: "Tracking", title: "Live Status Tracking", body: "Customers receive a secure token to seamlessly track the real-time status of their support request." },
    { icon: "◎", accent: "var(--color-accent)", bg: "rgba(14,165,233,0.1)", tag: "Admin Panel", title: "Unified Admin Workspace", body: "A powerful dashboard for your support team to track, update, and resolve escalated customer tickets." },
    { icon: "⟡", accent: "var(--color-primary)", bg: "rgba(16,185,129,0.1)", tag: "Context", title: "Seamless Handoff", body: "Human agents receive full chat transcripts alongside the ticket so customers never have to repeat themselves." },
    { icon: "❋", accent: "#f59e0b", bg: "rgba(245,158,11,0.1)", tag: "Analytics", title: "Insights & Reporting", body: "Track AI resolution rates, escalation metrics, and overall customer satisfaction in one place." },
  ];

  const clients = ["Stripe", "Linear", "Figma", "Notion", "Vercel", "Loom", "Retool", "Pitch", "Raycast", "Cron", "Warp", "Arc"];
  const marqueeDouble = [...clients, ...clients];

  const testimonials = [
    { initials: "SC", color: "var(--color-primary)", name: "Sarah Chen", role: "Support Lead · TechCorp", quote: "ResolveAI handles 70% of our tier-1 support instantly. Our human agents only deal with complex escalations now." },
    { initials: "MW", color: "var(--color-secondary)", name: "Marcus Webb", role: "Head of CS · Arctos", quote: "The automated ticketing handoff is flawless. Customers get instant help, and my team stays perfectly organized." },
    { initials: "PN", color: "var(--color-accent)", name: "Priya Nair", role: "Founder · Lumena", quote: "We reduced our average resolution time from 24 hours to 5 minutes. The admin panel is incredibly intuitive." },
  ];

  const footerCols = [
    { label: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap", "Status"] },
    { label: "Developers", links: ["Docs", "API Reference", "SDKs", "Examples", "Discord"] },
    { label: "Company", links: ["About", "Blog", "Careers", "Press", "Legal"] },
  ];

  const fadeStyle = {
    opacity: 0,
    transform: "translateY(32px)",
    transition: "opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1)",
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "var(--color-background)", color: "#ffffff", }}>

      {/* ── Global Styles + Fonts ── */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { scroll-behavior: smooth; overflow-x: hidden; height: auto !important; overflow-y: auto !important; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: var(--color-border-hover); border-radius: 99px; }

        @keyframes blob  { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(28px,-18px) scale(1.05)} 66%{transform:translate(-18px,14px) scale(.97)} }
        @keyframes blob2 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-22px,16px) scale(.96)} 66%{transform:translate(20px,-12px) scale(1.04)} }
        @keyframes marqL { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes marqR { from{transform:translateX(-50%)} to{transform:translateX(0)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }

        .blob-a { animation: blob  12s ease-in-out infinite; }
        .blob-b { animation: blob2 16s ease-in-out infinite; }
        .marq-l { animation: marqL 30s linear infinite; display:flex; width:max-content; }
        .marq-r { animation: marqR 24s linear infinite; display:flex; width:max-content; }
        .marq-l:hover,.marq-r:hover { animation-play-state:paused; }

        .card-h { transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s ease, border-color .3s; cursor:default; }
        .card-h:hover { transform:translateY(-6px) scale(1.013); box-shadow:0 20px 56px rgba(0,0,0,.4); border-color: var(--color-primary); }

        .snap-x { scroll-snap-type:x mandatory; -webkit-overflow-scrolling:touch; }
        .snap-x::-webkit-scrollbar { display:none; }
        .snap-s { scroll-snap-align:start; }

        .nav-a { position:relative; text-decoration:none; transition:color .2s; font-weight:500; font-size:14px; letter-spacing:.01em; color:var(--color-text-dim); }
        .nav-a::after { content:''; position:absolute; bottom:-4px; left:0; height:1.5px; width:0; background:var(--color-primary); transition:width .3s; }
        .nav-a:hover { color:#ffffff !important; }
        .nav-a:hover::after { width:100%; }

        .h1-in  { animation: fadeUp .7s ease both; }
        .h1-in2 { animation: fadeUp .7s .13s ease both; }
        .h1-in3 { animation: fadeUp .7s .26s ease both; }
        .h1-in4 { animation: fadeUp .7s .40s ease both; }

        .tcard { border:1px solid var(--color-border); border-radius:20px; padding:28px; background:var(--color-surface); transition:border-color .3s,background .3s; cursor:default; }
        .tcard:hover { border-color:rgba(16,185,129,.4); background:rgba(16,185,129,.05); }

        .footer-a { color:var(--color-text-dim); font-size:13px; text-decoration:none; transition:color .2s; display:block; margin-bottom:10px; }
        .footer-a:hover { color:var(--color-primary); }

        .pill { display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:600; letter-spacing:.05em; text-transform:uppercase; padding:6px 14px; border-radius:99px; }

        .btn-dk { display:inline-flex;align-items:center;gap:8px;background:#ffffff;color:#030305;font-weight:600;font-size:14px;letter-spacing:.01em;padding:12px 28px;border-radius:99px;border:none;cursor:pointer;transition:transform .2s,background .2s; }
        .btn-dk:hover { background:#e5e7eb;transform:translateY(-2px); }

        .btn-gl { display:inline-flex;align-items:center;gap:8px;background:transparent;color:#ffffff;font-weight:600;font-size:14px;letter-spacing:.01em;padding:11px 28px;border-radius:99px;border:1.5px solid var(--color-border);cursor:pointer;transition:all .2s; }
        .btn-gl:hover { background:rgba(255,255,255,0.05);border-color:var(--color-border-hover); }

        .btn-gd { display:inline-flex;align-items:center;gap:8px;background:var(--color-primary);color:#ffffff;font-weight:600;font-size:14px;letter-spacing:.01em;padding:12px 28px;border-radius:99px;border:none;cursor:pointer;transition:transform .2s,background .2s,box-shadow .2s; }
        .btn-gd:hover { background:var(--color-primary-dark);transform:translateY(-2px);box-shadow:0 12px 28px rgba(16,185,129,.35); }

        .social-ic { width:32px;height:32px;border-radius:7px;background:var(--color-surface);border:1px solid var(--color-border);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;color:var(--color-text-dim);text-decoration:none;transition:all .2s; }
        .social-ic:hover { background:rgba(16,185,129,.12);color:var(--color-primary);border-color:rgba(16,185,129,.3); }

        @media(max-width:768px){
          .hide-mob{display:none!important;}
          .show-mob{display:flex!important;}
          .footer-g{grid-template-columns:1fr 1fr!important;}
          .tgrid{grid-template-columns:1fr!important;}
        }
      `}</style>

      {/* ══════════════════════════════════════ NAVBAR */}
      <header style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background: scrolled?"rgba(3,3,5,.8)":"transparent", backdropFilter: scrolled?"blur(12px)":"none", borderBottom: scrolled?"1px solid var(--color-border)":"1px solid transparent", transition:"all .3s ease" }}>
        <div style={{ maxWidth:1180, margin:"0 auto", padding:"0 24px", height:72, display:"flex", alignItems:"center", justifyContent:"space-between" }}>

          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, background:"var(--color-primary)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 15px rgba(16,185,129,0.3)" }}>
              <ShieldCheck size={20} color="#ffffff" />
            </div>
            <span style={{ fontWeight:700, fontSize:18, letterSpacing:"-.02em" }}>Resolve<span className="gradient-text">AI</span></span>
          </div>

          {/* Desktop nav */}
          <nav className="hide-mob" style={{ display:"flex", gap:36, alignItems:"center" }}>
            {navLinks.map((l) => <a key={l} href="#" className="nav-a">{l}</a>)}
          </nav>

          {/* Desktop CTA */}
          <div className="hide-mob" style={{ display:"flex", gap:12, alignItems:"center" }}>
            <button onClick={() => navigate("/login")} className="btn-gl" style={{ padding:"8px 20px", fontSize:13 }}>Sign in</button>
            <button onClick={() => navigate("/register")} className="btn-dk" style={{ padding:"8px 20px", fontSize:13 }}>Get started</button>
          </div>

          {/* Hamburger */}
          <button onClick={() => setMobileMenu(!mobileMenu)} className="show-mob" style={{ background:"none", border:"none", cursor:"pointer", padding:6, flexDirection:"column", gap:5, display:"none" }}>
            {[0,1,2].map((i) => (
              <div key={i} style={{ width:22, height:1.5, background:"#ffffff", transition:"all .2s", transform: mobileMenu&&i===0?"rotate(45deg) translate(4px,4px)":mobileMenu&&i===2?"rotate(-45deg) translate(4px,-4px)":"none", opacity:mobileMenu&&i===1?0:1 }} />
            ))}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenu && (
          <div style={{ background:"var(--color-surface)", borderTop:"1px solid var(--color-border)", padding:"20px 24px 28px" }}>
            {navLinks.map((l) => <a key={l} href="#" style={{ display:"block", fontWeight:500, fontSize:15, color:"#ffffff", padding:"12px 0", borderBottom:"1px solid var(--color-border)", textDecoration:"none" }}>{l}</a>)}
            <div style={{ display:"flex", gap:12, marginTop:24 }}>
              <button onClick={() => navigate("/login")} className="btn-gl" style={{ flex:1, justifyContent:"center" }}>Sign in</button>
              <button onClick={() => navigate("/register")} className="btn-dk" style={{ flex:1, justifyContent:"center" }}>Get started</button>
            </div>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════ HERO */}
      <section style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"120px 24px 80px", overflow:"hidden" }}>
        {/* Blobs */}
        <div className="blob-a" style={{ position:"absolute", top:"8%", right:"6%", width:440, height:440, borderRadius:"62% 38% 54% 46% / 48% 52% 48% 52%", background:"radial-gradient(circle,rgba(16,185,129,.15) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div className="blob-b" style={{ position:"absolute", bottom:"10%", left:"4%", width:340, height:340, borderRadius:"52% 48% 40% 60% / 56% 44% 56% 44%", background:"radial-gradient(circle,rgba(52,211,153,.12) 0%,transparent 70%)", pointerEvents:"none" }} />
        {/* Grid */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(var(--color-border) 1px,transparent 1px),linear-gradient(90deg,var(--color-border) 1px,transparent 1px)", backgroundSize:"64px 64px", pointerEvents:"none", opacity: 0.5 }} />

        <div style={{ position:"relative", zIndex:2, maxWidth:880, textAlign:"center" }}>
          {/* Badge */}
          <div className="h1-in glass" style={{ display:"inline-flex", alignItems:"center", gap:10, borderRadius:99, padding:"6px 16px 6px 8px", marginBottom:40 }}>
            <span style={{ background:"var(--color-primary)", color:"#ffffff", fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:99, letterSpacing:".05em" }}>NEW</span>
            <span style={{ fontSize:13, fontWeight:500, color:"#ffffff", letterSpacing:".02em" }}>Smart Automated Ticketing is live <span style={{ color:"var(--color-primary)" }}>→</span></span>
          </div>

          {/* H1 */}
          <h1 className="h1-in2" style={{ fontSize:"clamp(44px,8.5vw,84px)", fontWeight:700, lineHeight:1.05, letterSpacing:"-.03em", marginBottom:32 }}>
            The AI Support Agent<br />
            <span className="gradient-text">your business deserves</span>
          </h1>

          {/* Sub */}
          <p className="h1-in3" style={{ fontSize:"clamp(16px,2vw,20px)", color: "var(--color-text-dim)", lineHeight:1.6, maxWidth:560, margin:"0 auto 48px" }}>
            Instant AI resolution for common issues. Seamless escalation and ticket tracking for everything else. Keep your customers happy and your team efficient.
          </p>

          {/* CTAs */}
          <div className="h1-in4" style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={() => navigate("/register")} className="btn-gd" style={{ fontSize:15, padding:"16px 36px" }}>Start building free</button>
            <button className="btn-gl" style={{ fontSize:15, padding:"16px 36px" }}>
              Watch demo
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 4 }}><polygon points="5 3 19 12 5 21 5 3" /></svg>
            </button>
          </div>

          {/* Social proof */}
          <div className="h1-in4" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:16, marginTop:64 }}>
            <div style={{ display:"flex" }}>
              {["#10b981","#34d399","#0ea5e9","#ef4444"].map((c, i) => (
                <div key={i} style={{ width:34, height:34, borderRadius:"50%", background:c, border:"2.5px solid var(--color-background)", marginLeft:i===0?0:-12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:600, color:"#fff" }}>
                  {["S","M","P","A"][i]}
                </div>
              ))}
            </div>
            <p style={{ fontSize:14, color:"var(--color-text-muted)" }}><strong style={{ color:"#ffffff", fontWeight:600 }}>12,000+</strong> developers building with ResolveAI</p>
          </div>
        </div>

        {/* Fade bottom */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:120, background:"linear-gradient(to bottom,transparent,var(--color-background))", zIndex:3, pointerEvents:"none" }} />
      </section>

      {/* ══════════════════════════════════════ FEATURES — side scroll */}
      <section style={{ padding:"80px 0 60px" }}>
        {/* Header */}
        <div ref={addFadeRef} style={{ ...fadeStyle, maxWidth:680, margin:"0 auto 56px", padding:"0 24px" }}>
          <span className="pill" style={{ background:"rgba(16,185,129,.1)", color:"var(--color-primary)", marginBottom:20, border: "1px solid rgba(16,185,129,.2)" }}>✦ Features</span>
          <h2 style={{ fontSize:"clamp(32px,5vw,56px)", fontWeight:700, lineHeight:1.1, letterSpacing:"-.03em", marginBottom:20 }}>Customer support,<br /><span className="gradient-text">fully automated</span></h2>
          <p style={{ fontSize:18, color:"var(--color-text-dim)", lineHeight:1.6 }}>From intelligent chatbots to a unified admin panel. Resolve issues faster and never lose track of a support ticket.</p>
        </div>

        {/* Scroll wrapper + arrows */}
        <div style={{ position:"relative" }}>
          {[{ dir:-1, show:canLeft, side:"left" },{ dir:1, show:canRight, side:"right" }].map(({ dir, show, side }) => (
            <button key={side} onClick={() => scrollCards(dir)} style={{ position:"absolute", top:"50%", [side]:20, transform:"translateY(-50%)", zIndex:10, width:44, height:44, borderRadius:"50%", background:"var(--color-surface-light)", color:"#ffffff", border:"1px solid var(--color-border)", cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", opacity:show?1:0, pointerEvents:show?"auto":"none", transition:"all .2s", boxShadow:"0 4px 12px rgba(0,0,0,0.5)" }}>
              {dir===-1?"←":"→"}
            </button>
          ))}

          <div ref={trackRef} className="snap-x" onScroll={checkScroll} style={{ display:"flex", gap:20, overflowX:"auto", padding:"10px 56px 40px" }}>
            {cards.map((c, i) => (
              <div key={i} className="card-h snap-s" style={{ minWidth:320, maxWidth:320, flexShrink:0, background:"var(--color-surface)", borderRadius:24, border:"1px solid var(--color-border)", padding:32 }}>
                <div style={{ width:54, height:54, borderRadius:16, background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, color:c.accent, marginBottom:24, border: `1px solid ${c.bg.replace('0.1', '0.2')}` }}>{c.icon}</div>
                <span className="pill" style={{ background:c.bg, color:c.accent, fontSize:11, marginBottom:16 }}>{c.tag}</span>
                <h3 style={{ fontWeight:600, fontSize:18, lineHeight:1.3, marginBottom:12, color:"#ffffff" }}>{c.title}</h3>
                <p style={{ fontSize:14, color:"var(--color-text-dim)", lineHeight:1.6 }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ CLIENTS MARQUEE */}
      <section style={{ padding:"40px 0 80px", overflow:"hidden" }}>
        <div ref={addFadeRef} style={{ ...fadeStyle, textAlign:"center", marginBottom:48 }}>
          <p style={{ fontSize:12, fontWeight:600, letterSpacing:".1em", color:"var(--color-text-muted)", textTransform:"uppercase" }}>Trusted by innovative teams at</p>
        </div>

        {/* Row 1 — left */}
        <div style={{ overflow:"hidden", marginBottom:20 }}>
          <div className="marq-l">
            {marqueeDouble.map((name, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 28px", marginRight:16, background:"var(--color-surface)", border:"1px solid var(--color-border)", borderRadius:99, whiteSpace:"nowrap", flexShrink:0 }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:["#10b981","#34d399","#0ea5e9","#ef4444"][i%4], flexShrink:0, boxShadow:`0 0 8px ${["#10b981","#34d399","#0ea5e9","#ef4444"][i%4]}` }} />
                <span style={{ fontWeight:600, fontSize:14, color:"#ffffff" }}>{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — right */}
        <div style={{ overflow:"hidden" }}>
          <div className="marq-r">
            {[...marqueeDouble].reverse().map((name, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 28px", marginRight:16, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:99, whiteSpace:"nowrap", flexShrink:0 }}>
                <span style={{ fontWeight:500, fontSize:14, color:"var(--color-text-dim)" }}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ TESTIMONIALS */}
      <section style={{ background:"var(--color-surface-light)", padding:"100px 24px", position:"relative", overflow:"hidden", borderTop: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
        <div style={{ position:"absolute", top:-100, right:-100, width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(16,185,129,.1) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-100, left:-100, width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(52,211,153,.08) 0%,transparent 70%)", pointerEvents:"none" }} />

        <div style={{ maxWidth:1160, margin:"0 auto", position: "relative", zIndex: 2 }}>
          <div ref={addFadeRef} style={{ ...fadeStyle, textAlign:"center", marginBottom:64 }}>
            <span className="pill" style={{ background:"rgba(16,185,129,.1)", color:"var(--color-primary)", marginBottom:20, border: "1px solid rgba(16,185,129,.2)" }}>★ Testimonials</span>
            <h2 style={{ fontSize:"clamp(30px,5vw,52px)", fontWeight:700, color:"#ffffff", lineHeight:1.1, letterSpacing:"-.03em" }}>Loved by builders</h2>
          </div>

          <div className="tgrid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="tcard glass">
                <p style={{ fontSize:15, color:"var(--color-text-dim)", lineHeight:1.7, marginBottom:28, fontStyle:"italic" }}>"{t.quote}"</p>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ width:40, height:40, borderRadius:"50%", background:t.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:600, color:"#fff", flexShrink:0, boxShadow: `0 4px 12px ${t.color}40` }}>{t.initials}</div>
                  <div>
                    <p style={{ fontWeight:600, fontSize:14, color:"#ffffff" }}>{t.name}</p>
                    <p style={{ fontSize:13, color:"var(--color-text-muted)", marginTop:2 }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ CTA BANNER */}
      <section style={{ padding:"100px 24px" }}>
        <div ref={addFadeRef} style={{ ...fadeStyle, maxWidth:880, margin:"0 auto", textAlign:"center", background:"var(--color-surface)", border:"1px solid var(--color-border)", borderRadius:32, padding:"80px 48px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(52,211,153,0.05) 100%)", pointerEvents:"none" }} />
          <div style={{ position:"absolute", top:"0%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(16,185,129,.15) 0%,transparent 70%)", pointerEvents:"none" }} />
          
          <div style={{ position: "relative", zIndex: 2 }}>
            <span className="pill" style={{ background:"rgba(16,185,129,.1)", color:"var(--color-primary)", marginBottom:24, border:"1px solid rgba(16,185,129,.2)" }}>✦ Get started today</span>
            <h2 style={{ fontSize:"clamp(32px,5vw,56px)", fontWeight:700, color:"#ffffff", lineHeight:1.1, letterSpacing:"-.03em", marginBottom:24 }}>
              Ready to transform your<br /><span className="gradient-text">customer support?</span>
            </h2>
            <p style={{ fontSize:17, color:"var(--color-text-dim)", maxWidth:440, margin:"0 auto 48px" }}>Deploy your AI agent in minutes. Start for free.</p>
            <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
              <button onClick={() => navigate("/register")} className="btn-gd" style={{ fontSize:15, padding:"16px 36px" }}>Start for free</button>
              <button style={{ display:"inline-flex", alignItems:"center", background:"transparent", color:"#ffffff", fontWeight:600, fontSize:15, padding:"16px 32px", borderRadius:99, border:"1.5px solid var(--color-border)", cursor:"pointer", transition:"all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="var(--color-primary)"; e.currentTarget.style.background="rgba(16,185,129,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="var(--color-border)"; e.currentTarget.style.background="transparent"; }}
              >Talk to sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════ FOOTER */}
      <footer style={{ background:"var(--color-surface-light)", borderTop:"1px solid var(--color-border)", padding:"80px 24px 40px" }}>
        <div style={{ maxWidth:1160, margin:"0 auto" }}>

          {/* Grid */}
          <div className="footer-g" style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:64, marginBottom:80 }}>
            {/* Brand */}
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
                <div style={{ width:32, height:32, background:"var(--color-primary)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 15px rgba(16,185,129,0.3)" }}>
                  <ShieldCheck size={20} color="#ffffff" />
                </div>
                <span style={{ fontWeight:700, fontSize:18, color:"#ffffff" }}>Resolve<span className="gradient-text">AI</span></span>
              </div>
              <p style={{ fontSize:14, color:"var(--color-text-dim)", lineHeight:1.6, maxWidth:260, marginBottom:28 }}>The intelligent customer support layer that bridges the gap between AI automation and human expertise.</p>
              <div style={{ display:"flex", gap:12 }}>
                {["𝕏","in","gh","dc"].map((s, i) => (
                  <a key={i} href="#" className="social-ic">{s}</a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {footerCols.map((col) => (
              <div key={col.label}>
                <p style={{ fontSize:12, fontWeight:600, letterSpacing:".1em", textTransform:"uppercase", color:"#ffffff", marginBottom:24 }}>{col.label}</p>
                {col.links.map((l) => <a key={l} href="#" className="footer-a">{l}</a>)}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ height:1, background:"var(--color-border)", marginBottom:32 }} />

          {/* Bottom */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:20 }}>
            <p style={{ fontSize:13, color:"var(--color-text-muted)" }}>© {new Date().getFullYear()} ResolveAI. All rights reserved.</p>
            <div style={{ display:"flex", gap:24 }}>
              {["Privacy","Terms","Cookies"].map((l) => <a key={l} href="#" className="footer-a" style={{ marginBottom:0 }}>{l}</a>)}
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div style={{ textAlign:"center", marginTop:64, overflow:"hidden", userSelect:"none", pointerEvents:"none" }}>
          <span style={{ fontSize:"clamp(64px,14vw,180px)", fontWeight:800, color:"rgba(255,255,255,0.02)", letterSpacing:"-.04em", display:"block", transform:"translateY(30px)" }}>ResolveAI</span>
        </div>
      </footer>

    </div>
  );
}