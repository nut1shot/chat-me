import Head from "next/head";
import styles from "../styles/Home.module.css";
import { db } from "../firebase-config";
import { UserOutlined } from "@ant-design/icons";
import { Input, Row, Col, Space } from "antd";
import { setDoc, doc } from "firebase/firestore";
import { v4 as uuid } from "uuid";
import React from "react";
import { useUserContext } from "../context";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

export default function Home() {
  const { username, setUsername } = useUserContext();
  const unique_id = uuid();
  const router = useRouter();

  const login = () => {
    if (username.name === "") {
      alert("Enter Username");
      return;
    }
    setDoc(doc(db, "users", `${unique_id}`), {
      id: unique_id,
      name: username,
    });

    setUsername((_prv) => (_prv = { id: unique_id, name: username }));
    localStorage.setItem(
      "user",
      JSON.stringify({ id: unique_id, name: username })
    );
    Cookies.set("user", true);
    const user = localStorage.getItem("user");
    setUsername(JSON.parse(user));
    router.push("/chat");
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Chat App by Nut</title>
        <meta name="description" content="chat application" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-[980px] mx-auto h-screen px-[16px]">
        <div className="relative flex gap-10 flex-col items-center justify-center w-full h-full mt-[-80px]">
          <header className="text-[36px] font-bold">Chat Application</header>
          <Row>
            <Col span={24}>
              <Input
                size="large"
                placeholder="username"
                prefix={<UserOutlined />}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Space>
                <button
                  className="border-solid	border-white border-[1px] rounded-[8px] hover:border-[#88d288]
                    transition-all
                    py-[8px] px-[4rem] text-[#fff] hover:text-[#8fe18f]"
                  onClick={login}
                >
                  login
                </button>
              </Space>
            </Col>
          </Row>
        </div>
      </main>
    </div>
  );
}
