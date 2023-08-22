import Room from "../components/room";
import ChatRoom from "../components/chat";
import Link from "next/link";
import { db } from "../firebase-config";
import {
  setDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";
import { useUserContext } from "../context";
import { Col, Row, Button, Modal, Input, Space } from "antd";
import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import Cookies from "js-cookie";

const Chat = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const { username, setUsername } = useUserContext();
  const unique_id = uuid();

  useEffect(() => {
    const user = localStorage.getItem("user");
    setUsername(JSON.parse(user));

    onSnapshot(
      query(collection(db, "rooms"), orderBy("createAt", "desc")),
      (snapshot) => {
        setRooms(snapshot.docs);
      }
    );
  }, [db]);

  const createRoom = () => {
    setDoc(doc(db, "rooms", `${unique_id}`), {
      id: unique_id,
      name: roomName,
      createAt: serverTimestamp(),
      uid: username.id,
      members: [username.id],
    });
    setSelectedRoom(unique_id);
    setModalOpen(false);
    setRoomName((prv) => (prv = ""));
  };

  return (
    <>
      <main className="max-w-[980px] mx-auto h-screen px-[16px]">
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="flex justify-between w-full">
            <Button type="primary" onClick={() => setModalOpen(true)}>
              Create Room
            </Button>
            Username: {username.name}
            <Link href="/">
              <Button
                onClick={() => {
                  localStorage.clear();
                  Cookies.remove("user");
                }}
                danger
              >
                Logout
              </Button>
            </Link>
            <Modal
              title="Create Room"
              centered
              footer={null}
              open={modalOpen}
              onOk={() => setModalOpen(false)}
              onCancel={() => setModalOpen(false)}
            >
              <Space.Compact style={{ width: "100%" }}>
                <Input
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
                <Button
                  onClick={createRoom}
                  className="text-[#222]"
                  type="primary"
                >
                  Create
                </Button>
              </Space.Compact>
            </Modal>
          </div>
          <Row className="w-full mt-4">
            <Col span={16} push={8}>
              <ChatRoom selectedRoom={selectedRoom} rooms={rooms} />
            </Col>
            <Col span={8} pull={16}>
              <Room rooms={rooms} setSelectedRoom={setSelectedRoom} />
            </Col>
          </Row>
        </div>
      </main>
    </>
  );
};

export default Chat;
