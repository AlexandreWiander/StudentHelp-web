import { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import { toast } from "react-toastify";

export default function Home() {
  const [mail, setMail] = useState("");
  const [pass, setPass] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const validEmail = new RegExp(
    "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z].[a-zA-Z0-9.-]+$"
  );

  useEffect(() => {}, []);

  async function registerNormal() {
    const body = {
      mail: mail,
      password: pass,
      firstname: firstName,
      lastname: lastName,
    };

    if (mail && pass && firstName && lastName) {
      if (validEmail.test(mail)) {
        await fetch("/api/auth/register", {
          method: "POST",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        })
          .then((res) => res.json())
          .then((result) => {
            if (result.message == "Success") {
              toast.success("Compte créé", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });
              setMail("");
              setPass("");
              setFirstName("");
              setLastName("");
            } else if (result.message == "Le user existe déjà") {
              toast.error("Un compte possède déjà cette adresse mail", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });
            } else {
              toast.error(
                "Une erreur s'est produite durant l'inscription, veuillez réessayer",
                {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "colored",
                }
              );
            }
          });
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
      toast.error("Veuillez compléter tous les champs", {
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

  return (
    <div className="bg-white shadow-md px-8 pt-6 pb-8 mt-10 mb-4 rounded-lg w-1/2 m-auto">
      <h1 className="font-face-pg text-center text-4xl">
        Créer un utilisateur
      </h1>
      <hr className="mt-5 mb-5" />
      <div className="flex flex-col space-y-5">
        <input
          placeholder="Adresse mail"
          className={`${styles.inputConnection} rounded-full shadow-md p-2 font-face-pg h-14 focus:scale-105 transition duration-500`}
          name="mail"
          onChange={(e) => setMail(e.target.value)}
          type="text"
        />
        <input
          placeholder="Mot de passe"
          className={`${styles.inputConnection} rounded-full shadow-md p-2 font-face-pg h-14 focus:scale-105 transition duration-500`}
          name="pass"
          onChange={(e) => setPass(e.target.value)}
          type="password"
        />
        <input
          placeholder="Prénom"
          className={`${styles.inputConnection} rounded-full shadow-md p-2 font-face-pg h-14 focus:scale-105 transition duration-500`}
          name="firstname"
          onChange={(e) => setFirstName(e.target.value)}
          type="text"
        />
        <input
          placeholder="Nom"
          className={`${styles.inputConnection} rounded-full shadow-md p-2 font-face-pg h-14 focus:scale-105 transition duration-500`}
          name="name"
          onChange={(e) => setLastName(e.target.value)}
          type="text"
        />
        <button
          onClick={() => registerNormal()}
          className={`${styles["submitConnection"]} rounded-full shadow-md p-2 font-face-pg h-14 hover:scale-105 transition duration-500`}
          type="submit"
        >
          Créer le compte
        </button>
      </div>
    </div>
  );
}
