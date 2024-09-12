import { JsonValue } from "@prisma/client/runtime/library";
import { RawScore } from "./RawScore";

export type DBLevel = {
    id?: number;
    name?: string;
    grid?: JsonValue;
    size?: string;
    difficulty?: number;
    authorId?: bigint;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
    scores?: RawScore[];
}