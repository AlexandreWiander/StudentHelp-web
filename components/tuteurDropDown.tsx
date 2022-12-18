import {useEffect, useState} from "react";
import jwt_decode from "jwt-decode";

let token: string | null = "";
let idUser =-1;

export function TuteurDropDown(props:any) {
    const [tutors, setTutors] = useState([]);

    useEffect(()=>{
        token = localStorage.getItem("JWT");
        const decodedToken = jwt_decode(token??"") as any;
        if(idUser==-1)idUser = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        if(props.id!="0"){
            const body = { id: props.id, userId:idUser, token:token };
            fetch("/api/tutor/getTutors", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })
                .then((res) => res.json())
                .then((result)=>{
                    const tutors = result.listTutors;
                    setTutors(tutors);
                })
        }
        else{
            setTutors([]);
        }
    },[props.classValue]);

    const tutorsChange=(e:any)=>{
        props.onChanged(e.target.value);
    };

    if(tutors.length>0){
        return (<select onChange={tutorsChange} id="class" name="class" required
                        className="w-1/2 mt-1 mb-4 mx-2 px-2 py-3 text-base border border-transparent rounded-lg bg-white">
            <option value="0" className="text-center">Sélectionner un tuteur</option>
            {tutors.map((one)=>(
                <option key={one["id"]} className="text-center" value={one["id"]}>{one["name"]}</option>
            ))}
        </select>);
    }else{
       return (
           <select onChange={tutorsChange} id="class" name="class" required disabled
                   className="w-1/2 mt-1 mb-4  mx-2 px-2 py-3 text-base border border-transparent rounded-lg bg-white">
               <option value="0" className="text-center">Sélectionner un tuteur</option>
               {tutors.map((one)=>(
                   <option key={one["id"]} className="text-center" value={one["id"]}>{one["name"]}</option>
               ))}
           </select>
       )
    }

}

export default TuteurDropDown;
