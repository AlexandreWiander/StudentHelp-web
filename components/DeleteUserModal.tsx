import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

type ModalProps = {
  id: number;
};

export default function DeleteUserModal({ id }: ModalProps) {
  const [showModal, setShowModal] = React.useState(false);
  const [token, setToken] = React.useState<string | null>();
  const router = useRouter();

  useEffect(() => {
    setToken(localStorage.getItem("JWT"));
  }, []);

  function deleteUser(id: number): void {
    console.log(id, token);

    if (token != null) {
      const body = { token: token, id: id };

      fetch("/api/admin/deleteUser", {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.message == "Success") {
            router.push("/admin");
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
          } else {
            toast.error("Une erreur est survenu", {
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
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`bg-redTheme text-white ml-3 rounded-full shadow-md p-2 font-face-pg h-12 hover:scale-105 transition duration-500`}
      >
        Supprimer
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="rounded-lg shadow-lg relative flex flex-col w-full bg-darkGrey border-2 outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Etes-vous sûr de vouloir supprimer cet utilisateur ?
                  </h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-slate-500 text-lg leading-relaxed">
                    Attention, une fois l'utilisateur supprimé, il sera
                    impossible de récupérer ses données.
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="bg-blueTheme text-white rounded-full shadow-md p-2 font-face-pg h-12 hover:scale-105 transition duration-500"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Annuler
                  </button>
                  <button
                    className="ml-3 bg-redTheme text-white rounded-full shadow-md p-2 font-face-pg h-12 hover:scale-105 transition duration-500"
                    type="button"
                    onClick={() => deleteUser(id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
