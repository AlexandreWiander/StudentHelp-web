import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    discutionList: any[];
}

interface Discution {
  id: number;
  content: string;
  sender: any;
  senderId: number;
  reciever: any;
  recieverId: number;
  dateAndHour: Number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
const rep = await fetch("https://porthos-intra.cg.helmo.be/e180478/Message/" + req.body.idCurrentUser, {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + req.body.token, 
        }
}).then((res) => res.json())
.then((result) => {  
  if(result == "La liste des classes de tutorat est vide."){
    return res.status(400).json({ discutionList: []});
  }
  const reversed = result.reverse();
  let discutionsId: any[] = [];
  let discutions: any[] = [];
  reversed.forEach((message: any) => {    
    if(req.body.idCurrentUser == message.senderId){
      if(!discutionsId.some(item => message.recieverId === item)){
        discutionsId.push(message.recieverId);
        discutions.push(message);
      }
    } else {
      if(!discutionsId.some(item => message.senderId === item)){
        let changedMessage: Discution = {id: 0, content: '', sender: null, reciever: null, dateAndHour: Date.now(), recieverId: 0, senderId: 0};

        changedMessage.id = message.id;
        changedMessage.content = message.content;
        changedMessage.sender = message.reciever;
        changedMessage.reciever = message.sender;
        changedMessage.dateAndHour = message.dateAndHour;
        changedMessage.recieverId = message.senderId;
        changedMessage.senderId = message.recieverId;

        discutionsId.push(message.senderId);
        discutions.push(changedMessage);
              
      }
    }
    
  });
  res.status(200).json({ discutionList: discutions});
});
}