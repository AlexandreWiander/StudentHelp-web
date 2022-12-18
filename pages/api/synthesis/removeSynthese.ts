import type { NextApiRequest, NextApiResponse } from "next";

type Data = {

}
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const rawResponse = await fetch('https://porthos-intra.cg.helmo.be/e180478/Synthesis/'+req.body.id, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+req.body.token,
        },
    });
    if(rawResponse.status == 200){
        res.status(200).json({});
    } else {
        res.status(400).json({});
    }
}