import { RawScore } from "./";
import { Cell } from "./nonogram";

export type FormattedLevel = {
    id?: number;
    name?: string;
    grid?: Cell[][];
    size?: string;
    difficulty?: number;
    authorId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    scores?: RawScore[];
}