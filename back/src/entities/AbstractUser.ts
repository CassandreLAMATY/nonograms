import type { RawUser } from "../types";

export abstract class AbstractUser {
    protected id: bigint;
    protected username: string;
    protected avatar?: string;
    protected createdAt?: Date;
    protected updatedAt?: Date;
    protected deletedAt?: Date;

    constructor(user: RawUser) {
        // Required fields validation
        if(!user.id) throw new Error("User id is required");
        if(!user.username) throw new Error("User username is required");

        // Required fields
        this.id = user.id;
        this.username = user.username;

        // Optional fields
        this.avatar = user.avatar;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
        this.deletedAt = user.deletedAt;
    }
}