import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
    name: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
const rep = await fetch("https://porthos-intra.cg.helmo.be/e180478/Auth/" + req.body.id);

const content = await rep.json();
res.status(200).json({ name: content[0]});
}