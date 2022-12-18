import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import styles from "../styles/Home.module.css";
import Link from "next/link";

interface Discution {
  id: string;
  content: string;
  sender: any;
  senderId: number;
  reciever: any;
  recieverId: number;
  dateAndHour: Date;
}

function ChatList() {
  const [chatList, setChatList] = useState<Array<Discution>>([]);

  useEffect(() => {
    const token = localStorage.getItem("JWT");
    if (token != null) {
      let decodedToken: any = jwt_decode(token);
      let id =
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

      const body = { idCurrentUser: id, token: token };
      fetch("/api/chat/getDiscutions", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((result) => {
          setChatList(result.discutionList);
        });
    }
  }, []);

  return (
    <div className="flex flex-row flex-wrap mt-16 ml-16">
      {chatList.map((discution) => {
        let date = new Date(discution.dateAndHour)
          .toLocaleTimeString()
          .slice(0, 5);
        return (
          <div
            key={discution.id}
            className="bg-white shadow-md px-5 pt-6 pb-5 rounded-lg text-center w-1/5 mx-8 mb-14"
          >
            <div className="flex items-stretch">
              <img
                className="w-16 h-16"
                src={
                  "/images/avatar/" + discution.reciever.avatarNumber + ".png"
                }
              />
              <h1 className="font-face-pg text-center text-3xl m-auto">
                {discution.reciever.firstName +
                  " " +
                  discution.reciever.lastName}
              </h1>
            </div>
            <hr className="mt-2 mb-2" />
            <p className="font-face-pg text-xl h-10 max-h-10 truncate">
              {discution.content}
            </p>
            <p className="font-face-pg text-sm mb-3">à {date}</p>
            <Link
              href={{
                pathname: "/chat/message",
                query: { id: discution.recieverId }, // the data
              }}
            >
              <button
                className={`${styles["submitConnection"]} rounded-full shadow-md p-2 font-face-pg h-14 hover:scale-105 transition duration-500`}
              >
                Ouvrir la conversation
              </button>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

export default ChatList;
