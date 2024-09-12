import type { RawScore } from "../../../types";

export interface IScore {
    getProperties(): RawScore;
    save(): Promise<void>;
}