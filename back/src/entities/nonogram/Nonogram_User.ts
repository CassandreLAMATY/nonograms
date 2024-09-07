import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

import { INonogram_User } from '../../interfaces/entities';
import { IHandleError } from '../../interfaces/utils';
import { User } from "../";
import type { RawUser, RawScore } from "../../types";

export class Nonogram_User extends User implements INonogram_User {
    private handleError: IHandleError;

    constructor(user: RawUser, handleError: IHandleError) {
        super(user);

        this.handleError = handleError;
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
            this.handleError.handle({
                file: "Nonogram_User",
                fn: "getScoresByLevelId",
                error: e
            });

            return [];
        }
    }
}