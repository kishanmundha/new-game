import type { NextApiRequest, NextApiResponse } from 'next';
import { rooms, Round, users } from '../../../../../src/game-state';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
  }

  const roomName: string = req.query.name as string;

  const room = rooms.find(x => x.name === roomName);

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  if (room.status !== 'started') {
    return res.status(400).json({ error: 'Room is not active' });
  }

  if (room.currentRound.length === 0) {
    return res.status(400).json({ error: 'No one given value' });
  }

  const avg =
    room.currentRound.reduce((p, c) => p + c.value, 0) /
    room.currentRound.length;

  const outputValue = avg * 0.8;

  const nearestNumber = room.currentRound.reduce((p, c) => {
    if (p === -1) {
      return c.value;
    }
    if (Math.abs(c.value - outputValue) < Math.abs(p - outputValue)) {
      return c.value;
    }

    return p;
  }, -1);

  const outMembers: any[] = [];

  const round: Round = {
    scores: [],
  };

  room.members
    .filter(x => x.score > 0)
    .forEach(member => {
      const item = room.currentRound.find(x => x.user === member.name);

      if (!item) {
        member.score = -1;
        outMembers.push(member.name);
        round.scores.push({
          user: member.name,
          value: -1,
          score: -10,
        });
        return;
      }

      if (item.value !== nearestNumber) {
        member.score--;
        round.scores.push({
          user: member.name,
          value: item.value,
          score: -1,
        });
        if (member.score === 0) {
          outMembers.push(member.name);
        }
        return;
      } else {
        round.scores.push({
          user: member.name,
          value: item.value,
          score: 0,
        });
      }
    });

  room.currentRound = [];
  room.rounds.push(round);

  const players = room.members.filter(x => x.score > 0);

  if (players.length === 1) {
    room.status = 'completed';
    room.winner = players[0].name;
  }

  res.status(200).json({
    players: room.members.filter(x => x.score > 0),
    out: outMembers,
  });
}
