export interface IUser {
    getScoresByLevelId(levelId: number): Promise<any>;
}