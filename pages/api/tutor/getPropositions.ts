import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    propositionList: Proposition[];
}
export interface Proposition{
    id:number,
    name:string,
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const rawResponse = await fetch('https://porthos-intra.cg.helmo.be/e180478/Class/props?id='+req.body.id, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+req.body.token,
        },
    });
    const content = await rawResponse.json();
    if(rawResponse.status == 200){
        var propositions=[];
        for(var i=0; i<content.length; i++){
            var one = content[i];
            const oneProposition : Proposition={
                id:one.id,
                name:one.name,
            }
            propositions.push(oneProposition);
        }
        res.status(200).json({ propositionList: propositions});
    } else {
        res.status(200).json({propositionList:[]});
    }
}