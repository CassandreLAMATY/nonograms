import { Level } from "../../entities/nonogram";
import { ILevelRepository } from "../../interfaces/repositories/nonogram";
import { ILevelService } from "../../interfaces/services/nonogram";
import { FormattedLevel } from "../../types";

import { HandleError } from "../../utils/HandleError";

export type Filters = {
    page: number;
    size: string;
    isCompleted: boolean;
};

export class LevelService implements ILevelService {
    private levelrepository: ILevelRepository;

    constructor(levelRepository: ILevelRepository) {
        this.levelrepository = levelRepository;
    }



    /**
     * Get levels as FormattedLevel[]
     * @param mode game mode
     * @param filters filters for levels
     * @returns 
     */
    public async getLevels(filters: Filters, userId: bigint | null): Promise<FormattedLevel[]> {
        try {
            const levels: Level[] = await this.levelrepository.getLevels(filters, userId);

            const formattedLevels: FormattedLevel[] = levels.map((level: Level) => {
                return level.getProperties();
            });

            return formattedLevels;

        } catch(e: unknown) {
            HandleError.handle({
                file: "LevelService",
                fn: "getLevels",
                message: `filters value: ${JSON.stringify(filters)}`,
                error: e
            });

            return [];
        }
    }
}