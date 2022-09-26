import { avatarApiRoutePrefix } from "../utils/APIRoutes";
import { useNavigate } from "react-router-dom";

const ChatList = ({ currentChat, setCurrentChat, allUsers, currentUser }) => {
  const navigate = useNavigate();

  const onSelectHandler = (user) => {
    setCurrentChat(user);
  };

  return (
    <ul className="overflow-auto h-[32rem]">
      <div className="my-2 mb-2 ml-2 text-lg text-gray-600 flex justify-between">
        <h2 className="">Chats</h2>
      </div>
      {allUsers?.map((user, index) => (
        <li key={index} onClick={() => onSelectHandler(user)}>
          <div
            className={`relative flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer  focus:outline-none
                ${
                  currentChat && currentChat._id === user._id
                    ? "bg-gray-100"
                    : "hover:bg-gray-100"
                }`}
          >
            <img
              className="object-cover w-10 h-10 rounded-full"
              src={avatarApiRoutePrefix + user.username + ".svg"}
              alt={user.username}
            />
            <div className="w-full pb-2">
              <div className="flex justify-between">
                <span className="block ml-2 font-semibold text-gray-600">
                  {user.username}
                </span>

                {user.isOnline && (
                  <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
                )}

                <span className="block ml-2 text-sm text-gray-600">
                  {user.isOnline ? "online" : "offline"}
                  {/* 25 minutes */}
                </span>
              </div>
              <span className="block ml-2 text-sm text-gray-600">{""}</span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ChatList;
