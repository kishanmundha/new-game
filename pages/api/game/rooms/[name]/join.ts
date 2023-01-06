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
  let userName: string = req.body.user;

  if (!userName) {
    return res.status(400).json({ error: 'User name is required' });
  }

  if (!users.find(x => x.name === userName)) {
    return res.status(400).json({ error: 'User does not exist' });
  }

  const room = rooms.find(x => x.name === roomName);

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  if (room.status !== 'waiting') {
    return res.status(400).json({ error: 'Room is full. You cannot join now' });
  }

  if (room.members.find(x => x.name === userName)) {
    return res.status(400).json({ error: 'User already in room' });
  }

  room.members.push({
    name: userName,
    score: 10,
  });

  res.status(200).json(secureRoomResponse(room));
}
