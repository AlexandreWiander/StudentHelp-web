import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    userList: any[];
}


export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    await fetch("https://porthos-intra.cg.helmo.be/e180478/Admin", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + req.body.token, 
            }
    }).then((res) => res.json())
    .then((result) => {
        let users = result;
        
        res.status(200).json({ userList: users});
    });
}