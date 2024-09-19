// Score.spec.ts
import { Score } from './Score';
import { PrismaClient } from '@prisma/client';
import { HandleError } from '../../utils/HandleError';
import { RawScore } from '../../types';

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    score: {
      create: jest.fn(),
      delete: jest.fn(),
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

describe('Score', () => {
  let mockPrismaClient: any;
  let handleErrorMock: jest.Mock;

  beforeEach(() => {
    mockPrismaClient = new PrismaClient();
    handleErrorMock = HandleError.handle as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should throw error when time is missing', () => {
    expect(() => {
      new Score({ userId: 'user1', levelId: 1 });
    }).toThrow('Score time is required');
  });

  test('should throw error when userId is missing', () => {
    expect(() => {
      new Score({ time: 100, levelId: 1 });
    }).toThrow('Score userId is required');
  });

  test('should throw error when levelId is missing', () => {
    expect(() => {
      new Score({ time: 100, userId: 'user1' });
    }).toThrow('Score levelId is required');
  });

  test('should create Score instance when valid data is provided', () => {
    const scoreData: RawScore = {
      time: 100,
      userId: 'user1',
      levelId: 1,
    };
    const score = new Score(scoreData);
    expect(score).toBeInstanceOf(Score);
    expect(score.getProperties()).toEqual({
      id: undefined,
      time: 100,
      userId: 'user1',
      levelId: 1,
      createdAt: undefined,
    });
  });

  test('should save score to database', async () => {
    const scoreData: RawScore = {
      time: 100,
      userId: 'user1',
      levelId: 1,
    };
    const score = new Score(scoreData);
    await score.save();
    expect(mockPrismaClient.score.create).toHaveBeenCalledWith({
      data: {
        time: 100,
        userId: 'user1',
        levelId: 1,
      },
    });
  });

  test('should handle error when saving score fails', async () => {
    const error = new Error('Database error');
    mockPrismaClient.score.create.mockRejectedValue(error);

    const scoreData: RawScore = {
      time: 100,
      userId: 'user1',
      levelId: 1,
    };
    const score = new Score(scoreData);
    await score.save();

    expect(handleErrorMock).toHaveBeenCalledWith({
      file: 'Score',
      fn: 'save',
      error,
    });
  });

  test('should delete score from database', async () => {
    const scoreData: RawScore = {
      id: 1,
      time: 100,
      userId: 'user1',
      levelId: 1,
    };
    const score = new Score(scoreData);
    await score.delete();
    expect(mockPrismaClient.score.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  test('should throw error when deleting score without id', async () => {
    const scoreData: RawScore = {
      time: 100,
      userId: 'user1',
      levelId: 1,
    };
    const score = new Score(scoreData);
    await expect(score.delete()).rejects.toThrow('Cannot delete a score without an ID');
  });

  test('should handle error when deleting score fails', async () => {
    const error = new Error('Database error');
    mockPrismaClient.score.delete.mockRejectedValue(error);

    const scoreData: RawScore = {
      id: 1,
      time: 100,
      userId: 'user1',
      levelId: 1,
    };
    const score = new Score(scoreData);
    await score.delete();

    expect(handleErrorMock).toHaveBeenCalledWith({
      file: 'Score',
      fn: 'delete',
      error,
    });
  });
});
