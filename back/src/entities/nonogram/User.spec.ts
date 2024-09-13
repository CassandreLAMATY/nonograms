import { User } from './User';
import { PrismaClient } from '@prisma/client';
import { HandleError } from '../../utils/HandleError';
import { RawUser, RawScore } from '../../types';

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    score: {
      findMany: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mPrismaClient),
  };
});

jest.mock('../../utils/HandleError', () => ({
  HandleError: {
    handle: jest.fn(),
  },
}));

describe('User', () => {
  let mockPrismaClient: any;
  let handleErrorMock: jest.Mock;

  beforeEach(() => {
    mockPrismaClient = new PrismaClient();
    handleErrorMock = HandleError.handle as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create User instance when valid data is provided', () => {
    const userData: RawUser = {
      id: 'user1',
      username: 'TestUser',
      avatar: 'avatar.png',
    };
    const user = new User(userData);
    expect(user).toBeInstanceOf(User);
  });

  test('should return user ID', () => {
    const userData: RawUser = {
      id: 'user1',
      username: 'TestUser',
      avatar: 'avatar.png',
    };
    const user = new User(userData);
    expect(user.getId()).toBe('user1');
  });

  test('should return scores for a level', async () => {
    const userData: RawUser = {
      id: 'user1',
      username: 'TestUser',
      avatar: 'avatar.png',
    };
    const user = new User(userData);
    const levelId = 1;

    const mockScores: RawScore[] = [
      { id: 1, userId: 'user1', levelId: 1, time: 100 },
      { id: 2, userId: 'user1', levelId: 1, time: 120 },
    ];

    mockPrismaClient.score.findMany.mockResolvedValue(mockScores);

    const scores = await user.getScoresByLevelId(levelId);

    expect(mockPrismaClient.score.findMany).toHaveBeenCalledWith({
      where: {
        levelId: levelId,
        userId: 'user1',
      },
      orderBy: { time: 'asc' },
    });

    expect(scores).toEqual(mockScores);
  });

  test('should handle error when getting scores', async () => {
    const userData: RawUser = {
      id: 'user1',
      username: 'TestUser',
      avatar: 'avatar.png',
    };
    const user = new User(userData);
    const levelId = 1;

    const error = new Error('Database error');
    mockPrismaClient.score.findMany.mockRejectedValue(error);

    const scores = await user.getScoresByLevelId(levelId);

    expect(handleErrorMock).toHaveBeenCalledWith({
      file: 'User',
      fn: 'getScoresByLevelId',
      error,
    });

    expect(scores).toEqual([]);
  });
});
