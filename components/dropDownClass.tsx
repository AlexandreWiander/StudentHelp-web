import {useEffect, useState} from "react";

export function DropDownClass(props:any) {
    const [classes, setClasses] = useState([]);
    const [classSelected, setClassSelect]=useState("0");

    useEffect(()=>{
        const token = localStorage.getItem("JWT");
        const body = {token:token}
        fetch("/api/classes/getClasses", {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        })
            .then((res) => res.json())
            .then((result)=>{
                const cours = result.listClasses;
                setClasses(cours);
            })
    },[classes,classSelected]);

    const classChange=(e:any)=>{
        props.onChanged(e.target.value);
    };
    return (
        <select onChange={classChange} id="class" name="class" required
                   className="w-1/2 mt-1 mb-4 px-2 py-3 text-base border border-transparent rounded-lg bg-white">
        <option value="0" className="text-center">Sélectionner un cours</option>
        {classes.map((one)=>(
            <option key={one["id"]} className="text-center" value={one["id"]+" "+ one["name"]}>{one["name"]}</option>
        ))}
    </select>);

}

export default DropDownClass;
