export interface User {
  name: string;
  inactive: boolean;
}

export const users: User[] = [];
export const rooms: Room[] = [];

export interface Room {
  name: string;
  owner: string;
  members: { name: string; score: number }[];
  status: 'waiting' | 'started' | 'completed';
  winner: string | null;
  rounds: Round[];
  currentRound: CurrentRoundItem[];
}

export interface Round {
  scores: Score[];
}

export interface Score {
  user: string;
  value: number | null;
  score: number;
}

interface CurrentRoundItem {
  user: string;
  value: number;
}

const room: Room = {
  name: 'Room name',
  owner: 'user-id',
  members: [{ name: 'user-id', score: 10 }],
  status: 'waiting',
  winner: null,
  currentRound: [{ user: 'user-id', value: 10 }],
  rounds: [
    {
      scores: [
        { user: 'user-id', value: 10, score: 0 },
        {
          user: 'user-id2',
          value: null,
          score: -10,
        },
        { user: 'user-id3', value: 20, score: -1 },
      ],
    },
  ],
};

export const secureRoomResponse = (room: Room) => {
  const { currentRound, ...rest } = room;
  return {
    ...rest,
    currentRound: currentRound.map(x => ({ user: x.user, value: 'xx' })),
  };
};
