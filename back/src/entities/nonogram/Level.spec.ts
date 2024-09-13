import { Level } from './Level';
import { PrismaClient } from '@prisma/client';
import { HandleError } from '../../utils/HandleError';
import { RawLevel } from '../../types';
import { Cell } from '../../types/nonogram';
import { Score } from './Score';

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

describe('Level', () => {
  let mockPrismaClient: any;
  let handleErrorMock: jest.Mock;

  beforeEach(() => {
    mockPrismaClient = new PrismaClient();
    handleErrorMock = HandleError.handle as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should throw error when name is missing', () => {
    expect(() => {
      new Level({ grid: [[{ status: 0 }]] });
    }).toThrow('Level name is required');
  });

  test('should throw error when grid is missing', () => {
    expect(() => {
      new Level({ name: 'Test Level' });
    }).toThrow('Level grid is required');
  });

  test('should throw error when grid has zero rows', () => {
    expect(() => {
      new Level({ name: 'Test Level', grid: [] });
    }).toThrow('Level grid must have at least one row');
  });

  test('should throw error when grid has zero columns', () => {
    expect(() => {
      new Level({ name: 'Test Level', grid: [[]] });
    }).toThrow('Level grid must have at least one column');
  });

  test('should throw error when grid rows have different lengths', () => {
    const grid: Cell[][] = [
      [{ status: 0 }],
      [{ status: 0 }, { status: 1 }],
    ];
    expect(() => {
      new Level({ name: 'Test Level', grid });
    }).toThrow('Level grid must have the same number of columns in each row');
  });

  test('should throw error when grid contains invalid cell status', () => {
    const grid: Cell[][] = [[{ status: 3 as 0 | 1 | 2 }]];
    expect(() => {
      new Level({ name: 'Test Level', grid });
    }).toThrow('Level grid contains invalid values');
  });

  test('should create Level instance when valid data is provided', () => {
    const grid: Cell[][] = [
      [{ status: 0 }, { status: 1 }],
      [{ status: 2 }, { status: 1 }],
    ];
    const levelData: RawLevel = {
      name: 'Test Level',
      grid,
    };
    const level = new Level(levelData);
    expect(level).toBeInstanceOf(Level);
    expect(level.getProperties().name).toBe('Test Level');
    expect(level.getProperties().grid).toEqual(levelData.grid);
    expect(level.getProperties().size).toBe('2x2');
  });

  test('should set size when provided', () => {
    const grid: Cell[][] = [
      [{ status: 0 }, { status: 1 }],
      [{ status: 2 }, { status: 1 }],
    ];
    const levelData: RawLevel = {
      name: 'Test Level',
      grid,
      size: '5x5',
    };
    const level = new Level(levelData);
    expect(level.getProperties().size).toBe('5x5');
  });

  test('should set scores correctly', () => {
    const grid: Cell[][] = [
      [{ status: 0 }, { status: 1 }],
      [{ status: 2 }, { status: 1 }],
    ];
    const level = new Level({ name: 'Test Level', grid });

    // Create a mock Score instance
    const mockScore = new Score({
      userId: 'user1',
      levelId: level.getProperties().id || 1,
      time: 100,
    });

    // Mock the getProperties method
    jest.spyOn(mockScore, 'getProperties').mockReturnValue({ userId: 'user1', time: 100 });

    level.setScores([mockScore]);
    expect(level.getProperties().scores).toEqual([{ userId: 'user1', time: 100 }]);
  });

  test('should save level to database', async () => {
    const grid: Cell[][] = [
      [{ status: 0 }, { status: 1 }],
      [{ status: 2 }, { status: 1 }],
    ];
    const levelData: RawLevel = {
      name: 'Test Level',
      grid,
      authorId: 'author1',
    };
    const level = new Level(levelData);
    await level.save();
    expect(mockPrismaClient.level.create).toHaveBeenCalledWith({
      data: {
        name: levelData.name,
        grid: levelData.grid,
        size: '2x2',
        authorId: 'author1',
      },
    });
  });

  test('should update level in database', async () => {
    const grid: Cell[][] = [
      [{ status: 0 }, { status: 1 }],
      [{ status: 2 }, { status: 1 }],
    ];
    const levelData: RawLevel = {
      id: 1,
      name: 'Test Level',
      grid,
      authorId: 'author1',
    };
    const level = new Level(levelData);
    await level.update();
    expect(mockPrismaClient.level.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        name: levelData.name,
        grid: levelData.grid,
        size: '2x2',
        authorId: 'author1',
        deletedAt: undefined,
      },
    });
  });

  test('should handle error when updating level without id', async () => {
    const grid: Cell[][] = [
      [{ status: 0 }, { status: 1 }],
      [{ status: 2 }, { status: 1 }],
    ];
    const levelData: RawLevel = {
      name: 'Test Level',
      grid,
      authorId: 'author1',
    };
    const level = new Level(levelData);
    await level.update();
    expect(handleErrorMock).toHaveBeenCalledWith({
      file: 'Level',
      fn: 'update',
      error: new Error('Cannot update a level without an ID'),
    });
  });

  test('should update fields in database', async () => {
    const grid: Cell[][] = [
      [{ status: 0 }, { status: 1 }],
      [{ status: 2 }, { status: 1 }],
    ];
    const levelData: RawLevel = {
      id: 1,
      name: 'Test Level',
      grid,
      authorId: 'author1',
    };
    const level = new Level(levelData);
    const fieldsToUpdate = { name: 'Updated Level' };
    await level.updateFields(fieldsToUpdate);
    expect(mockPrismaClient.level.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: fieldsToUpdate,
    });
  });

  test('should handle error when updating fields without id', async () => {
    const grid: Cell[][] = [
      [{ status: 0 }, { status: 1 }],
      [{ status: 2 }, { status: 1 }],
    ];
    const levelData: RawLevel = {
      name: 'Test Level',
      grid,
      authorId: 'author1',
    };
    const level = new Level(levelData);
    const fieldsToUpdate = { name: 'Updated Level' };
    await level.updateFields(fieldsToUpdate);
    expect(handleErrorMock).toHaveBeenCalledWith({
      file: 'Level',
      fn: 'save',
      message: 'fields value: ' + JSON.stringify(fieldsToUpdate),
      error: new Error('Cannot update a level without an ID'),
    });
  });

  test('should delete level from database', async () => {
    const grid: Cell[][] = [
      [{ status: 0 }, { status: 1 }],
      [{ status: 2 }, { status: 1 }],
    ];
    const levelData: RawLevel = {
      id: 1,
      name: 'Test Level',
      grid,
    };
    const level = new Level(levelData);
    await level.delete();
    expect(mockPrismaClient.level.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  test('should handle error when deleting level without id', async () => {
    const grid: Cell[][] = [
      [{ status: 0 }, { status: 1 }],
      [{ status: 2 }, { status: 1 }],
    ];
    const levelData: RawLevel = {
      name: 'Test Level',
      grid,
    };
    const level = new Level(levelData);
    await level.delete();
    expect(handleErrorMock).toHaveBeenCalledWith({
      file: 'Level',
      fn: 'delete',
      error: new Error('Cannot delete a level without an ID'),
    });
  });

  test('should save score to database', async () => {
    const grid: Cell[][] = [
      [{ status: 0 }, { status: 1 }],
      [{ status: 2 }, { status: 1 }],
    ];
    const levelData: RawLevel = {
      id: 1,
      name: 'Test Level',
      grid,
    };
    const level = new Level(levelData);
    await level.saveScore('user1', 120);
    expect(mockPrismaClient.score.create).toHaveBeenCalledWith({
      data: {
        userId: 'user1',
        levelId: 1,
        time: 120,
      },
    });
  });

  test('should handle error when saving score without level id', async () => {
    const grid: Cell[][] = [
      [{ status: 0 }, { status: 1 }],
      [{ status: 2 }, { status: 1 }],
    ];
    const levelData: RawLevel = {
      name: 'Test Level',
      grid,
    };
    const level = new Level(levelData);
    await level.saveScore('user1', 120);
    expect(handleErrorMock).toHaveBeenCalledWith({
      file: 'Level',
      fn: 'saveScore',
      error: new Error('Cannot save a score without a level ID'),
    });
  });
});
