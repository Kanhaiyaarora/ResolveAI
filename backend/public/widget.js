(function () {
  // ─── 1. Extract companyId from this script's own src ───────────────────────
  var scripts = document.getElementsByTagName("script");
  var currentScript = document.currentScript || scripts[scripts.length - 1];
  var srcUrl = new URL(currentScript.src);
  var companyId = srcUrl.searchParams.get("cid");
  var API_BASE = srcUrl.origin; // e.g. http://localhost:3000

  if (!companyId) {
    console.warn("[ResolveAI] Missing company ID (cid) in script src.");
    return;
  }

  // ─── 2. Session & conversation persistence via localStorage ────────────────
  var SESSION_KEY = "resolveai_session_" + companyId;
  var CONV_KEY = "resolveai_conv_" + companyId;

  var sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId =
      "sess_" + Math.random().toString(36).substr(2, 10) + "_" + Date.now();
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  // ─── 3. Fetch widget settings with cache buster ───────────────────────────
  fetch(API_BASE + "/api/company/widget-settings?cid=" + companyId + "&t=" + Date.now())
    .then(function (r) { return r.json(); })
    .then(function (data) {
      initWidget(data.success ? data.settings : {});
    })
    .catch(function (err) {
      console.error("[ResolveAI] Fetch error:", err);
      initWidget({});
    });

  function initWidget(settings) {
    // Check both primaryColor and color (for backward compatibility if needed)
    var color    = settings.primaryColor || settings.color || "#10b981";
    var position = settings.position      || "right";
    var botName  = settings.botName       || "Support Bot";
    var welcome  = settings.welcomeMessage|| "Hi! How can we help you today?";

    // ─── 4. Inject CSS ───────────────────────────────────────────────────────
    var style = document.createElement("style");
    style.textContent =
      "#rai-btn{" +
        "position:fixed;" + position + ":24px;bottom:24px;" +
        "width:56px;height:56px;border-radius:50%;" +
        "background:" + color + " !important;" +
        "border:none;cursor:pointer;" +
        "z-index:2147483647;box-shadow:0 4px 24px rgba(0,0,0,.28);" +
        "display:flex;align-items:center;justify-content:center;" +
        "transition:transform .2s,box-shadow .2s;" +
      "}" +
      "#rai-btn:hover{transform:scale(1.09);box-shadow:0 6px 36px rgba(0,0,0,.38);}" +
      "#rai-frame{" +
        "position:fixed;" + position + ":24px;bottom:90px;" +
        "width:380px;height:580px;max-height:calc(100vh - 110px);" +
        "border:none;border-radius:20px;z-index:2147483646;" +
        "box-shadow:0 8px 48px rgba(0,0,0,.32);" +
        "display:none;overflow:hidden;" +
        "transition:opacity .2s,transform .2s;" +
      "}" +
      "@media(max-width:480px){" +
        "#rai-frame{width:calc(100vw - 16px);" + position + ":8px;bottom:80px;height:calc(100vh - 96px);}" +
        "#rai-btn{" + position + ":14px;bottom:14px;}" +
      "}";
    document.head.appendChild(style);

    // ─── 5. Floating bubble button ───────────────────────────────────────────
    var btn = document.createElement("button");
    btn.id = "rai-btn";
    btn.setAttribute("aria-label", "Open support chat");
    btn.style.backgroundColor = color; // Force apply color directly to element
    btn.innerHTML = chatIcon();
    document.body.appendChild(btn);

    // ─── 6. Iframe (UI lives here — fully isolated CSS) ──────────────────────
    var convId = localStorage.getItem(CONV_KEY) || "";
    var iframeSrc =
      API_BASE + "/widget-frame.html" +
      "?cid="      + encodeURIComponent(companyId) +
      "&sid="      + encodeURIComponent(sessionId) +
      "&color="    + encodeURIComponent(color) +
      "&convId="   + encodeURIComponent(convId) +
      "&botName="  + encodeURIComponent(botName) +
      "&welcome="  + encodeURIComponent(welcome) +
      "&api="      + encodeURIComponent(API_BASE);

    var iframe = document.createElement("iframe");
    iframe.id = "rai-frame";
    iframe.src = iframeSrc;
    iframe.setAttribute("allow", "microphone");
    document.body.appendChild(iframe);

    // ─── 7. Toggle open / close ───────────────────────────────────────────────
    var isOpen = false;
    btn.addEventListener("click", function () {
      isOpen = !isOpen;
      iframe.style.display = isOpen ? "block" : "none";
      btn.innerHTML = isOpen ? closeIcon() : chatIcon();
    });

    // ─── 8. Listen for messages from the iframe ───────────────────────────────
    window.addEventListener("message", function (event) {
      if (event.origin !== API_BASE) return;

      if (event.data && event.data.type === "RAI_CONV_ID") {
        localStorage.setItem(CONV_KEY, event.data.conversationId);
      }
      if (event.data && event.data.type === "RAI_CLOSE") {
        isOpen = false;
        iframe.style.display = "none";
        btn.innerHTML = chatIcon();
      }
    });
  }

  function chatIcon() {
    return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  }
  function closeIcon() {
    return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  }
})();
