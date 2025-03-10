import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useHappyFaceAi } from "@/hooks/userProfile/useHappyFaceAi";
import { error } from "console";
import { Bot, Check, Send, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

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
const questions = [
  { emoji: "⚡", text: "What is StackNest?" },
  { emoji: "💬", text: "How to join a room?" },
  { emoji: "🤔", text: "How to get connections?" },
];

const ChatBot = React.memo(({ setIsOpen, avatar }: IChatBotType) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const { mutate, isPending } = useHappyFaceAi();

  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!message.trim()) return;

      const userMessage: Message = {
        id: messages.length + 1,
        text: message,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, userMessage]);
      let botResponse: Message = {
        id: 0,
        text: "",
        sender: "bot",
        timestamp: "",
      };
      mutate(message, {
        onSuccess: (data) => {
          botResponse = {
            id: messages.length + 1,
            text: data.response,
            sender: "bot",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          setMessages((prev) => [...prev, botResponse]);
        },
        onError: () => {
          botResponse = {
            id: messages.length + 1,
            text: "Some temperor",
            sender: "bot",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          setMessages((prev) => [...prev, botResponse]);
        },
      });
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
            <h2 className="text-white font-medium">StackNest Assistant</h2>
            <div className="flex gap-1 items-center">
              <p className="text-indigo-200 text-xs">
                <span className="text-green-400">●</span> Online
              </p>
              {isPending && (
                <p className="text-orange-400 text-xs">proccessing ... </p>
              )}
            </div>
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
              <Avatar className="w-8 h-8 bg-indigo-600 mr-2 flex items-center justify-center">
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
        <div ref={bottomRef} />
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-around mb-4">
          {questions.map((question, index) => (
            <button
              onClick={() => {
                setMessage(question.text);
              }}
              key={index}
              className="text-sm text-gray-600 flex items-center"
            >
              {question.emoji} {question.text}
            </button>
          ))}
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
