import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    link:string,
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const linkResponse = await fetch('https://porthos-intra.cg.helmo.be/e180478/Auth/ScheduleLink/'+req.body.id,{
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+req.body.token,
        }
    });
    if(linkResponse.status==200){
        var link = new TextDecoder("utf-8").decode(await linkResponse.arrayBuffer());
        var lenght = link.length;
        var myLink = link.substring(1,lenght-1);
        res.status(200).json({link:myLink});
    }else{
        res.status(200).json({link:"/"});
    }

}
