import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const rep = await fetch("https://porthos-intra.cg.helmo.be/e180478/Auth?email=" + req.body.mail);

    const message = rep.statusText;
    const content = await rep.text();

    if(message != "OK" || (message == "OK" && content != "yes")){
        const rawResponse = await fetch('https://porthos-intra.cg.helmo.be/e180478/Auth/register', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: req.body.mail, password: req.body.password, lastName: req.body.lastname, firstName: req.body.firstname })
        });
    
        if(rawResponse.status == 200){
            res.status(200).json({ message: "Success"});
        } else {
            res.status(400).json({ message: rawResponse.statusText});
        }
    } else {
        res.status(400).json({ message: "Le user existe déjà"});
    }
  }