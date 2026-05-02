import { useState, useRef, useEffect, useCallback } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const genId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

const formatTime = (ts) =>
  new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const formatDate = (ts) => {
  const d = new Date(ts);
  const now = new Date();
  const diff = Math.floor((now - d) / 86_400_000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return d.toLocaleDateString([], { weekday: "long" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
};

const renderMarkdown = (text) =>
  text
    .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, _lang, code) =>
      `<pre class="bg-zinc-900 text-zinc-100 rounded-xl px-4 py-3 overflow-x-auto text-xs my-2 font-mono leading-relaxed">${code
        .trim()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}</pre>`
    )
    .replace(/`([^`]+)`/g, '<code class="bg-zinc-100 text-zinc-800 rounded px-1.5 py-0.5 text-xs font-mono">$1</code>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^[-•] (.+)$/gm, "<li class='ml-4 list-disc mb-1'>$1</li>")
    .replace(/^\d+\. (.+)$/gm, "<li class='ml-4 list-decimal mb-1'>$1</li>")
    .replace(/\n\n/g, "</p><p class='mb-2'>")
    .replace(/\n/g, "<br/>")
    .replace(/^/, "<p class='mb-2'>")
    .replace(/$/, "</p>");

// ─── Mock reply — replace with your real API call ─────────────────────────────
const getMockReply = (text) => {
  const t = text.toLowerCase();
  if (t.includes("hello") || t.includes("hi"))
    return "Hey there! I'm your AI assistant. What can I help you with today?\n\n*This is a demo — connect your API to get real responses.*";
  if (t.includes("code") || t.includes("python") || t.includes("javascript"))
    return "Here's a quick snippet:\n\n```javascript\nconst greet = (name) => `Hello, ${name}!`;\nconsole.log(greet('World'));\n```\n\nWant me to expand on this?";
  const pool = [
    "Great question! Here's my take:\n\n- **First**, understand the core of the problem\n- **Second**, explore your options\n- **Third**, iterate quickly\n\nWant to dive deeper into any of these?",
    "That's interesting! Let me think through this.\n\nThe key insight is that **context matters more than rules**. What works in one situation may fail in another — so always start by understanding the real goal.\n\n*Demo mode — connect your API for real answers.*",
    "Here's a concise breakdown:\n\nStart simple, measure what matters, and adjust based on real feedback. Overthinking early decisions is the #1 trap to avoid.\n\nAnything specific you'd like to explore?",
  ];
  return pool[Math.floor(Math.random() * pool.length)];
};

// ─── Storage ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = "chatui_conversations";
const loadConvs = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
};
const saveConvs = (c) => localStorage.setItem(STORAGE_KEY, JSON.stringify(c));

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const Icon = {
  Send: () => (
    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Plus: () => (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Search: () => (
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  ),
  X: () => (
    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
  Trash: () => (
    <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6M9 6V4h6v2" />
    </svg>
  ),
  Copy: () => (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Refresh: () => (
    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.67" />
    </svg>
  ),
  Menu: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h18M3 6h18M3 18h12" />
    </svg>
  ),
  Bot: () => (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M12 11V7" /><circle cx="12" cy="5" r="2" />
      <path d="M8 15h.01M16 15h.01" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  ),
  Attach: () => (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  ),
};

// ─── Typing Dots ─────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex gap-3 items-start max-w-3xl mx-auto animate-[fadeUp_0.3s_ease_forwards]">
      <div className="w-8 h-8 rounded-xl bg-zinc-800 text-white flex items-center justify-center flex-shrink-0 mt-1">
        <Icon.Bot />
      </div>
      <div className="bg-white border border-zinc-200 rounded-2xl rounded-tl-sm px-4 py-3.5 flex gap-1.5 items-center">
        {[0, 200, 400].map((d) => (
          <span
            key={d}
            className="w-2 h-2 rounded-full bg-zinc-400 inline-block"
            style={{ animation: `typingPulse 1.4s ${d}ms ease-in-out infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────
function MessageBubble({ msg, isLast, onRegenerate }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";

  const copy = () => {
    navigator.clipboard.writeText(msg.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 items-start max-w-3xl mx-auto animate-[fadeUp_0.3s_ease_forwards]">
        <div className="max-w-[78%]">
          <div className="bg-zinc-800 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap">
            {msg.content}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 text-right">{formatTime(msg.time)}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-1 select-none">
          U
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-start max-w-3xl mx-auto animate-[fadeUp_0.3s_ease_forwards]">
      <div className="w-8 h-8 rounded-xl bg-zinc-800 text-white flex items-center justify-center flex-shrink-0 mt-1">
        <Icon.Bot />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-semibold text-zinc-700">AI Assistant</span>
          <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">DEMO</span>
        </div>
        <div
          className="text-sm text-zinc-700 leading-relaxed bg-white border border-zinc-200 rounded-2xl rounded-tl-sm px-4 py-3"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
        />
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-[11px] text-zinc-400">{formatTime(msg.time)}</span>
          <button onClick={copy} className="text-[11px] text-zinc-400 hover:text-zinc-700 flex items-center gap-1 transition-colors">
            <Icon.Copy /> {copied ? "Copied!" : "Copy"}
          </button>
          {isLast && (
            <button onClick={onRegenerate} className="text-[11px] text-zinc-400 hover:text-zinc-700 flex items-center gap-1 transition-colors">
              <Icon.Refresh /> Regenerate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Welcome Screen ───────────────────────────────────────────────────────────
const SUGGESTIONS = [
  { icon: "✦", label: "Explain", text: "Explain quantum computing simply" },
  { icon: "✍", label: "Write", text: "Write a short story about time travel" },
  { icon: "⌥", label: "Debug", text: "Help me debug my React component" },
  { icon: "✈", label: "Plan", text: "Plan a 7-day trip to Japan" },
];

function WelcomeScreen({ onSuggestion }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <div className="w-16 h-16 rounded-2xl bg-zinc-800 text-white flex items-center justify-center mb-5 shadow-lg">
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <path d="M12 11V7" /><circle cx="12" cy="5" r="2" />
          <path d="M8 15h.01M16 15h.01" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-zinc-800 mb-2 tracking-tight">How can I help you?</h2>
      <p className="text-zinc-400 text-sm mb-10 max-w-xs leading-relaxed">
        Ask me anything. Connect your API to enable real AI responses.
      </p>
      <div className="grid grid-cols-2 gap-3 max-w-md w-full">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.text}
            onClick={() => onSuggestion(s.text)}
            className="text-left p-4 bg-white border border-zinc-200 rounded-2xl hover:border-amber-300 hover:bg-amber-50 transition-all duration-150 group"
          >
            <p className="text-xs text-zinc-400 mb-1 group-hover:text-amber-500 transition-colors font-medium">
              {s.icon} {s.label}
            </p>
            <p className="text-sm text-zinc-700 font-medium leading-snug">{s.text}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ convs, currentId, onSelect, onNew, onDelete, open, onClose }) {
  const [search, setSearch] = useState("");

  const todayStart = new Date().setHours(0, 0, 0, 0);
  const filtered = convs.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );
  const today = filtered.filter((c) => c.time >= todayStart);
  const older = filtered.filter((c) => c.time < todayStart);

  const SectionLabel = ({ label }) => (
    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest px-3 mb-1 mt-4 first:mt-0">
      {label}
    </p>
  );

  const Item = ({ conv }) => (
    <div
      onClick={() => { onSelect(conv.id); onClose(); }}
      className={`group flex items-center gap-2.5 rounded-xl px-3 py-2.5 cursor-pointer transition-colors ${
        conv.id === currentId ? "bg-zinc-100" : "hover:bg-zinc-50"
      }`}
    >
      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${conv.id === currentId ? "bg-amber-400" : "bg-zinc-200"}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-700 font-medium truncate">{conv.title}</p>
        <p className="text-[11px] text-zinc-400 mt-0.5">{formatDate(conv.time)} · {conv.messages.length} msgs</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 text-zinc-300 hover:text-red-400 transition-all"
      >
        <Icon.X />
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed md:static z-50 md:z-auto top-0 left-0 h-full
        w-72 bg-white border-r border-zinc-100 flex flex-col overflow-hidden
        transition-transform duration-300 ease-out
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-800 text-white flex items-center justify-center">
              <Icon.Bot />
            </div>
            <span className="font-bold text-zinc-800 text-base tracking-tight">AI Chat</span>
          </div>
          <span className="text-[10px] tracking-wide text-zinc-400 bg-zinc-50 border border-zinc-100 rounded-full px-2.5 py-0.5 font-medium">
            DEMO
          </span>
        </div>

        {/* New Chat */}
        <div className="px-4 pt-4 pb-2">
          <button
            onClick={onNew}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                       border border-amber-300 bg-amber-50 text-zinc-700 font-semibold text-sm
                       hover:bg-amber-100 transition-colors"
          >
            <Icon.Plus /> New conversation
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-zinc-50 rounded-xl px-3 py-2 border border-zinc-100">
            <Icon.Search />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chats…"
              className="bg-transparent text-sm text-zinc-700 placeholder-zinc-300 w-full focus:outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-zinc-300 hover:text-zinc-500">
                <Icon.X />
              </button>
            )}
          </div>
        </div>

        {/* History */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {filtered.length === 0 ? (
            <p className="text-xs text-zinc-400 text-center py-8">No chats found</p>
          ) : (
            <>
              {today.length > 0 && <><SectionLabel label="Today" />{today.map((c) => <Item key={c.id} conv={c} />)}</>}
              {older.length > 0 && <><SectionLabel label="Earlier" />{older.map((c) => <Item key={c.id} conv={c} />)}</>}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-100 px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center text-xs font-bold select-none">U</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-zinc-800">User</p>
            <p className="text-xs text-zinc-400">Free plan</p>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Main Chat Component ───────────────────────────────────────────────────────
export default function Chat() {
  const [convs, setConvs]           = useState(() => loadConvs().length ? loadConvs() : []);
  const [currentId, setCurrentId]   = useState(null);
  const [isTyping, setIsTyping]     = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [input, setInput]           = useState("");
  const bottomRef                   = useRef(null);
  const textareaRef                 = useRef(null);

  const currentConv = convs.find((c) => c.id === currentId) ?? null;
  const isEmpty = !currentConv || currentConv.messages.length === 0;

  // Save on change
  useEffect(() => { saveConvs(convs); }, [convs]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConv?.messages?.length, isTyping]);

  const updateConvs = (updater) => setConvs((prev) => updater(prev));

  // ── Send ──────────────────────────────────────────────────────────────────
  const send = useCallback((text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isTyping) return;

    let cid = currentId;

    if (!cid) {
      cid = genId();
      const newConv = {
        id: cid,
        title: trimmed.length > 42 ? trimmed.slice(0, 40) + "…" : trimmed,
        time: Date.now(),
        messages: [],
      };
      updateConvs((prev) => [newConv, ...prev]);
      setCurrentId(cid);
    }

    const userMsg = { id: genId(), role: "user", content: trimmed, time: Date.now() };
    updateConvs((prev) =>
      prev.map((c) => c.id === cid ? { ...c, messages: [...c.messages, userMsg] } : c)
    );

    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    setIsTyping(true);
    setTimeout(() => {
      const aiMsg = { id: genId(), role: "ai", content: getMockReply(trimmed), time: Date.now() };
      updateConvs((prev) =>
        prev.map((c) => c.id === cid ? { ...c, messages: [...c.messages, aiMsg] } : c)
      );
      setIsTyping(false);
    }, 1000 + Math.random() * 800);
  }, [input, currentId, isTyping]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    const el = textareaRef.current;
    if (el) { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 160) + "px"; }
  };

  const newChat = () => { setCurrentId(null); setSidebarOpen(false); };

  const deleteConv = (id) => {
    updateConvs((prev) => prev.filter((c) => c.id !== id));
    if (currentId === id) setCurrentId(null);
  };

  const clearChat = () => {
    if (!currentId || isEmpty) return;
    if (!window.confirm("Clear all messages?")) return;
    updateConvs((prev) => prev.map((c) => c.id === currentId ? { ...c, messages: [] } : c));
  };

  const canSend = input.trim().length > 0 && !isTyping;

  return (
    <>
      {/* Keyframe styles injected once */}
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes typingPulse { 0%,80%,100% { transform:scale(0.5); opacity:0.3; } 40% { transform:scale(1); opacity:1; } }
        textarea { resize: none; }
        textarea:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #d4d4d4; border-radius: 99px; }
      `}</style>

      <div className="flex h-screen overflow-hidden bg-zinc-50 font-sans">

        {/* ── Sidebar ── */}
        <Sidebar
          convs={convs}
          currentId={currentId}
          onSelect={setCurrentId}
          onNew={newChat}
          onDelete={deleteConv}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* ── Main ── */}
        <main className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">

          {/* Header */}
          <header className="bg-white/90 backdrop-blur border-b border-zinc-100 px-5 py-3.5 flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-zinc-400 hover:bg-zinc-100 transition-colors"
            >
              <Icon.Menu />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-sm font-semibold text-zinc-800 truncate">
                {currentConv?.title ?? "New Conversation"}
              </h1>
              <p className="text-[11px] text-zinc-400">
                {currentConv
                  ? `${formatDate(currentConv.time)} · ${currentConv.messages.length} messages`
                  : "Start a conversation below"}
              </p>
            </div>
            <button
              onClick={clearChat}
              disabled={isEmpty}
              title="Clear chat"
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 disabled:opacity-25 disabled:cursor-not-allowed transition-all"
            >
              <Icon.Trash />
            </button>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            {isEmpty ? (
              <WelcomeScreen onSuggestion={send} />
            ) : (
              <div className="space-y-5 max-w-3xl mx-auto">
                {currentConv.messages.map((msg, i) => (
                  <MessageBubble
                    key={msg.id}
                    msg={msg}
                    isLast={i === currentConv.messages.length - 1 && msg.role === "ai"}
                    onRegenerate={() => send(currentConv.messages.findLast(m => m.role === "user")?.content ?? "")}
                  />
                ))}
                {isTyping && <TypingDots />}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex-shrink-0 bg-white border-t border-zinc-100 px-4 py-4">
            <div className="max-w-3xl mx-auto">
              <div className={`bg-zinc-50 border rounded-2xl overflow-hidden transition-shadow ${
                input ? "border-zinc-300 shadow-[0_0_0_2px_#fcd34d]" : "border-zinc-200"
              }`}>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
                  rows={1}
                  disabled={isTyping}
                  className="w-full bg-transparent px-4 pt-3.5 pb-2 text-sm text-zinc-800 placeholder-zinc-300 max-h-40 disabled:opacity-50 font-sans"
                />
                <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
                  <div className="flex gap-0.5">
                    <button className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all" title="Attach">
                      <Icon.Attach />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    {input.length > 80 && (
                      <span className="text-[11px] text-zinc-300">{input.length}</span>
                    )}
                    <button
                      onClick={() => send()}
                      disabled={!canSend}
                      className="flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 active:scale-95
                                 text-white text-xs font-semibold px-3.5 py-2 rounded-xl
                                 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <Icon.Send /> Send
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-center text-[11px] text-zinc-300 mt-2">
                AI can make mistakes. Connect your API key to enable real responses.
              </p>
            </div>
          </div>

        </main>
      </div>
    </>
  );
}