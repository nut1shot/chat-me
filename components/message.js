import { useEffect, useRef } from "react";

const Message = ({ chats, username, selectedFile }) => {
  const currentChat = useRef(null);
  const scrollToBottom = () => {
    if (currentChat) currentChat.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => scrollToBottom(), [chats]);

  return (
    <>
      {/* Chat */}
      <div className="h-[415px] w-full overflow-y-scroll flex-col-reverse pb-[40px]">
        {chats.map((chat, index) => (
          <div className="p-[16px]" key={index}>
            <div
              className={`chat ${
                chat.uid === username.id ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-header">{chat.name}</div>
              {chat.message && (
                <div className="chat-bubble w-fit">{chat.message}</div>
              )}
              {chat.messageImage && (
                <div className="chat-bubble w-fit">
                  <img src={chat.messageImage} alt={index} width={100} />
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={currentChat}></div>
      </div>
    </>
  );
};

export default Message;
