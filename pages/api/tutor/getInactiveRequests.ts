import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    requestsList: Request[];
}
export interface Request{
    id:number,
    tutorClassName:string,
    askName:string,
    tutorName: string,
    tutorId:number,
    commentaire:string,
    avatarTutor:number,
    isActive:boolean
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const rawResponse = await fetch('https://porthos-intra.cg.helmo.be/e180478/TutorRequest/inactive/'+req.body.id, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+req.body.token,
        },
    });
    const content = await rawResponse.json();
    if(rawResponse.status == 200){
        var requests=[];
        for(var i=0; i<content.length; i++){
            var one = content[i];
            var user = one.user;
            var tuteur = one.tutor;
            var oneClass = one.class;
            const oneRequest : Request={
                id:one.id,
                tutorClassName:oneClass.name,
                tutorName:tuteur.firstName + " " + tuteur.lastName,
                askName:user.firstName+ " "+user.lastName,
                commentaire:one.comment,
                isActive:one.isActive,
                tutorId:one.userId,
                avatarTutor:user.avatarNumber,
            }
            requests.push(oneRequest);
        }
        res.status(200).json({ requestsList: requests});
    } else {
        res.status(200).json({requestsList:[]});
    }
}