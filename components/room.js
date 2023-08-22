import { Divider } from "antd";
import { useUserContext } from "../context";
import { db } from "../firebase-config";
import {
  doc,
  updateDoc,
  arrayUnion,
  deleteDoc,
  arrayRemove,
} from "firebase/firestore";
import { useState } from "react";

const Room = ({ rooms, setSelectedRoom }) => {
  const [joined, setJoined] = useState(false);
  const { username } = useUserContext();

  const handleJoinRoom = async (id) => {
    const room = doc(db, "rooms", id);
    updateDoc(room, {
      members: arrayUnion(username?.id),
    });
    setJoined(true);
  };

  const handleDeleteRoom = async (id, deleteRoomId) => {
    if (deleteRoomId === username.id) {
      const room = doc(db, "rooms", id);
      await deleteDoc(room);
    }
  };

  const handleLeaveRoom = async (id) => {
    const room = doc(db, "rooms", id);

    updateDoc(room, {
      members: arrayRemove(username?.id),
    });
  };

  const renderJoinedRoom = (room) => {
    const deleteRoomId = room.data().uid;

    return (
      <div className="w-full flex items-center justify-between">
        <div
          className={` 
        w-full flex items-center  
        justify-between
        gap-10 text-center p-[12px] text-[16px]  hover:bg-[#222] hover:text-white
        cursor-pointer`}
          onClick={() => setSelectedRoom(room.data().id)}
        >
          {room.data().name}
        </div>
        {username?.id === deleteRoomId ? (
          <button
            className={`btn btn-outline btn-error btn-sm mr-4 text-[12px] text-white`}
            onClick={() => handleDeleteRoom(room.data().id, deleteRoomId)}
          >
            delete
          </button>
        ) : (
          <button
            className={`btn btn-outline btn-warning btn-sm mr-4 text-[12px] text-white`}
            onClick={() => {
              handleLeaveRoom(room.data().id);
              setSelectedRoom(null);
            }}
          >
            leave
          </button>
        )}
      </div>
    );
  };

  const renderAllRoom = (room) => {
    const joinedRoom = !room.data().members?.includes(username?.id);

    return (
      <div
        className={` 
        w-full flex items-center justify-between
        gap-10 text-center p-[12px] text-[16px]  hover:bg-[#222] hover:text-white
        `}
      >
        {room.data().name}
        {joinedRoom && (
          <button
            className={`btn btn-outline  btn-accent btn-sm mr-4 text-[12px] text-white`}
            onClick={() => {
              handleJoinRoom(room.data().id);
              setSelectedRoom(room.data().id);
            }}
          >
            Join
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="h-[530px] w-full border-white rounded border-[1px]">
        <div className="flex items-center justify-center w-full px-[16px] pt-[16px]">
          <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box">
            <li
              className="text-[18px] font-bold"
              onClick={() => setJoined(false)}
            >
              <a>All Room</a>
            </li>
            <li
              className="text-[18px] font-bold"
              onClick={() => setJoined(true)}
            >
              <a>Joined Room</a>
            </li>
          </ul>
        </div>
        <Divider className="w-[10px] bg-white pb-0 mb-0" />
        <div className="h-[415px] overflow-y-scroll ">
          {rooms.map((room, index) => (
            <div key={index}>
              <div className="flex gap-8">
                {joined ? (
                  <>
                    {/* Joined Room */}
                    {room.data().members?.includes(username?.id)
                      ? renderJoinedRoom(room)
                      : null}
                  </>
                ) : (
                  <>
                    {/* All Room */}
                    {renderAllRoom(room)}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Room;
