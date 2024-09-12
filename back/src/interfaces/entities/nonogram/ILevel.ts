import type { RawLevel, FormattedLevel } from "../../../types";

export interface ILevel {
    getProperties(): FormattedLevel;
    save(): Promise<void>;
    update(): Promise<void>;
    updateFields(fields: Partial<RawLevel>): Promise<void>;
    delete(): Promise<void>;
    saveScore(userId: number, time: number): Promise<void>;
}