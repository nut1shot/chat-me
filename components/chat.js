import { Divider } from "antd";
import { SendOutlined, PictureOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useEffect, useRef, useState } from "react";
import { db, storage } from "../firebase-config";
import { useUserContext } from "../context";
import { UserOutlined } from "@ant-design/icons";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import Message from "./message";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

const ChatRoom = ({ selectedRoom, rooms }) => {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const { username } = useUserContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const unique_id = uuid();
  const filePickerRef = useRef(null);
  const [userCheck, setUserCheck] = useState([]);

  useEffect(() => {
    getChats();
    getAllUser();
  }, [db, selectedRoom]);

  const getAllUser = () => {
    onSnapshot(query(collection(db, "users")), (snapshot) => {
      let users = [];
      snapshot.docs.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id });
        setUserCheck(users);
      });
    });
  };

  const getChats = () => {
    if (selectedRoom) {
      onSnapshot(
        query(
          collection(db, "rooms", selectedRoom, "chats"),
          orderBy("createdAt")
        ),
        (snapshot) => {
          const messages = [];
          snapshot.forEach((doc) => {
            messages.push({ ...doc.data() });
          });
          setChats(messages);
        }
      );
    }
    setSelectedFile(null);
  };

  const getMemberLength = () => {
    let length;
    rooms.map((itemRoom) => {
      if (itemRoom.data().id === selectedRoom) {
        length = itemRoom.data().members.length;
      }
    });
    return length;
  };

  const getMemberName = (id) => {
    let user;
    userCheck?.map((member) => {
      if (member.id === id) {
        user = member.name;
      }
    });
    return user;
  };

  const getRoomName = () => {
    let room;
    room = rooms.filter((room) => room.data().id === selectedRoom);
    return room.length ? room[0].data().name : "";
  };

  const sendMessage = async () => {
    if (message) {
      await addDoc(collection(db, "rooms", selectedRoom, "chats"), {
        uid: username.id,
        name: username.name,
        message: message,
        createdAt: serverTimestamp(),
      });
    }
    if (selectedFile) {
      const imageRef = ref(storage, `Chat/${unique_id}`);
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await addDoc(collection(db, "rooms", selectedRoom, "chats"), {
          uid: username.id,
          name: username.name,
          messageImage: downloadURL,
          createdAt: serverTimestamp(),
        });
      });
    }
    setSelectedFile(null);
    setMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = async (readerEvent) => {
      const fileSelected = readerEvent.target.result;
      setSelectedFile(readerEvent.target.result);
      const imageRef = ref(storage, `Chat/${unique_id}`);
      await uploadString(imageRef, fileSelected, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await addDoc(collection(db, "rooms", selectedRoom, "chats"), {
          uid: username.id,
          name: username.name,
          messageImage: downloadURL,
          createdAt: serverTimestamp(),
        });
      });
    };
  };

  {
    /* Typing Chat */
  }
  const typingMessage = () => {
    return (
      <>
        <div className="absolute bottom-0 w-full flex items-center justify-end gap-[12px] h-[40px] pl-8 pr-2 bg-[#2a2121]">
          <div
            className="flex cursor-pointer"
            onClick={() => filePickerRef.current.click()}
          >
            <PictureOutlined />
          </div>
          <input
            type="file"
            hidden
            ref={filePickerRef}
            onChange={addImageToPost}
          />
          <Input
            size="middle"
            placeholder="Aa"
            className="bg-[#333] text-[#fff]"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            value={message}
          />
          <SendOutlined
            className="text-[pink] cursor-pointer"
            onClick={sendMessage}
          />
        </div>
      </>
    );
  };

  return (
    <>
      <div className="h-[530px] border-white border-[1px] rounded relative">
        <div className="flex flex-col items-center justify-center w-full px-[16px] pt-[16px]">
          <header className="text-[18px] font-bold">
            Chat {selectedRoom ? "/" + " " + getRoomName() : ""}
          </header>
          <span
            className="hover:text-blue-400 cursor-pointer transition-all"
            onClick={() => window.my_modal_2.showModal()}
          >
            {selectedRoom && "members (" + getMemberLength() + ")"}
          </span>
          <dialog id="my_modal_2" className="modal">
            <form method="dialog" className="modal-box">
              <h3 className="font-bold text-lg mb-3">Members</h3>
              {rooms.map((itemRoom, index) => {
                if (itemRoom.data().id === selectedRoom) {
                  return (
                    <div key={index}>
                      {itemRoom.data().members.map((member, i) => (
                        <div key={i}>
                          <p className="flex gap-2 items-center py-2">
                            <UserOutlined />
                            {getMemberName(member)}
                          </p>
                        </div>
                      ))}
                    </div>
                  );
                }
              })}
            </form>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </div>
        <Divider className="w-[10px] bg-white pb-0 mb-0" />
        {selectedRoom ? (
          <>
            {/*  Chat */}
            <Message
              chats={chats}
              selectedFile={selectedFile}
              username={username}
            />
          </>
        ) : (
          <p className="text-[16px] flex items-center justify-center h-full mt-[-50px]">
            Please select room to chat.
          </p>
        )}

        {typingMessage()}
      </div>
    </>
  );
};

export default ChatRoom;
