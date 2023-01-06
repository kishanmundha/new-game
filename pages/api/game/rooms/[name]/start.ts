import type { NextApiRequest, NextApiResponse } from 'next';
import {
  rooms,
  secureRoomResponse,
  users,
} from '../../../../../src/game-state';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
  }

  const roomName: string = req.query.name as string;

  const room = rooms.find(x => x.name === roomName);

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  if (room.status !== 'waiting') {
    return res.status(400).json({ error: 'Room is already started' });
  }

  room.status = 'started';

  res.status(200).json(secureRoomResponse(room));
}
