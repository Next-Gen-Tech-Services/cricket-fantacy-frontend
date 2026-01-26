/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type League = {
    name: string;
    description?: string;
    type?: 'PRIVATE' | 'PUBLIC' | 'INVITE_ONLY';
    category?: 'FRIENDS' | 'OFFICE' | 'FAMILY' | 'COMMUNITY' | 'COMPETITIVE';
    maxMembers?: number;
    rules?: {
        entryFee?: number;
        maxTeamsPerUser?: number;
        scoringSystem?: 'STANDARD' | 'POINTS_MULTIPLIER' | 'CUSTOM';
        autoJoinContests?: boolean;
    };
    settings?: {
        isPublic?: boolean;
        requireApproval?: boolean;
        allowInvites?: boolean;
        chatEnabled?: boolean;
    };
};

