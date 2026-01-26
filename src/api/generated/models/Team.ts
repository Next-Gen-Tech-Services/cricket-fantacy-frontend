/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Team = {
    /**
     * Auto-generated MongoDB ObjectId
     */
    _id?: string;
    /**
     * Team name
     */
    name: string;
    /**
     * Team code
     */
    code: string;
    /**
     * Country name
     */
    country?: string;
    /**
     * Team logo URL
     */
    logo?: string;
    players?: Array<{
        /**
         * Player name
         */
        name?: string;
        /**
         * Player role
         */
        role?: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper';
    }>;
};

