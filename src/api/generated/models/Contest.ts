/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Contest = {
    name: string;
    code?: string;
    /**
     * Match ID
     */
    match: string;
    /**
     * Tournament ID
     */
    tournament: string;
    type?: 'HEAD_TO_HEAD' | 'LEAGUE' | 'MEGA_CONTEST' | 'PRIVATE' | 'PRACTICE';
    maxParticipants: number;
    currentParticipants?: number;
    entryFee: number;
    maxTeamsPerUser?: number;
    prizePool: {
        totalAmount?: number;
        isGuaranteed?: boolean;
        distribution?: Array<{
            rank?: {
                from?: number;
                to?: number;
            };
            amount?: number;
            percentage?: number;
        }>;
    };
    status?: 'UPCOMING' | 'OPEN' | 'FILLING' | 'FULL' | 'LIVE' | 'COMPLETED' | 'CANCELLED';
    timing: {
        opensAt?: string;
        closesAt?: string;
        joinDeadline?: string;
    };
};

