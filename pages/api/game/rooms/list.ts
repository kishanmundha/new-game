import type { NextApiRequest, NextApiResponse } from 'next';
import { rooms, secureRoomResponse } from '../../../../src/game-state';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(rooms.map(x => secureRoomResponse(x)));
}
