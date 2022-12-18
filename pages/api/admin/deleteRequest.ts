import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    message: string;
}


export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    let url = "https://porthos-intra.cg.helmo.be/e180478/AdminContact/" + req.body.id;
    let resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + req.body.token, 
            }
        });

    if(resp.status == 200){
        res.status(200).json({ message: "Success"});
    } else {
        res.status(400).json({ message: "Error"});
    }
}