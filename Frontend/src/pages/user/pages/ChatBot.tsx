import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bot, Check, Send, X } from "lucide-react";
import React, { useCallback, useState } from "react";

interface IChatBotType {
  setIsOpen: (value: boolean) => void;
  avatar?: string;
}
interface Message {
  id: number;
  text: string;
  sender: "bot" | "user";
  timestamp: string;
  read?: boolean;
}

const ChatBot = React.memo(({ setIsOpen, avatar }: IChatBotType) => {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!message.trim()) return;

      const newMessage: Message = {
        id: messages.length + 1,
        text: message,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages([...messages, newMessage]);
      setMessage("");
    },
    [message]
  );

  return (
    <div className="absolute bottom-16 right-0 w-[320px] h-[480px] bg-white rounded-lg shadow-xl flex flex-col">
      <div className="bg-indigo-600 p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="text-white" size={24} />
          <div>
            <h2 className="text-white font-medium">Main Title</h2>
            <p className="text-indigo-200 text-xs">
              <span className="text-green-400">●</span> Online
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-indigo-700"
          onClick={() => setIsOpen(false)}
        >
          <X size={20} />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.sender === "bot" && (
              <Avatar className="w-8 h-8 bg-indigo-600 mr-2">
                <Bot className="text-white" size={16} />
              </Avatar>
            )}
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>
              <div className="flex items-center justify-end mt-1 space-x-1">
                <span className="text-xs opacity-75">{msg.timestamp}</span>
                {msg.read && <Check size={12} className="opacity-75" />}
              </div>
            </div>
            {msg.sender === "user" && (
              <Avatar className="w-8 h-8 ml-2">
                <img src={avatar || ""} alt="User" className="rounded-full" />
              </Avatar>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-around mb-4">
          <button className="text-sm text-gray-600 flex items-center">
            ⚡ What is WappGPT?
          </button>
          <button className="text-sm text-gray-600 flex items-center">
            💰 Pricing
          </button>
          <button className="text-sm text-gray-600 flex items-center">
            🤔 FAQs
          </button>
        </div>
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="flex-1 rounded-full bg-gray-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full bg-indigo-600 hover:bg-indigo-700"
          >
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
});

export default ChatBot;
