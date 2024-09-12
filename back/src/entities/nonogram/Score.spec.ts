import { PrismaClient } from '@prisma/client';
import { Score } from './Score';
import { RawScore } from '../../types';
import { HandleError } from '../../utils/HandleError';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    score: {
      create: jest.fn(),
      delete: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

afterAll(() => {
    prisma.$disconnect();
  });  

describe('Score Class', () => {
  const rawScore: RawScore = {
    time: 100,
    userId: BigInt(1),
    levelid: 1,
  };

  it('should create a Score instance', () => {
    const score = new Score(rawScore);
    expect(score).toBeInstanceOf(Score);
    expect(score.getProperties().time).toBe(100);
  });

  it('should throw an error if required fields are missing', () => {
    expect(() => new Score({ ...rawScore, time: undefined })).toThrow('Score time is required');
    expect(() => new Score({ ...rawScore, userId: undefined })).toThrow('Score userId is required');
    expect(() => new Score({ ...rawScore, levelid: undefined })).toThrow('Score levelId is required');
  });

  it('should save the score to the database', async () => {
    const score = new Score(rawScore);
    await score.save();
    expect(prisma.score.create).toHaveBeenCalledWith({
      data: {
        time: 100,
        userId: BigInt(1),
        levelId: 1,
      },
    });
  });

  it('should delete the score from the database', async () => {
    const score = new Score({ ...rawScore, id: 1 });
    await score.delete();
    expect(prisma.score.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should throw an error when deleting a score without an ID', async () => {
    const score = new Score(rawScore);
    await expect(score.delete()).rejects.toThrow('Cannot delete a score without an ID');
  });
});