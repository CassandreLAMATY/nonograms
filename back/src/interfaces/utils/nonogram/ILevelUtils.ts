import { JsonValue } from "@prisma/client/runtime/library";
import { Cell } from "../../../types/nonogram";

export interface ILevelUtils {
    isValidCell(cell: any): cell is Cell;
    isValidGrid(grid: JsonValue): grid is Cell[][];
}