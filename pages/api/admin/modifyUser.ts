import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {    
    let resp = await fetch('https://porthos-intra.cg.helmo.be/e180478/Auth/modification', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + req.body.token, 
            },
        body: JSON.stringify({ id: parseInt(req.body.id), email: req.body.mail, firstName: req.body.firstname, lastName: req.body.lastname, isAdmin: req.body.admin ,isActive: req.body.active,avatarNumber: parseInt(req.body.avatarnumber)})
        });        

        console.log(resp);
        
    
    if(resp.status == 200){
        res.status(200).json({ message: "Success"});
    } else {
        res.status(400).json({ message: "Error"});
    }
}