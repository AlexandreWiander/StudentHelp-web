import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import jwt_decode from "jwt-decode";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@Microsoft/signalr";

interface Discution {
  id: string;
  content: string;
  sender: any;
  senderId: number;
  reciever: any;
  recieverId: number;
  dateAndHour: Date;
}

export default function message() {
  const [connection, setCon] = useState<HubConnection>();
  const [discution, setDiscution] = useState<Array<Discution>>();
  const [message, setMessage] = useState("");
  const [newMsg, setNewMsg] = useState(0);
  const [imageId, setImage] = useState(1);
  const [corrName, setName] = useState("");
  let myId = -1;

  const joinRoom = async (token: string) => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl(
          "https://porthos-intra.cg.helmo.be/e180478/chatHub?access_token=" +
            token
        )
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      connection.on("ReceiveMessage", (idSender, message) => {
        discution?.push(message);
        setDiscution(discution);
        let i = newMsg;
        setNewMsg(i + 1);
      });

      connection.serverTimeoutInMilliseconds = 240000;

      await connection.start();
      setCon(connection);
    } catch (e) {
    }
  };

  const sendMsg = async () => {
    const parsedInt = parseInt(typeof idO === "string" ? idO : "");

    try {
      await connection?.invoke("SendMessage", myId, parsedInt, message);
      let i = newMsg;
      setNewMsg(i + 1);
    } catch (error) {
    }
  };

  let token: any = null;
  const router = useRouter();
  const query = router.query;
  const idO = query.id;

  useEffect(() => {
    token = localStorage.getItem("JWT");

    joinRoom(token);

    if (token != null) {
      let decodedToken: any = jwt_decode(token);
      let id =
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

      const body = { idCurrentUser: id, token: token, idOtherUser: idO };
      fetch("/api/chat/getDiscution", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result != undefined && result != null) {
            let reverse = result.discution;
            if (Array.isArray(reverse)) {
              setDiscution(reverse.reverse().slice(0, 100));
              reverse.forEach((message: any) => {
                if (message.senderId.toString() == idO) {
                  setImage(message.sender.avatarNumber);
                  setName(
                    message.sender.firstName + " " + message.sender.lastName
                  );
                }
              });
            }
          }
        });
    }
  }, [idO, newMsg]);

  const handleKeypress = (e: { keyCode: number }) => {
    if (e.keyCode === 13) {
      sendMsg();
    }
  };

  if (discution != undefined) {
    return (
      <div className={styles.lobby}>
        <div className="flex flex-row w-full h-full">
          <div
            className={`${styles.leftBarChat} w-1/5 place-items-center p-20`}
          >
            <img
              className="w-28 h-28 m-auto"
              src={"/images/avatar/" + imageId + ".png"}
            />
            <h1 className="font-face-pg text-center text-3xl mt-5">
              {corrName}
            </h1>
          </div>

          <div className="bg-white flex-1 relative">
            <div className="flex flex-col h-full">
              <div className="flex flex-col-reverse justify-end flex-1 p-5 overflow-hidden">
                <div className="flex flex-col-reverse pr-2 overflow-y-scroll scrollbar-thin scrollbar-thumb-blueTheme scrollbar-track-blue-300">
                  {discution.map((message) => {
                    let date = new Date(message.dateAndHour)
                      .toLocaleTimeString()
                      .slice(0, 5);
                    if (message.senderId.toString() == idO) {
                      myId = message.recieverId;
                      return (
                        <div
                          key={message.id}
                          className="p-2 flex justify-start flex-col min-w-fit w-min"
                        >
                          <div
                            className={`${styles.leftBarChat} font-face-pg h-10 flex flex-col justify-center items-center px-3 rounded-full`}
                          >
                            {message.content}
                          </div>
                          <p className="pl-1">à {date}</p>
                        </div>
                      );
                    } else {
                      myId = message.senderId;
                      return (
                        <div key={message.id} className="p-2 flex justify-end">
                          <div className="flex-col min-w-fit w-min">
                            <p className="h-10 bg-darkGrey font-face-pg flex flex-col justify-center items-center px-3 rounded-full">
                              {message.content}
                            </p>
                            <p className="text-right pr-1">à {date}</p>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
              <div
                className="w-full flex flex-row p-5"
                onKeyDown={handleKeypress}
              >
                <input
                  className={`${styles.inputConnection} flex-1 rounded-full shadow-md p-5 font-face-pg h-14`}
                  autoFocus
                  onChange={(e) => setMessage(e.target.value)}
                  type="text"
                />
                <button
                  className={`${styles["submitConnection"]} rounded-full shadow-md p-2 font-face-pg h-14 w-32 ml-2 hover:scale-105 transition duration-500`}
                  type="submit"
                  onClick={() => sendMsg()}
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
