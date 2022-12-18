import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const rawResponse = await fetch('https://porthos-intra.cg.helmo.be/e180478/Meets', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+req.body.token,
        },
        body: JSON.stringify({ name: req.body.name, place: req.body.place, from: req.body.from, to: req.body.to, userId:parseInt(req.body.id), invitedId:parseInt(req.body.invitedId) }),
    });
    if(rawResponse.status == 200){
        res.status(200).json({});
    } else {
        res.status(400).json({});
    }

}