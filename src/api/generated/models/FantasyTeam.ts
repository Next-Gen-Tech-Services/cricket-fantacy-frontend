/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type FantasyTeam = {
    /**
     * Auto-generated unique identifier
     */
    _id?: string;
    /**
     * Name of the fantasy team
     */
    name: string;
    /**
     * Reference to User who owns the team
     */
    user: string;
    /**
     * Reference to Tournament
     */
    tournament: string;
    /**
     * Reference to Match
     */
    match: string;
    players?: Array<{
        player?: string;
        role?: 'PLAYER' | 'CAPTAIN' | 'VICE_CAPTAIN';
        credits?: number;
        fantasyPoints?: number;
    }>;
    totalCreditsUsed?: number;
    totalFantasyPoints?: number;
    status?: 'DRAFT' | 'SUBMITTED' | 'LOCKED' | 'LIVE' | 'COMPLETED';
    isValid?: boolean;
};

