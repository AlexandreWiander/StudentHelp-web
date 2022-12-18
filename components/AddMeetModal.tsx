import React, {useEffect, useState} from "react";
import { toast } from "react-toastify";
import jwt_decode from "jwt-decode";


type ModalProps = {
    id: number;
};

let token: string | null = "";
let idUser = -1;

export default function DeleteUserModal({ id }: ModalProps,props:any) {
    const [showModal, setShowModal] = React.useState(false);
    const [userRequests, setUserRequests]=useState([]);
    const [userSelected, setUserSelected]=useState("/");

    useEffect(() => {
        token = localStorage.getItem("JWT");
        const decodedToken = jwt_decode(token ?? "") as any;
        if(idUser==-1)idUser = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        const body = {id: idUser, token: token};
        fetch("/api/tutor/getInactiveRequests", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
        })
            .then((res) => res.json())
            .then((result) => {
                const list = result.requestsList;
                setUserRequests(list);
            })
    }, []);

    async function addMeet(id: number) {
        var nameInput = document.getElementById("nom") as HTMLInputElement;
        var dateInput = document.getElementById("date") as HTMLInputElement;
        var hourStartInput = document.getElementById("start") as HTMLInputElement;
        var hourEndInput = document.getElementById("end") as HTMLInputElement;
        var placeInput = document.getElementById("place") as HTMLInputElement;
        if(nameInput.value!=""){
            if(dateInput.value!=""){
                if(hourStartInput.value!=""){
                    if(hourEndInput.value!=""){
                        if(userSelected!="/"){
                            if(placeInput.value!=""){
                                const body = {token: token, id: idUser, name:nameInput.value, place:placeInput.value, invitedId:userSelected, from:dateInput.value+"T"+hourStartInput.value, to:dateInput.value+"T"+hourEndInput.value};
                                var response = await fetch("/api/agenda/addMeet", {
                                    method: "POST",
                                    body: JSON.stringify(body),
                                    headers: {"Content-Type": "application/json"},
                                });
                                if(response.status==200){
                                    window.location.reload();
                                    setShowModal(false);
                                    toast.success("Le rendez-vous a bien été ajouté", {
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
                                    setShowModal(false);
                                    toast.error("Une erreur est survenue lors de l'ajout du rendez-vous", {
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
                            }else{
                                toast.error("Il est obligatoire de choisir un lieu de rendez-vous !", {
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
                        }else{
                            toast.error("Il est obligatoire de choisir un utilisateur avec qui sera le rendez-vous !", {
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
                    }else{
                        toast.error("L'heure de fin est obligatoire !", {
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
                }else{
                    toast.error("L'heure de début est obligatoire !", {
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
            }else{
                toast.error("La date est obligatoire !", {
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
        }else{
            toast.error("Le nom est obligatoire !", {
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
    const userChange=(e:any)=>{
        setUserSelected(e.target.value);
    };

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className={`bg-blueTheme text-white ml-3 rounded-full shadow-md p-2 font-face-pg h-12 hover:scale-105 transition duration-500`}
            >
                Ajouter rendez-vous
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
                                        Ajout d'un nouveau rendez-vous
                                    </h3>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <label htmlFor="floatingInput" className="text-gray-700">Encoder un nom</label>
                                    <input id="nom" type="text"
                                           className="form-control block w-full text-center py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                           placeholder="Nom" />
                                    <label htmlFor="floatingInput" className="text-gray-700">Encoder un lieu</label>
                                    <input id="place" type="text"
                                           className="form-control block w-full text-center py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                           placeholder="Lieu" />
                                    <select onChange={userChange} id="userSelection" name="user" required
                                            className="w-2/3 mt-1 mb-4 px-2 py-3 text-base border border-transparent rounded-lg bg-white">
                                        <option value="0" className="text-center">Sélectionner un utilisateur</option>
                                        {userRequests.map((one)=>(
                                            <option key={one["tutorId"]} className="text-center" value={one["tutorId"]}>{one["askName"]}</option>
                                        ))}
                                    </select>
                                    <div className="flex items-center justify-center">
                                       <div className="flex flex-col items-center">
                                           <label htmlFor="floatingInput" className="text-gray-700">Sélectionner une date</label>
                                           <input id="date" type="date"
                                                  className="form-control block w-full text-center px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                  placeholder="Select a date" />
                                           <label htmlFor="floatingInput" className="text-gray-700">Sélectionner une heure de début</label>
                                           <input id="start" type="time"
                                                  className="form-control block w-full text-center px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                  placeholder="Select a date" />
                                           <label htmlFor="floatingInput" className="text-gray-700">Sélectionner une heure de fin</label>
                                           <input id="end" type="time"
                                                  className="form-control block w-full text-center py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                                                  placeholder="Select a date" />
                                       </div>
                                    </div>
                                    <div>
                                    </div>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="bg-white rounded-full shadow-md py-2 px-6 font-face-pg h-12 hover:scale-105 transition duration-500"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        className="ml-3 bg-blueTheme text-white rounded-full shadow-md py-2 px-6 font-face-pg h-12 hover:scale-105 transition duration-500"
                                        type="button"
                                        onClick={() => addMeet(id)}
                                    >
                                        Ajouter
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
