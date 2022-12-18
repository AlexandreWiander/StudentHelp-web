import type { NextApiRequest, NextApiResponse } from "next";
import {DateTime} from "next-auth/providers/kakao";
type Data = {
    listEvents:Event[];
    listMeets:Meeting[];
}
export interface Event{
    id:number,
    title:string,
    start:Date,
    end:Date,
    lieu:string,
    personne:number,
    isClass:boolean
}

export interface Meeting{
    id:number,
    nameMeet:string,
    avatarMeet:number,
    event:Event
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    var meets: Meeting[]=[];
    var events: Event[]=[];
    var checkEvent = req.body.checkEvent;
    if(checkEvent){
        const rawResponse = await fetch('https://porthos-intra.cg.helmo.be/e180478/EventClass?idUser='+req.body.id, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'bearer '+req.body.token,
            },
        });
        if(rawResponse.status == 200){

            const content = await rawResponse.json();
            for(var i=0; i<content.length; i++){
                var one = content[i];
                const oneEvent : Event={
                    id:one.id,
                    title: one.name,
                    start:new Date(one.from) as Date,
                    end: new Date(one.to) as Date,
                    lieu:one.class,
                    personne:0,
                    isClass:true,
                }
                events.push(oneEvent);
            }
            await getMeets(req, events, meets);
            res.status(200).json({listEvents:events, listMeets:meets});
        } else{
            await getMeets(req, events, meets);
            res.status(200).json({listMeets:meets, listEvents:events});
        }
    }else{
        await getMeets(req, events, meets);
        res.status(200).json({listEvents:events, listMeets:meets});
    }

}
async function getMeets(req: NextApiRequest, events: any[], meets: any[]) {
    const response = await fetch('https://porthos-intra.cg.helmo.be/e180478/Meets?idUser=' + req.body.id, {
        method: 'get',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'bearer ' + req.body.token,
        },
    });
    if (response.status == 200) {
        const contentMeet = await response.json();
        for (var i = 0; i < contentMeet.length; i++) {
            var one = contentMeet[i];
            let name;
            let avatar;
            let id;
            var user = one.user;
            var invited = one.invited;
            if (req.body.id != user.id) {
                name = user.firstName + " " + user.lastName;
                avatar = user.avatarNumber;
                id=user.id;
            } else {
                name = invited.firstName + " " + invited.lastName;
                avatar = invited.avatarNumber;
                id=invited.id;
            }
            const oneEvent: Event = {
                id: one.id,
                title: one.name,
                start: one.from,
                end: one.to,
                lieu: one.place,
                personne:id,
                isClass:false
            }
            events.push(oneEvent);
            const oneMeet: Meeting = {
                id: one.id,
                nameMeet: name,
                avatarMeet: avatar,
                event: oneEvent,
            }
            meets.push(oneMeet);
        }
    }
}