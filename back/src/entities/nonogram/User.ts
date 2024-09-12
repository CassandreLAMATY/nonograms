import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

import { HandleError } from '../../utils/HandleError';

import { IUser } from '../../interfaces/entities/nonogram';
import { AbstractUser } from "../";
import type { RawUser, RawScore } from "../../types";

export class User extends AbstractUser implements IUser {
    constructor(user: RawUser) {
        super(user);
    }



    /**
     * Returns the ID of the user
     * @returns {bigint} ID of the user
     */
    public getId(): bigint {
        return this.id;
    }



    /**
     * Returns the scores of the user for a specific level from best time to worst
     * @param {number} levelId ID of the level
     * @returns {Promise<RawScore[]>} Scores of the user for the level
     */
    public async getScoresByLevelId(levelId: number): Promise<RawScore[]> {
        try {
            return await prisma.score.findMany({
                where: { 
                    levelId: levelId,
                    userId: this.id
                },
                orderBy: { time: 'asc' }
            });
        } catch(e: unknown) {
            HandleError.handle({
                file: "User",
                fn: "getScoresByLevelId",
                error: e
            });

            return [];
        }
    }
}