import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "../../styles/Home.module.css";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarNumber: boolean;
  isGoogleAccount: boolean;
  isActive: boolean;
  isAdmin: boolean;
}

export default function userModif() {
  const [user, setUser] = useState<User>();
  const [mail, setMail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [admin, setAdmin] = useState(false);
  const [active, setActive] = useState(false);
  const [avatarNumber, setAvatarNumber] = useState(0);
  const validEmail = new RegExp(
    "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z].[a-zA-Z0-9.-]+$"
  );
  const router = useRouter();
  const query = router.query;
  const idO = query.id;
  let token;

  useEffect(() => {
    token = localStorage.getItem("JWT");

    if (token != null) {
      const body = { idUser: idO, token: token };
      fetch("/api/admin/getUserInfo", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((result) => {
          setUser(result.user);
          setMail(result.user.email);
          setFirstname(result.user.firstName);
          setLastname(result.user.lastName);
          setAvatarNumber(result.user.avatarNumber);
          setAdmin(result.user.isAdmin);
          setActive(result.user.isActive);
        });
    }
  }, [idO]);

  function modifyUser() {
    token = localStorage.getItem("JWT");

    if (mail && firstname && lastname && avatarNumber) {
      if (validEmail.test(mail)) {
        console.log("valide");

        if (token != null) {
          const body = {
            id: idO,
            token: token,
            mail: mail,
            firstname: firstname,
            lastname: lastname,
            admin: admin,
            active: active,
            avatarnumber: avatarNumber,
          };
          fetch("/api/admin/modifyUser", {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
          })
            .then((res) => res.json())
            .then((result) => {
              if (result.message == "Success") {
                toast.success("Compte modifié", {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                });
              }
            });
        }
      } else {
        toast.error("L'adresse mail est invalide", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } else {
      toast.error("Veuillez remplir tous les champs", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }

  if (user != undefined) {
    return (
      <div className="flex justify-center h-full place-items-center mt-20">
        <div className="bg-white shadow-md px-8 pt-6 pb-8 mb-4 rounded-lg w-1/3">
          <h1 className="font-face-pg text-center text-4xl">
            Modifier l'utilisateur
          </h1>
          <hr className="mt-5 mb-5" />
          <div className="flex flex-col">
            <label className="ml-2">Adresse mail:</label>
            <input
              className={`${styles.inputConnection} mt-1 rounded-full shadow-md p-2 font-face-pg h-14 focus:scale-105 transition duration-500`}
              name="mail"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              type="email"
              disabled={user.isGoogleAccount ? true : false}
            />
            <label className="mt-4 ml-2">Prénom:</label>
            <input
              className={`${styles.inputConnection} rounded-full shadow-md p-2 font-face-pg h-14 focus:scale-105 transition duration-500`}
              name="firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              type="text"
            />
            <label className="mt-4 ml-2">Nom:</label>
            <input
              className={`${styles.inputConnection} rounded-full shadow-md p-2 font-face-pg h-14 focus:scale-105 transition duration-500`}
              name="lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              type="text"
            />
            <label className="mt-4 ml-2">Numéro d'avatar:</label>
            <input
              className={`${styles.inputConnection} rounded-full shadow-md p-2 font-face-pg h-14 focus:scale-105 transition duration-500`}
              name="avatarNumber"
              value={avatarNumber}
              onChange={(e) => setAvatarNumber(parseInt(e.target.value))}
              type="number"
            />
            <div className="mt-4 flex flex-row">
              <label className=" ml-2">Admin:</label>
              <input
                className="ml-3"
                type="checkbox"
                value="Oui"
                name="admin"
                checked={admin}
                onChange={() => (admin ? setAdmin(false) : setAdmin(true))}
              />
            </div>
            <div className="mt-4 flex flex-row">
              <label className="ml-2">Actif:</label>
              <input
                className="ml-3"
                type="checkbox"
                value="Oui"
                name="active"
                checked={active}
                onChange={() => (active ? setActive(false) : setActive(true))}
              />
            </div>
            <button
              onClick={() => modifyUser()}
              className={`${styles["submitConnection"]} mt-7 rounded-full shadow-md p-2 font-face-pg h-14 hover:scale-105 transition duration-500`}
              type="submit"
            >
              Modifier
            </button>
          </div>
        </div>
      </div>
    );
  }
}
