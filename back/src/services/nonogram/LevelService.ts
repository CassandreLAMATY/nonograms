import { level } from "winston";
import { Level } from "../../entities/nonogram";
import { ILevelRepository } from "../../interfaces/repositories/nonogram";
import { ILevelService } from "../../interfaces/services/nonogram";
import { FormattedLevel, RawLevel } from "../../types";

import { HandleError } from "../../utils/HandleError";
import { ILevelUtils } from "../../interfaces/utils/nonogram";

export type Filters = {
    page: number;
    size: string;
    isCompleted: boolean;
};

export class LevelService implements ILevelService {
    private levelRepository: ILevelRepository;
    private levelUtils: ILevelUtils;

    constructor(levelRepository: ILevelRepository, levelUtils: ILevelUtils) {
        this.levelRepository = levelRepository;
        this.levelUtils = levelUtils;
    }



    /**
     * Get levels as FormattedLevel[]
     * @param mode game mode
     * @param filters filters for levels
     * @returns 
     */
    public async getLevels(filters: Filters, userId: string | null): Promise<FormattedLevel[] | null> {
        try {
            const levels: Level[] | null = await this.levelRepository.getLevels(filters, userId);
            if (!levels || levels.length === 0) return null;

            const formattedLevels: FormattedLevel[] = levels.map((level: Level) => level.getProperties());
            return formattedLevels.length > 0 ? formattedLevels : null;
        } catch(e: unknown) {
            HandleError.handle({
                file: "LevelService",
                fn: "getLevels",
                message: `filters value: ${JSON.stringify(filters)}`,
                error: e
            });

            return null;
        }
    }

    
    public async saveLevels(_levels: RawLevel[]): Promise<Level[]> {
        try {
            const levels: Level[] = _levels.map((level: RawLevel) => new Level(level, this.levelUtils));

            await this.levelRepository.saveLevels(levels);

            return levels;
        } catch(e: unknown) {
            HandleError.handle({
                file: "LevelService",
                fn: "saveLevels",
                message: `_levels value: ${JSON.stringify(_levels)}`,
                error: e
            });

            throw e;
        }
    }
}