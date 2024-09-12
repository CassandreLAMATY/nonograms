import { ILevelService } from "../interfaces/services/nonogram";
import { Filters } from "../repositories/nonogram/LevelRepository";

export class NonogramController {
    private levelService: ILevelService;

    constructor(levelService: ILevelService) {
        this.levelService = levelService;
    }

    public async getLevels(_filters: any, _userId: any): Promise<any> {
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

            // If userId and userId is a bigint, add to filter
            if(_userId && typeof filters[key] === "bigint") {
                if(key === "isCompleted" && typeof filters[key] === "boolean") {
                    _filters[key] = filters[key];
                }
            }
        }

        // Check if userId is valid
        let userId: bigint | null = null;

        if(_userId && !isNaN(_userId) && typeof _userId === "bigint") {
            userId = _userId;
        }

        return await this.levelService.getLevels(filters as Filters, userId as bigint || null);
    }
}