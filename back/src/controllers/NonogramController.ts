import { Level } from "../entities/nonogram";
import { INonogramController } from "../interfaces/controllers";
import { ILevelService } from "../interfaces/services/nonogram";
import { ILevelUtils } from "../interfaces/utils/nonogram";
import { Filters } from "../repositories/nonogram/LevelRepository";
import { RawLevel } from "../types";
import { HandleError } from "../utils/HandleError";
import { Response } from "express";

export class NonogramController implements INonogramController {
    private levelService: ILevelService;
    private levelUtils: ILevelUtils;

    constructor(levelService: ILevelService, levelUtils: ILevelUtils) {
        this.levelService = levelService;
        this.levelUtils = levelUtils;
    }

    /* public async getLevels(_filters: any, _userId: any): Promise<any> {
        const filters: { [key: string]: any } = {};

        // Check if filters are valid
        for(const key in _filters) {
            // If page and page is a number, add to filter
            if(key === "page" && !isNaN(_filters[key])) {
                _filters[key] = filters[key];
            }

            // If size, size is a string and is in the format "numberxnumber", add to filter
            if(key === "size" && typeof filters[key] === "string" && filters[key].match(/^\d+x\d+$/)) {
                _filters[key] = filters[key];
            }

            // If userId and userId is a string, add to filter
            if(_userId && typeof filters[key] === "string") {
                if(key === "isCompleted" && typeof filters[key] === "boolean") {
                    _filters[key] = filters[key];
                }
            }
        }

        // Check if userId is valid
        let userId: string | null = null;

        if(_userId && typeof _userId === "string" && _userId.length > 0) {
            userId = _userId;
        }

        return await this.levelService.getLevels(filters as Filters, userId as string || null);
    } */



    public async saveLevels(res: Response, _levels: any, _userId: any): Promise<Response> {
        try {
            // Check if userId is valid
            if(!_userId || typeof _userId !== "string" || _userId.length === 0 || _userId.length > 18) {
                return res.status(400).json({
                    message: "Invalid userId",
                    data: { userId: _userId }
                });
            }

            const levels: RawLevel[] = [];
            let savedLevels: Level[] = [];

            // Check if levels are valid
            for(const l of _levels) {
                if(!l.name || !l.grid) 
                    throw new Error(`Invalid level: missing properties (${JSON.stringify(l)})`);

                if(typeof l.name !== "string" || l.name.length === 0 || l.name.length > 32) 
                    throw new Error(`Invalid level: invalid name, should be a string between 1 and 32 chars (${JSON.stringify(l)})`);

                if(!this.levelUtils.isValidGrid(l.grid)) 
                    throw new Error(`Invalid grid (${JSON.stringify(l.grid)})`);

                if(l.size && !l.size.match(/^\d+x\d+$/)) 
                    throw new Error(`Invalid size, should be a string matching number x number (${JSON.stringify(l.size)})`);

                try {
                    levels.push({
                        name: l.name,
                        grid: l.grid,
                        size: l.size ? l.size : `${l.grid.length}x${l.grid[0].length}`,
                        authorId: _userId
                    });
                } catch(e: unknown) {
                    throw new Error(`Couldn't process level (${JSON.stringify(l)})`);
                }
            }

            if(levels.length === 0) {
                return res.status(400).json({
                    message: "No valid levels to save...",
                    data: { 
                        levels: _levels 
                    }
                });
            }

            // Saving levels
            try {
                await this.levelService.saveLevels(levels)
                    .then(r => {
                        if(r) savedLevels = r;
                    });
            } catch(e: unknown) {
                throw new Error(`Failed to save levels: ${(e as Error).message}`);
            }

            if(savedLevels.length === 0) {
                return res.status(400).json({
                    message: "Couldn't save or retrieve saved levels...",
                    data: { 
                        levels: levels 
                    }
                });
            }

            return res.status(201).json({ 
                message: "Levels successfully saved !", 
                data: {
                    givenLevels: levels,
                    savedLevels: savedLevels.map(l => l.getProperties()),
                    userId: _userId
                } 
            });

        } catch(e: unknown) {
            HandleError.handle({
                file: "NonogramController",
                fn: "saveLevels",
                message: `_levels value: ${JSON.stringify(_levels)}`,
                error: e
            });

            return res.status(500).json({ 
                message: "Couldn't save levels",
                data: { 
                    levels: _levels,
                    userId: _userId
                },
                error: e
            });
        }
    }
}