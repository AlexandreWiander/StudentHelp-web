import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const rawResponse = await fetch('https://porthos-intra.cg.helmo.be/e180478/EventClass', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+req.body.token,
        },
        body: JSON.stringify([{ name: req.body.name, class: req.body.lieu, from: req.body.from, to: req.body.to, userId:req.body.id }]),
    });
    if(rawResponse.status == 200){
        res.status(200).json({});
    } else {
        res.status(400).json({});
    }

}