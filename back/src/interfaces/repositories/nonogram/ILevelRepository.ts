import { Level } from "../../../entities/nonogram";
import type { Filters } from "../../../repositories/nonogram/LevelRepository";

export interface ILevelRepository {
    getLevels(filters: Filters, userId: bigint | null): Promise<Level[]>
}