import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Code2, Copy, Check, Palette, MessageSquare, Bot,
  AlignLeft, AlignRight, Loader2, Save
} from "lucide-react";
import { getWidgetSettings, updateWidgetSettings } from "../service/widget.api";
import Button from "../../auth/components/Button";
import toast, { Toaster } from "react-hot-toast";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

const DEFAULT_SETTINGS = {
  primaryColor: "#10b981",
  position: "right",
  welcomeMessage: "Hi there! How can I help you today?",
  botName: "Support Bot",
  logoUrl: "",
};

const WidgetSettings = () => {
  const { user } = useSelector((state) => state.auth);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Build the embeddable script tag using the admin's companyId
  const scriptTag = `<script src="${API_BASE}/widget.js?cid=${user?.companyId}" async><\/script>`;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getWidgetSettings();
        if (data.success) {
          setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
        }
      } catch (err) {
        toast.error("Failed to load widget settings.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateWidgetSettings(settings);
      toast.success("Widget settings saved successfully!");
    } catch {
      toast.error("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptTag).then(() => {
      setCopied(true);
      toast.success("Script tag copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0f172a", color: "#e2e8f0",
            border: "1px solid #1e293b", borderRadius: "12px",
          },
        }}
      />

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Widget Settings</h1>
        <p className="text-slate-400 text-sm mt-1">
          Customize your embeddable chat widget and copy the script tag to add it to your website.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* ── Left: Settings Form ── */}
        <div className="space-y-6">

          {/* Color Picker */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-4"
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 bg-purple-500/10 rounded-2xl flex items-center justify-center">
                <Palette size={18} className="text-purple-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Brand Color</p>
                <p className="text-slate-500 text-xs">This color will be used for the chat bubble and UI accents.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label
                htmlFor="colorPicker"
                className="w-12 h-12 rounded-xl border-2 border-slate-700 cursor-pointer overflow-hidden hover:border-slate-500 transition-colors shrink-0"
                style={{ background: settings.primaryColor }}
              >
                <input
                  id="colorPicker"
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                  className="opacity-0 w-full h-full cursor-pointer"
                />
              </label>

              <input
                type="text"
                value={settings.primaryColor}
                onChange={(e) => handleChange("primaryColor", e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                placeholder="#10b981"
              />

              {/* Preset swatches */}
              <div className="flex gap-2">
                {["#10b981", "#6366f1", "#f59e0b", "#ef4444", "#3b82f6"].map((c) => (
                  <button
                    key={c}
                    onClick={() => handleChange("primaryColor", c)}
                    className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                    style={{
                      background: c,
                      borderColor: settings.primaryColor === c ? "#fff" : "transparent",
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Bot Name & Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 space-y-4"
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                <Bot size={18} className="text-blue-400" />
              </div>
              <p className="text-white font-semibold text-sm">Bot Identity</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">Bot Name</label>
                <input
                  type="text"
                  value={settings.botName}
                  onChange={(e) => handleChange("botName", e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                  placeholder="Support Bot"
                  maxLength={40}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-1.5">Welcome Message</label>
                <textarea
                  value={settings.welcomeMessage}
                  onChange={(e) => handleChange("welcomeMessage", e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none"
                  placeholder="Hi there! How can I help you today?"
                  maxLength={200}
                />
              </div>
            </div>
          </motion.div>

          {/* Position Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                <AlignRight size={18} className="text-amber-400" />
              </div>
              <p className="text-white font-semibold text-sm">Widget Position</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {["left", "right"].map((pos) => (
                <button
                  key={pos}
                  onClick={() => handleChange("position", pos)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-2xl border text-sm font-semibold transition-all ${
                    settings.position === pos
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  {pos === "left" ? <AlignLeft size={16} /> : <AlignRight size={16} />}
                  {pos.charAt(0).toUpperCase() + pos.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Save Button */}
          <Button onClick={handleSave} isLoading={saving}>
            <Save size={18} />
            Save Settings
          </Button>
        </div>

        {/* ── Right: Preview + Script Tag ── */}
        <div className="space-y-6">
          {/* Live Widget Preview */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6"
          >
            <p className="text-white font-semibold text-sm mb-4">Live Preview</p>
            <div className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden"
                 style={{ height: "360px" }}>
              {/* Mock website background */}
              <div className="p-5 space-y-3 opacity-20">
                <div className="h-3 bg-slate-700 rounded-full w-3/4" />
                <div className="h-3 bg-slate-700 rounded-full w-1/2" />
                <div className="h-3 bg-slate-700 rounded-full w-5/6" />
                <div className="h-3 bg-slate-700 rounded-full w-2/3" />
                <div className="h-3 bg-slate-700 rounded-full w-3/4 mt-4" />
                <div className="h-3 bg-slate-700 rounded-full w-1/3" />
              </div>

              {/* Chat bubble preview */}
              <div
                className={`absolute bottom-4 ${settings.position === "right" ? "right-4" : "left-4"}`}
              >
                {/* Mini chat window */}
                <div className="mb-2 w-52 bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-800"
                       style={{ background: settings.primaryColor + "22" }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                         style={{ background: settings.primaryColor }}>
                      {settings.botName.charAt(0)}
                    </div>
                    <span className="text-white text-[11px] font-semibold truncate">{settings.botName}</span>
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                  </div>
                  <div className="p-3">
                    <div className="bg-slate-800 rounded-xl rounded-bl-sm px-3 py-2 text-[11px] text-slate-300 leading-tight">
                      {settings.welcomeMessage.slice(0, 60)}{settings.welcomeMessage.length > 60 ? "…" : ""}
                    </div>
                  </div>
                </div>

                {/* Bubble button */}
                <div
                  className={`w-10 h-10 rounded-full shadow-xl flex items-center justify-center ml-auto`}
                  style={{ background: settings.primaryColor,
                    marginLeft: settings.position === "left" ? "0" : "auto",
                    marginRight: settings.position === "right" ? "0" : "auto",
                  }}
                >
                  <MessageSquare size={18} color="white" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Script Tag Copy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                <Code2 size={18} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Embed Script</p>
                <p className="text-slate-500 text-xs">Paste this before the &lt;/body&gt; tag of your website.</p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 relative group">
              <pre className="text-emerald-400 text-xs font-mono overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                {scriptTag}
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>

            <p className="text-slate-600 text-xs mt-3">
              Your Company ID: <span className="text-slate-400 font-mono">{user?.companyId}</span>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WidgetSettings;
