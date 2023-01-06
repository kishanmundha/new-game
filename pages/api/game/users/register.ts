import type { NextApiRequest, NextApiResponse } from 'next';
import { User, users } from '../../../../src/game-state';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
  }

  let name: string = req.body.name;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  name = name.toLowerCase().replace(/\W/g, '');

  if (!name) {
    return res.status(400).json({ error: 'Invalid name' });
  }

  if (users.find(x => x.name === name)) {
    return res.status(400).json({ error: 'Name already taken' });
  }

  const user: User = {
    name,
    inactive: false,
  };

  users.push(user);

  res.status(200).json(user);
}
