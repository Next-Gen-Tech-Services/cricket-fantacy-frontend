/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Player = {
    /**
     * Auto-generated unique identifier
     */
    _id?: string;
    /**
     * Full name of the player
     */
    name: string;
    /**
     * Short/display name
     */
    shortName: string;
    /**
     * Player's primary role
     */
    role: 'BATSMAN' | 'BOWLER' | 'ALL_ROUNDER' | 'WICKET_KEEPER';
    /**
     * Reference to RealTeam
     */
    team?: string;
    /**
     * Fantasy credits value
     */
    credits?: number;
    /**
     * External API player ID
     */
    playerId?: string;
    dateOfBirth?: string;
    nationality?: string;
    battingStyle?: 'RIGHT_HANDED' | 'LEFT_HANDED' | 'SWITCH_HITTER';
    bowlingStyle?: 'RIGHT_ARM_FAST' | 'LEFT_ARM_FAST' | 'RIGHT_ARM_MEDIUM' | 'LEFT_ARM_MEDIUM' | 'RIGHT_ARM_SPIN' | 'LEFT_ARM_SPIN' | 'RIGHT_ARM_WRIST_SPIN' | 'LEFT_ARM_WRIST_SPIN';
    status?: 'ACTIVE' | 'INJURED' | 'SUSPENDED' | 'RETIRED';
    avatar?: string;
    description?: string;
    stats?: {
        matchesPlayed?: number;
        runs?: number;
        wickets?: number;
        catches?: number;
        stumpings?: number;
        fantasyPoints?: number;
        averageFantasyPoints?: number;
    };
    createdAt?: string;
    updatedAt?: string;
};

