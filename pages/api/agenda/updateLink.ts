import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const linkResponse = await fetch('https://porthos-intra.cg.helmo.be/e180478/Auth/ScheduleLink',{
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+req.body.token,
        },
        body: JSON.stringify({ id: req.body.id, link:req.body.link }),
    });
    if(linkResponse.status==200){
        res.status(200).json({});
    }else{
        res.status(400).json({});
    }

}
