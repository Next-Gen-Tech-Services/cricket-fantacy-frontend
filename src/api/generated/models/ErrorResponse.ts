/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ErrorResponse = {
    success?: boolean;
    /**
     * Error message
     */
    message?: string;
    /**
     * Request ID for tracking
     */
    requestId?: string;
    /**
     * Validation errors (if any)
     */
    errors?: Array<Record<string, any>>;
};

