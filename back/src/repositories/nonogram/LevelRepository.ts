import { PrismaClient } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';
const prisma = new PrismaClient();

import { Level, Score } from "../../entities/nonogram";
import { HandleError } from "../../utils/HandleError";
import { nonogramVariables } from "../../variables";
import { ILevelRepository } from '../../interfaces/repositories/nonogram';
import type { DBLevel, RawScore } from '../../types';
import { Cell } from '../../types/nonogram';

import { ILevelUtils } from '../../interfaces/utils/nonogram';


export type Filters = {
    page: number;
    size: string;
    isCompleted: boolean;
};

export class LevelRepository implements ILevelRepository {
    private levelUtils: ILevelUtils;

    constructor(levelUtils: ILevelUtils) {
        this.levelUtils = levelUtils;
    }

    /**
     * Get formatted score
     * @param {RawScore} score 
     * @returns {Score} Formatted score
     */
    private getFormattedScore(score: RawScore): Score {
        return new Score({
            id: score.id,
            time: score.time,
            userId: score.userId,
            levelId: score.levelId,
            createdAt: score.createdAt
        });
    }
    


    /**
     * Get formatted level
     * @param {FormattedLevel} level 
     * @returns {Promise<Level>} Formatted level with scores if available
     */
    private getFormattedLevel(level: DBLevel): Level {
        // Check if grid is valid
        if(!this.levelUtils.isValidGrid(level.grid as JsonValue)) throw new Error("Invalid grid");

        const formattedLevel: Level = new Level({
            id: level.id,
            name: level.name,
            grid: level.grid as Cell[][],
            size: level.size,
            authorId: level.authorId,
            createdAt: level.createdAt,
            updatedAt: level.updatedAt,
            deletedAt: level.deletedAt
        }, this.levelUtils);

        if(!level.scores) return formattedLevel;

        formattedLevel.setScores(level.scores.map((s) => {
            return this.getFormattedScore(s);
        }));

        return formattedLevel;
    }


    
    /**
     * Get levels based on filters
     * @param {Filters} filters 
     * @param {string} userId 
     * @returns {Promise<Level[]>} Levels
     */
    public async getLevels(filters: Filters, userId: string | null): Promise<Level[] | null> {
        try {
            const { page, size, isCompleted } = filters;

            if(!userId && (isCompleted === true || isCompleted === false)) 
                throw new Error("userId is required when isCompleted is defined");

            if(userId) {
                const user = await prisma.user.findUnique({
                    where: { id: userId }
                });

                if(!user) throw new Error(`User with id ${userId} not found`);
            }

            // Prisma query and data mapping
            const levels: Level[] = await prisma.level.findMany({
                where: {
                    size: size ?? undefined,
                    scores: isCompleted ? { some: { userId: userId! } } : undefined
                },
                skip: (page - 1) * nonogramVariables.ePerPage,
                take: nonogramVariables.ePerPage,
                include: {
                    scores: isCompleted ? { where: { userId: userId! } } : undefined
                }
            })
            .then((data) => {
                return data.map((l) => {
                    const level: Level = this.getFormattedLevel(l as DBLevel);

                    return level;
                });
            });

            if(!levels || levels.length == 0) return null;

            return levels;

        } catch(e: unknown) {
            HandleError.handle({
                file: "LevelRepository",
                fn: "getLevels",
                message: `filters value: ${JSON.stringify(filters)}`,
                error: e
            });

            return null;
        }
    }



    /**
     * Get level by ID
     * @param {number} id ID of the level
     * @returns 
     */
    public async getLevelById(id: number): Promise<Level | null> {
        try {
            const level = await prisma.level.findUnique({
                where: { id },
                include: { scores: true }
            });

            if(!level) return null;

            return this.getFormattedLevel(level as DBLevel);

        } catch(e: unknown) {
            HandleError.handle({
                file: "LevelRepository",
                fn: "getLevelById",
                message: `id: ${id}`,
                error: e
            });

            return null;
        }
    }



    /**
     * Save an array of levels
     * @param {Level[]} levels 
     */
    public async saveLevels(levels: Level[]): Promise<void> {
        if(levels.length == 0) throw new Error("No levels to save");

        for(const l of levels) {
            await l.save();
        }
    }
}