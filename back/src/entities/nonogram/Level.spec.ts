import { PrismaClient } from '@prisma/client';
import { Level } from './Level';
import { RawLevel } from '../../types';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    level: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    score: {
      create: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

afterAll(() => {
  prisma.$disconnect();
});

describe('Level Class', () => {
  const rawLevel: RawLevel = {
    name: 'Test Level',
    grid: [[0, 1], [1, 0]],
    size: '2x2',
  };

  it('should create a Level instance', () => {
    const level = new Level(rawLevel);
    expect(level).toBeInstanceOf(Level);
    expect(level.getProperties().name).toBe('Test Level');
  });

  it('should throw an error if required fields are missing', () => {
    expect(() => new Level({ ...rawLevel, name: '' })).toThrow('Level name is required');
    expect(() => new Level({ ...rawLevel, grid: [] })).toThrow('Level grid must have at least one row');
  });

  it('should save the level to the database', async () => {
    const level = new Level(rawLevel);
    await level.save();
    expect(prisma.level.create).toHaveBeenCalledWith({
      data: {
        name: 'Test Level',
        grid: [[0, 1], [1, 0]],
        size: '2x2',
        authorId: undefined,
      },
    });
  });

  it('should update the level in the database', async () => {
    const level = new Level({ ...rawLevel, id: 1 });
    await level.update();
    expect(prisma.level.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        name: 'Test Level',
        grid: [[0, 1], [1, 0]],
        size: '2x2',
        authorId: undefined,
        deletedAt: undefined,
      },
    });
  });

  it('should delete the level from the database', async () => {
    const level = new Level({ ...rawLevel, id: 1 });
    await level.delete();
    expect(prisma.level.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it('should save a score for the level', async () => {
    const level = new Level({ ...rawLevel, id: 1 });
    await level.saveScore(1, 100);
    expect(prisma.score.create).toHaveBeenCalledWith({
      data: {
        userId: 1,
        levelId: 1,
        time: 100,
      },
    });
  });
});