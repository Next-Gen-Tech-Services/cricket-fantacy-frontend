/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Match } from '../models/Match';
import type { Tournament } from '../models/Tournament';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TournamentsService {
    /**
     * Get all active tournaments
     * @returns any List of tournaments retrieved successfully
     * @throws ApiError
     */
    public static getApiTournaments({
        status = 'ongoing',
    }: {
        /**
         * Filter tournaments by status
         */
        status?: 'upcoming' | 'ongoing' | 'completed',
    }): CancelablePromise<{
        success?: boolean;
        data?: Array<Tournament>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tournaments',
            query: {
                'status': status,
            },
            errors: {
                500: `Internal server error`,
            },
        });
    }
    /**
     * Get single tournament with matches
     * @returns any Tournament details retrieved successfully
     * @throws ApiError
     */
    public static getApiTournaments1({
        id,
    }: {
        /**
         * Tournament ID
         */
        id: string,
    }): CancelablePromise<{
        success?: boolean;
        data?: {
            tournament?: Tournament;
            matches?: Array<Match>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/tournaments/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Tournament not found`,
                500: `Internal server error`,
            },
        });
    }
}
