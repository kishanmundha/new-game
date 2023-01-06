import type { NextApiRequest, NextApiResponse } from 'next';
import { rooms, users } from '../../../../../src/game-state';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
  }

  const roomName: string = req.query.name as string;
  const vote = req.body.vote;
  const userName: string = req.body.user;

  if (!userName) {
    return res.status(400).json({ error: 'User name is required' });
  }

  const room = rooms.find(x => x.name === roomName);

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  if (room.status !== 'started') {
    return res.status(400).json({ error: 'Room is not started' });
  }

  if (!room.members.find(x => x.name === userName)) {
    return res.status(400).json({ error: 'User is not in room' });
  }

  if (room.currentRound.find(x => x.user === userName)) {
    return res.status(400).json({ error: 'User already voted' });
  }

  room.currentRound.push({
    user: userName,
    value: vote,
  });

  res.status(200).json({
    message: 'Vote recorded. Please wait for the next round.',
  });
}
