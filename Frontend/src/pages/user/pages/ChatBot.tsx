import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bot, Check, Send, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `
    You are stackNest AI Assistant. stackNest is a vibrant online community for software developers. 
    It features:
    - stack_nest_owner is "Abiram k" and he is a software developer.
    - Rooms: Dedicated spaces for collaborating on specific projects discussions and also there is a general room community for all developers, There are premium (only for premium members), private rooms are there. General rooms placed in home page, rest of all rooms in room section
    - Language Channels: Focused discussions on programming languages like Python, JavaScript, and Java.
    - Favorites: Users can add upto 5 rooms to favorites at a time, in room listing page there is a heart icon for add to favorites, you can use that icon up 5 rooms
    - Premium membership: option is in profile side bar, there is an icon for to purchase premium, select a listed premium and experience in a betterway, You can get premium features by participates in daily challenges.
    - Search user: You can search users on highlight page in navbar and while searching you will get the suggestion
    - Highlights/posts: You can upload new higlights or thoughts in profile page in feed section also you can schedule the feed for upcomig days and also you can see others highlights on highlights section on navbar
    - connection request: you can send connection request to users while searching and also you can get userDetails once you insceptected the user by cliking on the profile picture of the user
    - message/voice call:- once you are connected with you friend , you can chat and audio call with them , by using the arrow icon on the top left of the navbar
    - voice call issues: if you are facing to connect with you friend via audio call , i recomment both friends to open chat and make a call , this will work
    - Study Groups: Collaborative learning environments for tackling coding challenges and exploring new technologies.
    - Code Snippet Posts: Sharing and discussing code examples.
    - Question & Answer Forums: Seeking and providing help with technical issues.
    - Daily Coding Challenges: Engaging exercises to improve coding skills also you can earn points to redeem some preimum features.
    - User Profiles: Where users can showcase their work and connect with others, Also they can maintain streak by clicking checkin button daily and ther is a point talble for that.
    - stackNest website url is not available right now.
    - To get chatbot access: take premium, participate in challenges and earn points to redeem rewards from your profile stats page. Alternatively, since this app is in beta, send an email to Abiramk4572@gmail.com (subject: stacknest:points<count>) — we’ll give you free points to explore the benefits.
    Respond only to questions related to stackNest. Do not answer questions outside of this context.
    For example:
    Acceptable: "How do I create a project room?"
    Acceptable: "What are today's coding challenges?"
    Unacceptable: "What is the weather today?"
    Unacceptable: "Write a poem about flowers."
    Respond in a friendly, consice and helpful tone also use tech emojies 
    Important: Don't give any response for the queries outside of the above context , if they rising queries continuesly you can provide this email to contact: Abiramk4572@gmail.com as were are happy to here you.
  `,
});

interface IChatBotType {
  setIsOpen: (value: boolean) => void;
  avatar?: string;
  isChatBotAuthorised: boolean;
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

const ChatBot = React.memo(
  ({ setIsOpen, avatar, isChatBotAuthorised }: IChatBotType) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    const handleSendMessage = async (e: React.FormEvent) => {
      try {
        e.preventDefault();
        if (!message.trim().length) return;
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
        setIsPending(true);
        let messageWithAuth = `${
          isChatBotAuthorised
            ? message
            : "The user is ineligible to use chatbot feture, subscribe to premium to use chatbot"
        }`;
        const result = await model.generateContent(messageWithAuth);
        console.log(result.response.text());
        const botReply = result.response.text();
        const botMessage: Message = {
          id: messages.length + 1,
          text: botReply,
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, botMessage]);
      } catch (error) {
        console.log(error);
        alert("Error");
      } finally {
        setIsPending(false);
        setMessage("");
      }
    };

    return (
      <div className="absolute bottom-16 right-0 w-[320px] h-[480px] bg-white  rounded-lg shadow-xl flex flex-col">
        <div className="bg-primary-500  dark:bg-priamary-600 p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="text-white" size={24} />
            <div>
              <h2 className="text-white font-medium">StackNest Assistant</h2>
              <div className="flex gap-1 items-center">
                <p className="text-indigo-200 text-xs">
                  <span className="text-green-400">●</span> Online
                </p>
                {isPending && <p className="text-white text-xs">Typing ... </p>}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-primary-500 dark:bg-transparent"
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
                <Avatar
                  className="w-8 h-8 bg-primary-500 
              dark:bg-primary-600 mr-2 flex items-center justify-center"
                >
                  <Bot className="text-white" size={16} />
                </Avatar>
              )}

              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.sender === "user"
                    ? "bg-primary-500  text-white"
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
              className="flex-1 rounded-full border-1 border-primary-500 bg-gray-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:text-black"
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-full bg-primary-500 hover:bg-primary-500/90 hover:text-black dark:bg-primary-600 dark:hover:bg-primary-600/90 dark:text-white "
            >
              <Send size={18} />
            </Button>
          </form>
        </div>
      </div>
    );
  }
);

export default ChatBot;
