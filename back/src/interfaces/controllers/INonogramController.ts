import { Response } from "express";

export interface INonogramController {
    saveLevels(res: Response, _levels: any, _userId: any): Promise<Response>;
}