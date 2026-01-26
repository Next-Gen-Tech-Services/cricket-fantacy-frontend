/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Tournament = {
    /**
     * Auto-generated MongoDB ObjectId
     */
    id?: string;
    /**
     * Unique tournament key
     */
    key: string;
    /**
     * Tournament name
     */
    name: string;
    /**
     * Tournament short name
     */
    shortName?: string | null;
    /**
     * Alternate tournament name
     */
    alternateName?: string | null;
    /**
     * Alternate short name
     */
    alternateShortName?: string | null;
    /**
     * Tournament description
     */
    description?: string;
    /**
     * Tournament status
     */
    status?: 'upcoming' | 'ongoing' | 'completed';
    /**
     * Tournament image URL
     */
    imageUrl?: string;
    /**
     * Total matches in tournament
     */
    totalMatches?: number;
    /**
     * External API reference ID
     */
    rounakApiId?: string;
    /**
     * Tournament active status
     */
    isActive?: boolean;
    /**
     * Tournament creation date
     */
    createdAt?: string;
    /**
     * Last tournament update date
     */
    updatedAt?: string;
};

