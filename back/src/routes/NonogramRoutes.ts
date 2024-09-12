import { Routes } from "./";
import { Request, Response } from "express";

export class NonogramRoutes extends Routes {
    constructor() {
        super();

        this.initializeRoutes();
    }

    protected initializeRoutes(): void {
        // Get all levels with pagination and filters
        // If body contains a user id, return the user's progress
        // /:mode/levels/?page=1?difficulty=easy?size=5x5
        this.router.post(
            '/:mode/levels',
            (req: Request, res: Response) => {
            }
        );

        // Get level by id
        // If body contains a user id, return the user's progress
        this.router.post(
            '/levels/:id',
            (req: Request, res: Response) => {
            }
        );

        // Save a new level
        // Body must contain level data
        this.router.post(
            '/levels/save',
            (req: Request, res: Response) => {
            }
        );

        // Update a level
        // Body must contain level data
        this.router.post(
            '/levels/update',
            (req: Request, res: Response) => {
            }
        );

        // Delete a level
        // Body must contain delete date and level id, server will delete it in db after 20 days
        this.router.post(
            '/levels/delete',
            (req: Request, res: Response) => {
            }
        );

        // Save user's progress
        // Body must contain user id, level id, and time
        this.router.post(
            '/progress/save',
            (req: Request, res: Response) => {
            }
        );

        // Update user's progress
        // Body must contain user id, level id, and time
        this.router.post(
            '/progress/update',
            (req: Request, res: Response) => {
            }
        );
    }
}