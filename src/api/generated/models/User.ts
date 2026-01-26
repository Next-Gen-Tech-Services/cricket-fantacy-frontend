/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type User = {
    /**
     * Auto-generated MongoDB ObjectId
     */
    _id?: string;
    /**
     * User full name
     */
    name: string;
    /**
     * User email address
     */
    email: string;
    /**
     * User password (min 6 characters)
     */
    password: string;
    /**
     * User phone number
     */
    phone?: string;
    /**
     * User role
     */
    role?: 'user' | 'admin';
    /**
     * User account status
     */
    isActive?: boolean;
    /**
     * Account creation date
     */
    createdAt?: string;
    /**
     * Last account update date
     */
    updatedAt?: string;
};

