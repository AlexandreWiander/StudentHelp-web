import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import styles from "../../styles/Home.module.css";

export default function Contact() {
  const { data: session } = useSession();
  const router = useRouter();
  const [Mail, setMail] = useState("");
  const [Text, setText] = useState("");
  const validEmail = new RegExp(
    "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z].[a-zA-Z0-9.-]+$"
  );

  function Send() {
    const body = { mail: Mail, text: Text };

    if (Mail && Text) {
      fetch("/api/contact/sendContact", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.message == "Success") {
            toast.success("Le message a bien été envoyé !", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            if (session != undefined) {
              router.push("/");
            } else {
              router.push("/connection");
            }
          } else {
            toast.error("Le message ne s'est pas envoyé, veuillez réessayer", {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
            router.push("/contact");
          }
        });
    } else if (!validEmail.test(Mail)) {
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

  return (
    <div className="flex justify-center h-full place-items-center mt-20">
      <div className="bg-white shadow-md px-8 pt-6 pb-8 mb-4 rounded-lg w-1/2">
        <h1 className="font-face-pg text-center text-4xl">Nous contacter</h1>
        <hr className="mt-5 mb-5" />
        <div className="flex flex-col space-y-5">
          <input
            placeholder="Entrez votre adresse email"
            className={`${styles.inputConnection} rounded-full shadow-md p-2 font-face-pg h-14 focus:scale-105 transition duration-500`}
            name="mail"
            required
            onChange={(e) => setMail(e.target.value)}
            type="email"
          />
          <textarea
            placeholder="Entrez votre mot de passe"
            className={`${styles.inputConnection} rounded-lg shadow-md p-2 font-face-pg h-48 focus:scale-105 transition duration-500 resize-none`}
            name="text"
            required
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={() => Send()}
            className={`${styles["submitConnection"]} rounded-full shadow-md p-2 font-face-pg h-14 hover:scale-105 transition duration-500`}
            type="submit"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
