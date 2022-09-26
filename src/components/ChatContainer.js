import React, { useEffect, useRef } from "react";

const ChatContainer = ({ messages }) => {
  const scrollRef = useRef();
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="relative w-full p-6 overflow-y-auto h-[40rem]">
      <ul className="space-y-2">
        {messages?.map((msg, i) => (
          <ChatMessage
            scrollRef={scrollRef}
            key={i}
            fromSelf={msg.fromSelf}
            text={msg.message}
          />
        ))}
      </ul>
    </div>
  );
};

const ChatMessage = ({ fromSelf, text, scrollRef }) => {
  return (
    <li
      ref={scrollRef}
      className={`flex ${fromSelf ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`relative max-w-xl px-4 py-2 text-gray-700 rounded shadow ${
          fromSelf && "bg-gray-100"
        }`}
      >
        <span className="block">{text}</span>
      </div>
    </li>
  );
};

export default ChatContainer;
