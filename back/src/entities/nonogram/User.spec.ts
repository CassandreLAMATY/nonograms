import { PrismaClient } from '@prisma/client';
import { User } from './User';
import { RawUser, RawScore } from '../../types';
import { HandleError } from '../../utils/HandleError';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    score: {
      findMany: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

// Mock HandleError
jest.mock('../../utils/HandleError', () => ({
  HandleError: {
    handle: jest.fn(),
  },
}));

const prisma = new PrismaClient();

afterAll(() => {
    prisma.$disconnect();
  });
  

describe('User Class', () => {
  const rawUser: RawUser = {
    id: BigInt(1),
    username: 'TestUser',
    avatar: 'avatar.png',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should create a User instance', () => {
    const user = new User(rawUser);
    expect(user).toBeInstanceOf(User);
    expect(user.getId()).toBe(BigInt(1));
  });

  it('should return scores for a specific level', async () => {
    const user = new User(rawUser);
    const mockScores: RawScore[] = [
      { id: 1, time: 100, userId: BigInt(1), levelid: 1 },
      { id: 2, time: 200, userId: BigInt(1), levelid: 1 },
    ];
    (prisma.score.findMany as jest.Mock).mockResolvedValue(mockScores);

    const scores = await user.getScoresByLevelId(1);
    expect(scores).toEqual(mockScores);
    expect(prisma.score.findMany).toHaveBeenCalledWith({
      where: { levelId: 1, userId: BigInt(1) },
      orderBy: { time: 'asc' },
    });
  });

  it('should handle errors when getting scores', async () => {
    const user = new User(rawUser);
    const mockError = new Error('Database error');
    (prisma.score.findMany as jest.Mock).mockRejectedValue(mockError);

    const scores = await user.getScoresByLevelId(1);
    expect(scores).toEqual([]);
    expect(HandleError.handle).toHaveBeenCalledWith({
      file: 'User',
      fn: 'getScoresByLevelId',
      error: mockError,
    });
  });
});