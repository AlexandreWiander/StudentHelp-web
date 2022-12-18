import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    token: string;
    message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const rep = await fetch("https://porthos-intra.cg.helmo.be/e180478/Auth/google?email=" + req.body.mail);

    const isGoogle = rep.statusText;
    const content = await rep.text();    

    if(isGoogle == "OK" && content != "yes"){
        const rawResponse = await fetch('https://porthos-intra.cg.helmo.be/e180478/Auth/login', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: req.body.mail, password: req.body.password, lastName: "", firstName: "" })
        });
        const content = await rawResponse.json();
    
        if(rawResponse.status == 200){
            res.status(200).json({ token: content, message: "L'utilisateur est connecté"});
        } else {
            res.status(400).json({ token: '', message: rawResponse.statusText});
        }
    } else if (isGoogle == "OK" && content == "yes"){
        res.status(401).json({ token: '', message: "Compte Google, veuillez vous connecter de la manière appropriée"});
    } else {
        res.status(400).json({ token: '', message: "Erreur"});
    }
  }