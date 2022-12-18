import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const rawResponse = await fetch('https://porthos-intra.cg.helmo.be/e180478/TutorRequest?id='+req.body.id, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'bearer '+req.body.token,
        },
        body: JSON.stringify({ comment: req.body.comment, id: req.body.id, tutorId: req.body.tutorId, classId: req.body.classId }),
    });
    if(rawResponse.status == 200){
        let comment = "J'aurai besoin d'aide !";
        if(req.body.comment!="/"){
            comment = req.body.comment;
        }
        const response = await fetch('https://porthos-intra.cg.helmo.be/e180478/Message?idSender='+req.body.id+"&idReciever="+req.body.tutorId+"&message="+comment,{
            method: 'POST',
            headers: {
                'accept': 'text/plain',
                'Content-Type': 'text/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, HEAD',
                'Authorization': 'bearer '+req.body.token,
            },
        });
        if(response.status==200){
            res.status(200).json({});
        }else{
            res.status(400).json({});
        }
    } else {
        res.status(400).json({});
    }
}