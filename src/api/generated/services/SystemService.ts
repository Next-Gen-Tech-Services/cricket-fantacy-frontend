/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SystemService {
    /**
     * Health check endpoint
     * @returns any Server health status
     * @throws ApiError
     */
    public static getApiHealth(): CancelablePromise<{
        success?: boolean;
        status?: string;
        message?: string;
        timestamp?: string;
        /**
         * Server uptime in seconds
         */
        uptime?: number;
        environment?: string;
        version?: string;
        /**
         * System health details (development only)
         */
        system?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/health',
        });
    }
    /**
     * API information endpoint
     * @returns any API information and available endpoints
     * @throws ApiError
     */
    public static getApi(): CancelablePromise<{
        success?: boolean;
        message?: string;
        version?: string;
        documentation?: string;
        endpoints?: {
            auth?: string;
            admin?: string;
            tournaments?: string;
            matches?: string;
            teams?: string;
            health?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api',
        });
    }
}
