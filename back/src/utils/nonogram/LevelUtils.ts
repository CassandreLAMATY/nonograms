import { JsonValue } from "@prisma/client/runtime/library";
import { Cell } from "../../types/nonogram";

export class LevelUtils {
    /**
     * Check if a cell is valid
     * @param {any} cell
     * @returns 
     */
    public isValidCell(cell: any): cell is Cell {
        if (typeof cell !== "object" || cell === null) return false;
        if (!("status" in cell) || typeof cell.status !== "number" || ![0, 1, 2].includes(cell.status)) return false;
        if ("color" in cell && typeof cell.color !== "string") return false;
        if (Object.keys(cell).length > 2) return false;

        return true;
    }



    /**
     * Check if a grid is valid
     * @param {JsonValue} grid 
     * @returns a boolean indicating if the grid is valid
     */
    public isValidGrid(grid: JsonValue): grid is Cell[][] {
        if(!Array.isArray(grid)) return false;

        for(const row of grid) {
            if(!Array.isArray(row)) return false;

            for(const cell of row) {
                if(!this.isValidCell(cell)) return false;
            }
        }

        return true;
    }
}