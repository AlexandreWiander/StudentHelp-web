import styles from "../styles/Home.module.css";
import google from "../public/images/google.png";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

function ConnectionForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");

  function Log() {
    const validEmail = new RegExp(
      "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z].[a-zA-Z0-9.-]+$"
    );

    if (name == "" || pass == "") {
      toast.error("Email et/ou mot de passe vide", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else if (!validEmail.test(name)) {
      toast.error("Email invalide", {
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
      signIn("credentials", {
        mail: name,
        password: pass,
        redirect: false,
      })
        .then((res) => {
          if (res?.ok == true) {
            router.push("/");
          } else {
            toast.error("La connexion à échoué", {
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
        })
        .catch((err) => {
          console.log(err.message);

          if (err.message == "Failed to construct 'URL': Invalid URL") {
            router.reload();
          }
        });
    }
  }

  return (
    <>
      <div className="bg-white shadow-md px-8 pt-6 pb-8 mb-4 rounded-lg w-1/2">
        <h1 className="font-face-pg text-center text-4xl">Connexion</h1>
        <hr className="mt-5 mb-5" />
        <div className="flex flex-col space-y-5">
          <input
            placeholder="Entrez votre adresse email"
            className={`${styles.inputConnection} rounded-full shadow-md p-2 font-face-pg h-14 focus:scale-105 transition duration-500`}
            name="mail"
            onChange={(e) => setName(e.target.value)}
            type="text"
          />
          <input
            placeholder="Entrez votre mot de passe"
            className={`${styles.inputConnection} rounded-full shadow-md p-2 font-face-pg h-14 focus:scale-105 transition duration-500`}
            name="password"
            onChange={(e) => setPass(e.target.value)}
            type="password"
          />
          <button
            onClick={() => Log()}
            className={`${styles["submitConnection"]} rounded-full shadow-md p-2 font-face-pg h-14 hover:scale-105 transition duration-500`}
            type="submit"
          >
            Se connecter
          </button>
        </div>
        <hr className="mt-5 mb-5" />
        <div className="flex flex-col space-y-5">
          <button
            onClick={() => signIn("GoogleProvider")}
            className={`${styles["submitConnection"]} rounded-full shadow-md p-2 font-face-pg h-14 hover:scale-105 transition duration-500`}
          >
            <div className="flex flex-row content-start justify-center">
              <img src={google.src} className="m-0 p-0 h-8 w-8"></img>
              <div className="ml-2 my-auto">
                <p>Se connecter avec Google</p>
              </div>
            </div>
          </button>
          <div className="flex flex-row content-start justify-center">
            <p>Vous n'avez pas encore de compte ?</p>
            <a
              href="/connection/register"
              className="ml-3 text-blue-500 hover:text-blue-800"
            >
              S'inscrire
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConnectionForm;
