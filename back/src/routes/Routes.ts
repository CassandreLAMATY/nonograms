import { Router } from "express";

export default abstract class Routes {
  public router: Router;

  constructor() {
    this.router = Router();
  }

  protected abstract initializeRoutes(): void;
}