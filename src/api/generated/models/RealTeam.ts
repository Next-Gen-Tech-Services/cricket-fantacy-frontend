/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RealTeam = {
    /**
     * Auto-generated unique identifier
     */
    _id?: string;
    /**
     * Full name of the team
     */
    name: string;
    /**
     * Short name (max 5 characters)
     */
    shortName: string;
    /**
     * Team code (max 5 characters)
     */
    code: string;
    /**
     * Country of the team
     */
    country: string;
    type?: 'NATIONAL' | 'FRANCHISE' | 'CLUB' | 'STATE';
    logo?: string;
    colors?: {
        primary?: string;
        secondary?: string;
    };
    status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
};

