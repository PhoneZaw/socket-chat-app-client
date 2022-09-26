import React from "react";
import { avatarApiRoutePrefix } from "../utils/APIRoutes";

const ChatHeader = ({ currentChat, setCurrentChat }) => {
  return (
    <div className="relative flex items-center p-3 border-b border-gray-300">
      {/* Left Arrow */}
      <div
        className="mr-4 rounded-full bg-white hover:cursor-pointer md:hidden"
        onClick={() => {
          setCurrentChat(undefined);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
      </div>
      <img
        className="object-cover w-10 h-10 rounded-full"
        src={avatarApiRoutePrefix + currentChat.username + ".svg"}
        alt="username"
      />
      <span className="block ml-2 font-bold text-gray-600">
        {currentChat.username}
      </span>

      {currentChat.isOnline && (
        <span className="absolute w-3 h-3 rounded-full left-10 top-3 bg-green-600"></span>
      )}
    </div>
  );
};

export default ChatHeader;
