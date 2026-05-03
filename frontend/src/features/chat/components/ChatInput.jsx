import React, { useState } from "react";
import { Send } from "lucide-react";
import Button from "../../auth/components/Button";

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t border-slate-800">
      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button type="submit" size="icon" disabled={!text.trim()} className="w-10 h-10 flex items-center justify-center">
        <Send size={18} />
      </Button>
    </form>
  );
};

export default ChatInput;
