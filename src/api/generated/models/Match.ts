/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Match = {
    /**
     * Auto-generated MongoDB ObjectId
     */
    id?: string;
    /**
     * Unique match key
     */
    key: string;
    /**
     * Sport type
     */
    sport?: string;
    /**
     * Match format
     */
    format: 'T20' | 'ODI' | 'Test' | 'T10' | 'The Hundred';
    /**
     * Match gender category
     */
    gender?: 'men' | 'women' | 'mixed';
    /**
     * Tournament key reference
     */
    tournamentKey?: string | null;
    /**
     * Match name
     */
    name: string;
    /**
     * Match short name
     */
    shortName: string;
    /**
     * Match subtitle
     */
    subTitle?: string | null;
    /**
     * Match status
     */
    status?: 'scheduled' | 'live' | 'completed' | 'cancelled' | 'postponed';
    /**
     * Metric group identifier
     */
    metricGroup: string;
    /**
     * Winning team key
     */
    winner?: string | null;
    /**
     * Match start timestamp (Unix)
     */
    startedAt: number;
    /**
     * Match end timestamp (Unix)
     */
    endedAt?: number | null;
    /**
     * Expected start timestamp (Unix)
     */
    expectedStartedAt?: number | null;
    /**
     * Expected end timestamp (Unix)
     */
    expectedEndedAt: number;
    /**
     * Teams participating in the match
     */
    teams: {
        'a'?: {
            key?: string;
            name?: string;
            shortName?: string;
            logo?: string;
        };
        'b'?: {
            key?: string;
            name?: string;
            shortName?: string;
            logo?: string;
        };
    };
    /**
     * Whether to show match on frontend
     */
    showOnFrontend?: boolean;
    /**
     * Whether contest has been generated for this match
     */
    contestGenerated?: boolean;
    /**
     * Starting soon notification status
     */
    startingSoonNotificationSent?: boolean;
    /**
     * Match started notification status
     */
    matchStartedNotificationSent?: boolean;
    /**
     * Match venue
     */
    venue?: string;
    /**
     * External API match ID
     */
    rounakApiMatchId?: string;
    /**
     * Total fantasy teams created
     */
    totalTeamsCreated?: number;
    /**
     * Match active status
     */
    isActive?: boolean;
    /**
     * Match creation date
     */
    createdAt?: string;
    /**
     * Last match update date
     */
    updatedAt?: string;
};

