import type { NextApiRequest, NextApiResponse } from 'next';
import { rooms, secureRoomResponse } from '../../../../../src/game-state';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const room = rooms.find(x => x.name === req.query.name);

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  res.status(200).json(secureRoomResponse(room));
}
