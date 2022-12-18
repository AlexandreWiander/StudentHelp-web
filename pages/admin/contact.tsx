import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "../../styles/Home.module.css";

export default function Home() {
  const [requests, setUsers] = useState<Array<any>>([]);
  const [change, setChange] = useState(0);

  function DeleteRequest(id: number): void {
    const token = localStorage.getItem("JWT");
    if (token != null) {
      const body = { token: token, id: id };

      fetch("/api/admin/deleteRequest", {
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

  function ResolveRequest(id: number): void {
    const token = localStorage.getItem("JWT");
    if (token != null) {
      const body = { token: token, id: id };

      fetch("/api/admin/resolveRequest", {
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

  useEffect(() => {
    const token = localStorage.getItem("JWT");
    if (token != null) {
      const body = { token: token };
      fetch("/api/admin/getRequests", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((result) => {
          setUsers(result.requestList);
        });
    }
  }, [change]);

  return (
    <div className={styles.lobby}>
      <div className="font-face-pg flex flex-row flex-wrap bg-white shadow-md px-5 pt-6 pb-5 rounded-lg h-full">
        <ul className=" divide-y divide-gray-200 min-w-full max-h-full overflow-y-scroll scrollbar-thin scrollbar-thumb-blueTheme scrollbar-track-blue-300 pr-2">
          {requests!.map((request) => {
            return (
              <div className="flex items-center space-x-4 p-5">
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-medium text-gray-900 truncate">
                    {request.mail}
                    {request.isResolved ? (
                      <span className="bg-greenTheme text-white text-xs ml-2 mb-3 rounded p-1">
                        RESOLU
                      </span>
                    ) : null}
                  </p>

                  <p className="text-sm text-gray-700 h-24 overflow-y-scroll scrollbar-thin scrollbar-thumb-blueTheme scrollbar-track-blue-300">
                    {request.message}
                  </p>
                </div>

                <button
                  className={`${styles["submitConnection"]} text-white rounded-full shadow-md p-2 font-face-pg h-14 hover:scale-105 transition duration-500 w-1/12`}
                  onClick={() =>
                    window.open(
                      "mailto:" +
                        request.mail +
                        "?subject=Réponse%20à%20votre%20question"
                    )
                  }
                >
                  Répondre par mail
                </button>
                {!request.isResolved ? (
                  <button
                    className={`bg-greenTheme text-white rounded-full shadow-md p-2 font-face-pg h-14 hover:scale-105 transition duration-500 w-1/12`}
                    onClick={() => ResolveRequest(request.id)}
                  >
                    Marquer comme résolu
                  </button>
                ) : (
                  <button
                    className={`bg-redTheme text-white rounded-full shadow-md p-2 font-face-pg h-14 hover:scale-105 transition duration-500 w-1/12`}
                    onClick={() => ResolveRequest(request.id)}
                  >
                    Marquer comme non-résolu
                  </button>
                )}

                <button
                  className={`bg-redTheme text-white rounded-full shadow-md p-2 font-face-pg h-14 hover:scale-105 transition duration-500 w-1/12`}
                  onClick={() => DeleteRequest(request.id)}
                >
                  Supprimer
                </button>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
