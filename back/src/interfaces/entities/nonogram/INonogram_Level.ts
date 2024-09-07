import type { RawLevel } from "../../../types";

export interface INonogram_Level {
    getProperties(): RawLevel;
    save(): Promise<void>;
    update(): Promise<void>;
    updateFields(fields: Partial<RawLevel>): Promise<void>;
    delete(): Promise<void>;
    saveScore(userId: number, time: number): Promise<void>;
}