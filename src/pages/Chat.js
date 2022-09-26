import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ChatContainer from "../components/ChatContainer";
import ChatHeader from "../components/ChatHeader";
import ChatList from "../components/ChatList";
import InputText from "../components/InputText";
import Search from "../components/Search";
import { useNavigate } from "react-router-dom";
import {
  addMessageRoute,
  avatarApiRoutePrefix,
  getAllUsersRoutePrefix,
  getMessagesRoute,
  getOnlineUsers,
  host,
} from "../utils/APIRoutes";
import { io } from "socket.io-client";

const Chat = () => {
  const socket = useRef(undefined);
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(undefined);

  const logout = () => {
    localStorage.clear();
    if (socket.current) {
      socket.close();
    }
    navigate("/login");
  };

  async function getAllUsers() {
    const { data } = await axios.get(getAllUsersRoutePrefix + currentUser._id);
    const { data: onlineUsers } = await axios.get(getOnlineUsers);
    setAllUsers(
      data.map((user) => {
        return { ...user, isOnline: onlineUsers.includes(user._id) };
      })
    );
  }

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    } else {
      setCurrentUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      getAllUsers();
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
      console.log("setSocket");

      socket.current.on("message-receive", (message) => {
        setArrivalMessage({ fromSelf: false, message });
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (allUsers && socket.current) {
      socket.current.on("online", (onlineUsers) => {
        if (onlineUsers > allUsers) {
          getAllUsers();
        }
        const tempAllUsers = allUsers.map((user) =>
          onlineUsers.includes(user._id) ? { ...user, isOnline: true } : user
        );
        setAllUsers(tempAllUsers);
      });
      socket.current.on("offline", (uid) => {
        const tempAllUsers = allUsers.map((user) =>
          user._id === uid ? { ...user, isOnline: false } : user
        );
        setAllUsers(tempAllUsers);
      });
    }
  }, [allUsers]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    if (currentChat) {
      async function getMessages() {
        const { data } = await axios.post(getMessagesRoute, {
          from: currentUser._id,
          to: currentChat._id,
        });

        setMessages(data);
      }
      getMessages();
    }
  }, [currentChat]);

  const sendMessage = async (message) => {
    try {
      const tempMessages = [...messages];
      tempMessages.push({ fromSelf: true, message });
      setMessages(tempMessages);
      socket.current.emit("send-message", {
        message,
        from: currentUser._id,
        to: currentChat._id,
      });
      await axios.post(addMessageRoute, {
        message,
        from: currentUser._id,
        to: currentChat._id,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!currentUser) {
    return;
  }
  return (
    <div className="w-full mx-auto h-screen overflow-hidden">
      <div className="min-w-full border rounded md:grid md:grid-cols-3">
        <div className="border-r border-gray-300 lg:col-span-1 max-h-screen">
          {/* User Profile */}
          <div
            className="relative flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300  focus:outline-none
                "
          >
            <img
              className="object-cover w-10 h-10 rounded-full"
              src={avatarApiRoutePrefix + currentUser.username + ".svg"}
              alt={currentUser.username}
            />
            <div className="w-full pb-2">
              <div className="flex justify-between">
                <span className="block ml-2 font-semibold text-gray-600">
                  {currentUser.username}
                </span>

                <span className="block ml-2 text-sm text-gray-600">
                  <button onClick={logout}>{"Logout"}</button>
                </span>
              </div>
              <span className="block ml-2 text-sm text-gray-600">{""}</span>
            </div>
          </div>
          <Search />
          <ChatList
            currentUser={currentUser}
            setCurrentChat={setCurrentChat}
            currentChat={currentChat}
            allUsers={allUsers}
          />
        </div>
        {currentChat && (
          <div className="md:col-span-2 md:block max-h-screen">
            <div className="w-full max-h-screen flex flex-col">
              <ChatHeader currentChat={currentChat} />
              <ChatContainer messages={messages} />
              <InputText sendMessage={(msg) => sendMessage(msg)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;

// Emoji Button
// <button>
//                 <svg
//                   className="w-6 h-6 text-gray-500"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                     stroke-width="2"
//                     d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                   />
//                 </svg>
//               </button>

// File Input Button
//               <button>
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="w-5 h-5 text-gray-500"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                     stroke-width="2"
//                     d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
//                   />
//                 </svg>
//               </button>

// Voice Button

/* <button>
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </button> */
