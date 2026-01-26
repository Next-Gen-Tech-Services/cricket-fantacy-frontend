/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AuthResponse = {
    success?: boolean;
    data?: {
        _id?: string;
        name?: string;
        email?: string;
        role?: string;
        /**
         * JWT token for authentication
         */
        token?: string;
    };
};

