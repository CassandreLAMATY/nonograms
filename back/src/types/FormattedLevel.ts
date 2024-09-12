import { RawScore } from "./";

export type FormattedLevel = {
    id?: number;
    name?: string;
    grid?: number[][];
    size?: string;
    difficulty?: number;
    authorId?: bigint;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    scores?: RawScore[];
}