import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

import { HandleError } from '../../utils/HandleError';

import { ILevel } from '../../interfaces/entities/nonogram';
import { Score } from '.';
import type { FormattedLevel, RawLevel } from "../../types";

export class Level implements ILevel {
    private id?: number;
    private name: string;
    private grid: number[][];
    private size: string;
    private authorId?: bigint;
    private createdAt?: Date;
    private updatedAt?: Date;
    private deletedAt?: Date;
    private scores?: Score[];

    constructor(level: RawLevel) {
        // Required fields validation
        if(!level.name) throw new Error("Level name is required");
        if(!level.grid) throw new Error("Level grid is required");

        // Grid validation
        if(level.grid.length === 0) 
            throw new Error("Level grid must have at least one row");

        if(level.grid[0].length === 0) 
            throw new Error("Level grid must have at least one column");

        if(level.grid.some(row => row.length !== level.grid![0].length)) 
            throw new Error("Level grid must have the same number of columns in each row");

        if(level.grid.some(row => row.some(cell => ![0, 1, 2].includes(cell))) )
            throw new Error(`Level grid contains invalid values`);


        // Required fields
        this.name = level.name!;
        this.grid = level.grid!;

        if(!level.size) {
            this.size = `${this.grid.length}x${this.grid[0].length}`;
        } else {
            this.size = level.size;
        }

        // Optional fields
        this.id = level.id;
        this.authorId = level.authorId;
        this.createdAt = level.createdAt;
        this.updatedAt = level.updatedAt;
        this.deletedAt = level.deletedAt;
    }



    /**
     * Set scores for the level
     * @param {Score[]} score List of scores for the level
     */
    public setScores(score: Score[]): void {
        this.scores = score;
    }



    /**
     * Get the properties of the level
     * @returns {RawLevel} The properties of the level
     */
    public getProperties(): FormattedLevel {
        return {
            id: this.id,
            name: this.name,
            grid: this.grid,
            size: this.size,
            authorId: this.authorId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt,
            scores: this.scores?.map(s => s.getProperties())
        }
    }



    /**
     * Save the level to the database
     * @returns {Promise<void>} A promise that resolves when the level is saved
     */
    public async save(): Promise<void> {
        try {
            await prisma.level.create({
                data: {
                    name: this.name,
                    grid: this.grid,
                    size: this.size,
                    authorId: this.authorId
                }
            });
        } catch(e: unknown) {
            HandleError.handle({
                file: "Level",
                fn: "save",
                error: e
            });
        }
    }



    /**
     * Update the level in the database
     * @returns {Promise<void>} A promise that resolves when the level is updated
     */
    public async update(): Promise<void> {
        try {
            if(!this.id) throw new Error("Cannot update a level without an ID");

            await prisma.level.update({
                where: { id: this.id! },
                data: {
                    name: this.name,
                    grid: this.grid,
                    size: this.size,
                    authorId: this.authorId,
                    deletedAt: this.deletedAt
                }
            });
        } catch(e: unknown) {
            HandleError.handle({
                file: "Level",
                fn: "update",
                error: e
            });
        }
    }



    /**
     * Update specified fields of the level in the database
     * @param {Partial<RawLevel>} fields The fields to update
     * @returns {Promise<void>} A promise that resolves when the level is updated
     */
    public async updateFields(fields: Partial<RawLevel>): Promise<void> {
        try {
            if(!this.id) throw new Error("Cannot update a level without an ID");

            await prisma.level.update({
                where: { id: this.id! },
                data: fields
            });
        } catch(e: unknown) {
            HandleError.handle({
                file: "Level",
                fn: "save",
                message: "fields value: " + JSON.stringify(fields),
                error: e
            });
        }
    }



    /**
     * Delete the level from the database a month after it was deleted
     * @returns {Promise<void>} A promise that resolves when the level is deleted
     */
    public async delete(): Promise<void> {
        try {
            if(!this.id) throw new Error("Cannot delete a level without an ID");

            await prisma.level.delete({
                where: { id: this.id! }
            });
        } catch(e: unknown) {
            HandleError.handle({
                file: "Level",
                fn: "delete",
                error: e
            });
        }
    }



    /**
     * Save the score of a user for the level
     * @param {number} userId The ID of the user who completed the level
     * @param {number} time The time it took the user to complete the level 
     */
    public async saveScore(userId: number, time: number): Promise<void> {
        try {
            if(!this.id) throw new Error("Cannot save a score without a level ID");

            await prisma.score.create({
                data: {
                    userId: userId,
                    levelId: this.id!,
                    time: time
                }
            });
        } catch(e: unknown) {
            HandleError.handle({
                file: "Level",
                fn: "saveScore",
                error: e
            });
        }
    }
}