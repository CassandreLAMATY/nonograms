import type { Filters } from "../../../services/nonogram/LevelService";
import type { FormattedLevel } from "../../../types";

export interface ILevelService {
    getLevels(filters: Filters, userId: bigint | null): Promise<FormattedLevel[]>,
}