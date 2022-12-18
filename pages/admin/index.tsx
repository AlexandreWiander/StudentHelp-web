import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "../../styles/Home.module.css";

export default function Home() {
  const router = useRouter();
  const [users, setUsers] = useState<Array<any>>([]);
  const [change, setChange] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("JWT");
    if (token != null) {
      const body = { token: token };
      fetch("/api/admin/getUsers", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((result) => {
          setUsers(result.userList);
        });
    }
  }, [change]);

  function banUser(idO: number): void {
    const token = localStorage.getItem("JWT");
    if (token != null) {
      const body = { token: token, id: idO };

      fetch("/api/admin/banUser", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.message == "Success") {
            let val = change;
            setChange(val + 1);
            toast.success("L'action a été effectuée", {
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
  }

  return (
    <div className={styles.lobby}>
      <div className="font-face-pg flex flex-row flex-wrap bg-white shadow-md px-5 pt-6 pb-5 rounded-lg h-full">
        <ul className=" divide-y divide-gray-200 min-w-full max-h-full overflow-x-hidden overflow-y-scroll scrollbar-thin scrollbar-thumb-blueTheme scrollbar-track-blue-300 pr-5">
          <button
            onClick={() => router.push("/admin/contact")}
            className={`${styles["submitConnection"]} mb-5 ml-3 mt-3 text-white rounded-full shadow-md p-2 font-face-pg h-14 hover:scale-105 transition duration-500 w-2/12`}
          >
            Voir les requêtes des utilisateurs
          </button>
          <button
            onClick={() => router.push("/admin/newUser")}
            className={`${styles["submitConnection"]} mb-5 ml-5 mt-3 text-white rounded-full shadow-md p-2 font-face-pg h-14 hover:scale-105 transition duration-500 w-2/12`}
          >
            Créer un nouvel utilisateur
          </button>
          {users!.map((user) => {
            return (
              <li key={user.id} className="py-3 sm:pb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      className="w-16 h-16 rounded-full"
                      src={"/images/avatar/" + user.avatarNumber + ".png"}
                      alt="Neil image"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-medium text-gray-900 truncate">
                      {user.firstName + " " + user.lastName}
                      {!user.isActive ? (
                        <span className="bg-redTheme text-white text-xs ml-2 mb-3 rounded dark:bg-red-200 dark:text-red-900 p-1">
                          BANNI
                        </span>
                      ) : null}
                    </p>

                    <p className="text-sm text-gray-700 truncate ">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    className={`${styles["submitConnection"]} pt-4 text-white text-center rounded-full shadow-md p-2 font-face-pg h-14 hover:scale-105 transition duration-500 w-1/8`}
                    href={{
                      pathname: "/admin/user",
                      query: { id: user.id },
                    }}
                  >
                    Voir l'utilisateur
                  </Link>
                  {!user.isActive ? (
                    <button
                      className={`bg-greenTheme text-white rounded-full shadow-md p-2 font-face-pg h-14 hover:scale-105 transition duration-500 w-2/12 whitespace-nowrap`}
                      onClick={() => banUser(user.id)}
                    >
                      Débannir l'utilisateur
                    </button>
                  ) : (
                    <button
                      className={`bg-redTheme text-white rounded-full shadow-md p-2 font-face-pg h-14 hover:scale-105 transition duration-500  w-2/12`}
                      onClick={() => banUser(user.id)}
                    >
                      Bannir l'utilisateur
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
