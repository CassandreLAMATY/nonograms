import { Cell } from "./nonogram";

export type RawLevel = {
    id?: number;
    name?: string;
    grid?: Cell[][];
    size?: string;
    difficulty?: number;
    authorId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}