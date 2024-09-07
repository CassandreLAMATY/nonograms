export interface INonogram_User {
    getScoresByLevelId(levelId: number): Promise<any>;
}