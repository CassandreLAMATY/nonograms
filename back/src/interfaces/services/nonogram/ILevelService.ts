import { Level } from "../../../entities/nonogram";
import type { Filters } from "../../../services/nonogram/LevelService";
import type { FormattedLevel, RawLevel } from "../../../types";

export interface ILevelService {
    getLevels(filters: Filters, userId: string | null): Promise<FormattedLevel[] | null>,
    saveLevels(_levels: RawLevel[]): Promise<Level[]>
}