import { useEffect, useState } from "react";
import file from "../../public/images/file.png";
import cat from "../../public/images/Loading_cercle.gif";
import DropDownClass from "../../components/dropDownClass";
import styles from "../../styles/Home.module.css";
import { toast } from "react-toastify";
import jwt_decode from "jwt-decode";

let token: string | null = "";
let idUser = -1;

export default function Home() {
  const [synthesis, setSynth] = useState([]);
  const [mySynthesis, setMySynth]=useState([]);
  const [useFilter, setFilter] = useState(false);
  const [classSelected, setClass]= useState("0");
  const [addClass, setAddClass]=useState("0");


    useEffect(() => {
      token = localStorage.getItem("JWT");
      const decodedToken = jwt_decode(token??"") as any;
      if(idUser==-1)idUser = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      var pos = classSelected.indexOf(" ");
      const body = {id: idUser, token:token}
      if(classSelected=="0"||classSelected.substring(0,pos)=="0"){
          fetch("/api/synthesis/getSynths", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
          })
              .then((res) => res.json())
              .then((result)=>{
                  const list = result.listSynth;
                  setSynth(list);
                  setMySynth(result.myListSynth);
              })
      }else{
          var pos = classSelected.indexOf(" ");
          const body = { id: classSelected.substring(0,pos), token:token};
          fetch("/api/synthesis/getFilterSynth", {
              method: "post",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
          })
              .then((res) => res.json())
              .then((result)=>{
                  const list = result.listSynth;
                  setSynth(list);
              })
      }
  }, [synthesis, mySynthesis, useFilter]);

  function changeClass(value:any){
      setClass(value);
  }
  function changeAddClass(value:any){
      setAddClass(value);
  }


  function downloadFile(idSynthese:number, fileName:string){
        const body = { id: idSynthese, fileName:fileName };
      fetch("https://porthos-intra.cg.helmo.be/e180478/Synthesis/"+idSynthese, {
          method: 'GET',
          headers: {
              'Authorization': 'bearer '+token,
          },
      })
            .then((res) => res.blob())
            .then((result)=>{
                var download = document.createElement("a");
                download.href = URL.createObjectURL(result);
                download.download = fileName;
                download.click();
            })
  }

    async function addFile() {
        document.getElementById("loadingGif")!.style.display = "block";
        const selectedFile = document.getElementById('file') as HTMLInputElement;
        var files = selectedFile?.files;
        if (files != null) {
            var one = files[0];
            if (one != undefined) {
                if(addClass!="0"){
                    var pos = addClass.indexOf(" ");
                    var now = new Date();
                    var month = now.getMonth()+1;
                    const date = now.getFullYear()+"-"+month+"-"+now.getDate()+" "+now.getHours()+":"+now.getMinutes();
                    const body = new FormData();
                    body.append("File", one);
                    body.append("ClassId", addClass.substring(0,pos));
                    body.append("CreationDate",date);
                    body.append("UserId", idUser.toString());
                    body.append("Name", one.name);
                    const response = await fetch("https://porthos-intra.cg.helmo.be/e180478/Synthesis", {
                        method: "POST",
                        headers: {
                            'Authorization': 'bearer '+token,
                        },
                        body:body
                    });
                    if(response.status==200){
                        document.getElementById("loadingGif")!.style.display = "none";
                        toast.success("Ajout de la synthèse effectué avec succès !",{
                            position:"top-center",
                            autoClose:5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover:true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                        });

                    }else{
                        document.getElementById("loadingGif")!.style.display = "none";
                        toast.error("Erreur lors de l'ajout de la synthèse !",{
                            position:"top-center",
                            autoClose:5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover:true,
                            draggable: true,
                            progress: undefined,
                            theme: "colored",
                        });
                    }
                }else{
                    toast.error("Veuillez choisir un cours en utilisant le filtre de cours !",{
                        position:"top-center",
                        autoClose:5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover:true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                    });
                }
            } else {
                toast.error("Il faut sélectionner un synthèse pour en ajouter une !",{
                    position:"top-center",
                    autoClose:5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover:true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }
        }
    }

    const deleteSynthese=(event: { currentTarget: { id: any; }; })=>{
        const body = { id: event.currentTarget.id,token:token};
        fetch("/api/synthesis/removeSynthese", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
    };

  return (
    <div className="h-screen grid grid-cols-3">
        <div className="font-face-pg flex flex-col items-center col-span-2">
            <h1 className="mb-2 text-2xl font-extrabold tracking-tight leading-none mt-4 text-center">Liste des synthèses</h1>
            <DropDownClass onChanged={changeClass}/>
            <div className="grid grid-cols-4 overflow-y-scroll h-auto scrollbar-thin scrollbar-thumb-blueTheme scrollbar-track-blue-300">
                {synthesis.map((synthese)=> (
                    <div key={synthese["id"]} className="w-2/3 col-span-1 h-auto flex flex-col items-center m-4 p-4 border border-blueTheme bg-white rounded-lg shadow-md hover:bg-gray-100 h-auto">
                        <img src={file.src} className="m-2 w-2/3"></img>
                        <h5 className="text-md font-bold text-center">{synthese["name"]}</h5>
                        <p>{synthese["authorName"]}</p>
                        <button
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                            onClick={()=>downloadFile(synthese["id"],synthese["name"])}>
                            <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 20 20">
                                <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/>
                            </svg>
                            <span>Download</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
        <div className="flex flex-col items-center mt-2 font-face-pg">
            <p className="text-2xl font-extrabold tracking-tight leading-none mt-2 text-center">Ajouter une nouvelle synthèse:</p>
            <DropDownClass onChanged={changeAddClass}/>
            <div className="flex">
                    <input
                        className="block w-4/5 mt-4 mb-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        id="file" type="file" accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.csv"/>
                        <button className="bg-blueTheme text-white font-bold m-2 px-4 rounded" onClick={addFile}>Ajouter</button>

            </div>
            <img src={cat.src} className={`${styles["loading"]} m-2 w-20`} id="loadingGif" ></img>
            <p className="text-2xl font-extrabold tracking-tight leading-none mt-2 text-center">Mes synthèses:</p>
            <div className="grid grid-cols-2 overflow-y-scroll h-auto scrollbar-thin scrollbar-thumb-blueTheme scrollbar-track-blue-300 justify-center">
                {mySynthesis.map((synthese)=>(
                    <div key={synthese["id"]} className=" span-1 flex justify-center items-center m-4 py-2 px-10 border text-center border-blueTheme bg-white rounded-lg shadow-md hover:bg-gray-100 h-auto">
                        <h5 className="text-xs font-bold text-center">{synthese["name"]}</h5>
                        <button id={synthese["id"]} onClick={deleteSynthese}><img src={"images/block.png"} className="w-8 m-2"/></button>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}
