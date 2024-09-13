import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

import { IScore } from '../../interfaces/entities/nonogram';
import { RawScore } from '../../types';
import { HandleError } from '../../utils/HandleError';

export class Score implements IScore {
    private id?: number;
    private time: number;
    private userId: string;
    private levelId: number;
    private createdAt?: Date;



    constructor(score: RawScore) {
        // Required fields validation
        if(!score.time) throw new Error("Score time is required");
        if(!score.userId) throw new Error("Score userId is required");
        if(!score.levelId) throw new Error("Score levelId is required");

        // Required fields
        this.time = score.time!;
        this.userId = score.userId!;
        this.levelId = score.levelId!;

        // Optional fields
        this.id = score.id;
        this.createdAt = score.createdAt;
    }



    /**
     * Returns the score
     * @returns {RawScore} Score
     */
    public getProperties(): RawScore {
        return {
            id: this.id,
            time: this.time,
            userId: this.userId,
            levelId: this.levelId,
            createdAt: this.createdAt
        }
    }



    /**
     * Saves the score
     * @returns {Promise<void>}
     */
    public async save(): Promise<void> {
        try {
            await prisma.score.create({
                data: {
                    time: this.time,
                    userId: this.userId,
                    levelId: this.levelId
                }
            });
        } catch(e: unknown) {
            HandleError.handle({
                file: "Score",
                fn: "save",
                error: e
            });
        }
    }

    

    /**
     * Deletes the score
     * @returns {Promise<void>}
     */
    public async delete(): Promise<void> {
        if (!this.id)
            throw new Error("Cannot delete a score without an ID");

        try {
            await prisma.score.delete({
                where: { id: this.id }
            });
        } catch (e: unknown) {
            HandleError.handle({
                file: "Score",
                fn: "delete",
                error: e
            });
        }
    }
}