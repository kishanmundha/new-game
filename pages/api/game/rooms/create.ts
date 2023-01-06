import type { NextApiRequest, NextApiResponse } from 'next';
import { Room, rooms, users } from '../../../../src/game-state';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body;

  let name: string = req.body.name;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  name = name.toLowerCase().replace(/\W/g, '');

  if (!name) {
    return res.status(400).json({ error: 'Invalid name' });
  }

  if (!body.owner) {
    return res.status(400).json({ error: 'Owner is required' });
  }

  if (!users.find(x => x.name === body.owner)) {
    return res.status(400).json({ error: 'Owner does not exist' });
  }

  if (rooms.find(x => x.name === name)) {
    return res.status(400).json({ error: 'Room already exists with name' });
  }

  const room: Room = {
    name: name,
    owner: body.owner,
    winner: null,
    currentRound: [],
    members: [
      {
        name: body.owner,
        score: 10,
      },
    ],
    rounds: [],
    status: 'waiting',
  };

  rooms.push(room);

  res.status(200).json(room);
}
