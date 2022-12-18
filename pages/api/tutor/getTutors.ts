import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    listTutors: Request[];
}
export interface Request{
    id:number,
    name:string,
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const rawResponse = await fetch('https://porthos-intra.cg.helmo.be/e180478/Class/tutors?id='+req.body.id, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+req.body.token,
        },
    });
    const content = await rawResponse.json();
    if(rawResponse.status == 200){
        var tutors=[];
        for(var i=0; i<content.length; i++){
            var one = content[i];
            if(one.id!=req.body.userId){
                const oneTutor : Request={
                    id:one.id,
                    name: one.firstName + " " + one.lastName,
                }
                tutors.push(oneTutor);
            }
        }
        res.status(200).json({ listTutors: tutors});
    } else {
        res.status(200).json({listTutors:[]});
    }
}