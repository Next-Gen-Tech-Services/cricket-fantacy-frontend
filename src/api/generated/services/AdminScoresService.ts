/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminScoresService {
    /**
     * Manually trigger score sync for live matches
     * @returns any Score sync completed successfully
     * @throws ApiError
     */
    public static postApiAdminScoresSync(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/scores/sync',
            errors: {
                401: `Unauthorized`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Manually trigger score sync for a specific match
     * @returns any Match score sync completed successfully
     * @throws ApiError
     */
    public static postApiAdminScoresSync1({
        matchKey,
    }: {
        /**
         * Match key from Rounaz API
         */
        matchKey: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/scores/sync/{matchKey}',
            path: {
                'matchKey': matchKey,
            },
            errors: {
                401: `Unauthorized`,
                404: `Match not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Manually recalculate fantasy points for a specific match
     * @returns any Fantasy points recalculated successfully
     * @throws ApiError
     */
    public static postApiAdminScoresFantasy({
        matchId,
    }: {
        /**
         * Match ID from database
         */
        matchId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/scores/fantasy/{matchId}',
            path: {
                'matchId': matchId,
            },
            errors: {
                401: `Unauthorized`,
                404: `Match not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Get current status of score sync system
     * @returns any Score sync status retrieved successfully
     * @throws ApiError
     */
    public static getApiAdminScoresStatus(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/scores/status',
            errors: {
                401: `Unauthorized`,
                500: `Internal server error`,
            },
        });
    }
}
