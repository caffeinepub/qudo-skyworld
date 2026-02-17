import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface QudoReward {
    description: string;
    timestamp: Time;
    amount: bigint;
}
export interface PersistentStar {
    x: number;
    y: number;
    brightness: number;
}
export interface PastelSkyProfile {
    lastActiveTime: Time;
    rewards: Array<QudoReward>;
    world: SkyWorldState;
    visits: Array<FriendVisit>;
}
export interface SkyWorldState {
    theme: string;
    lastVisitedTime?: Time;
    persistentStars: Array<PersistentStar>;
    totalFlowersCollected: bigint;
    highScore: bigint;
    totalSparklesCollected: bigint;
    activeSessions: bigint;
    friends: Array<Principal>;
    lastQudoBoostTime: Time;
    decorations: Array<string>;
}
export interface UserProfile {
    pastelSkyProfile?: PastelSkyProfile;
    name: string;
}
export interface FriendVisit {
    message: string;
    visitor: Principal;
    timestamp: Time;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addFriend(friend: Principal): Promise<void>;
    adminGetUserProfile(user: Principal): Promise<PastelSkyProfile | null>;
    adminRemoveReward(user: Principal, rewardIndex: bigint): Promise<void>;
    adminResetUserWorld(user: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFriendSkyWorld(friend: Principal): Promise<SkyWorldState | null>;
    getHighScores(): Promise<Array<PastelSkyProfile>>;
    getMyVisits(): Promise<Array<FriendVisit>>;
    getRewards(): Promise<Array<QudoReward>>;
    getSkyWorld(): Promise<PastelSkyProfile | null>;
    getStarsByBrightness(): Promise<Array<PersistentStar>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeSkyWorld(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isRegistered(): Promise<boolean>;
    recordReward(reward: QudoReward): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateSkyWorld(world: SkyWorldState): Promise<void>;
    visitFriend(friend: Principal, message: string): Promise<void>;
}
