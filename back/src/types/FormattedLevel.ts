import { JsonValue } from "@prisma/client/runtime/library";
import { RawScore } from "./";
import { Cell } from "./nonogram";

export type FormattedLevel = {
    id?: number;
    name?: string;
    grid?: JsonValue;
    size?: string;
    difficulty?: number;
    authorId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    scores?: RawScore[];
}