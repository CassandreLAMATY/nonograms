import { PrismaClient } from '@prisma/client';
import { LevelRepository } from './LevelRepository';
import { HandleError } from '../../utils/HandleError';
import { nonogramVariables } from '../../variables';
import { Level, Score } from '../../entities/nonogram';
import { DBLevel, RawScore } from '../../types';

// Mock Prisma Client
jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    user: {
      findUnique: jest.fn(),
    },
    level: {
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

describe('LevelRepository Class', () => {
  const levelRepository = new LevelRepository();

  afterAll(async () => {
    // Disconnect Prisma Client after all tests run
    await prisma.$disconnect();
  });

  it('should return levels based on filters', async () => {
    const filters = { page: 1, size: '2x2', isCompleted: false };
    const userId = BigInt(1);

    const mockLevels: DBLevel[] = [
      {
        id: 1,
        name: 'Level 1',
        grid: [
            [{ status: '1' },{ status: '0' }],
            [{ status: '1' },{ status: '0' }]
        ],
        size: '2x2',
        authorId: BigInt(1),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: userId });
    (prisma.level.findMany as jest.Mock).mockResolvedValue(mockLevels);

    const levels = await levelRepository.getLevels(filters, userId);

    expect(levels).toHaveLength(1);
    expect(levels[0]).toBeInstanceOf(Level);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
    expect(prisma.level.findMany).toHaveBeenCalledWith({
      where: {
       size: '2x2',
      },
      skip: 0,
      take: nonogramVariables.ePerPage,
    });
  });

  /* it('should handle errors when getting levels', async () => {
    const filters = { page: 1,size: '2x2', isCompleted: false };
    const userId = BigInt(1);
    const mockError = new Error('Database error');

    (prisma.user.findUnique as jest.Mock).mockRejectedValue(mockError);

    const levels = await levelRepository.getLevels(filters, userId);
    expect(levels).toEqual([]);
    expect(HandleError.handle).toHaveBeenCalledWith({
      file: 'LevelRepository',
      fn: 'getLevels',
      message: `filters value: ${JSON.stringify(filters)}`,
      error: mockError,
    });
  });

  it('should throw an error if userId is not provided when isCompleted is defined', async () => {
    const filters = { page: 1,size: '2x2', isCompleted: true };
    await expect(levelRepository.getLevels(filters, null)).rejects.toThrow(
      'userId is required when isCompleted is defined'
    );
  }); */
});