import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

import book from "../public/images/books.png";
import tutor from "../public/images/tutor.png";
import chat from "../public/images/chat.png";
import schedule from "../public/images/schedule.png";
import search from "../public/images/search.png";
import jwt_decode from "jwt-decode";

import LogOutButton from "./LogOutButton";
import { useSession } from "next-auth/react";

export function Navbar() {
  const { data: session } = useSession();

  const [role, setRole] = useState("");

  useEffect(() => {
    let token = localStorage.getItem("JWT");
    if (token != undefined && role == "") {
      const decodedToken: any = jwt_decode(token);

      setRole(
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ]
      );
    }
  }, [role]);

  return (
    <nav className={styles.navbar}>
      <div className="LogoTitle flex flex-row content-start ml-10 mr-10">
        <a href="/" className="flex flex-row content-start self-center">
          <div className="rounded-full">
            <img src={book.src} className="w-20 h-20 m-4"></img>
          </div>
          <h1 className="font-face-sz text-5xl self-center mb-4">
            StudentHelp
          </h1>
        </a>
        {session != undefined ? (
          <div className="flex flex-row content-start self-center ml-12">
            <a
              href="/tutor"
              className="flex flex-row content-start self-center hover:scale-125 transition duration-500"
            >
              <img src={tutor.src} className="w-16 h-16"></img>
              <p className="m-auto ml-2 text-lg font-face-pg">Tutorat</p>
            </a>
            <a
              href="/chat"
              className="flex flex-row content-start self-center ml-7 hover:scale-125 transition duration-500"
            >
              <img src={chat.src} className="w-16 h-16"></img>
              <p className="m-auto ml-2 text-lg font-face-pg">Messagerie</p>
            </a>

            <a
              href="/synthesis"
              className="flex flex-row content-start self-center ml-7 hover:scale-125 transition duration-500"
            >
              <img src={search.src} className="w-16 h-16"></img>
              <p className="m-auto ml-2 text-lg font-face-pg">Synthèses</p>
            </a>
          </div>
        ) : (
          <></>
        )}

        {session != undefined ? (
          <div className="self-center ml-auto flex flex-row content-start">
            <h1 className="mr-5 font-face-pg m-auto text-lg">
              Bonjour, {localStorage.getItem("fullName")}
            </h1>
            <LogOutButton />
            {role == "admin" ? (
              <div className="ml-3 self-center flex flex-row content-start">
                <a
                  href="/admin"
                  className="bg-white text-blueTheme rounded-full shadow-xl p-2 font-face-pg hover:scale-110 transition duration-500"
                >
                  Gestion Admin
                </a>
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
