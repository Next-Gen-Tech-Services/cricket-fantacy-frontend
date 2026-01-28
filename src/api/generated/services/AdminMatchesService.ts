/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Match } from '../models/Match';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminMatchesService {
    /**
     * Get all matches (Admin)
     * @returns any List of matches
     * @throws ApiError
     */
    public static getApiAdminMatches({
        tournament,
        status,
        page = 1,
        limit = 10,
    }: {
        tournament?: string,
        status?: 'upcoming' | 'live' | 'completed' | 'cancelled',
        page?: number,
        limit?: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/matches',
            query: {
                'tournament': tournament,
                'status': status,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * Create match (Admin)
     * @returns any Match created
     * @throws ApiError
     */
    public static postApiAdminMatches({
        requestBody,
    }: {
        requestBody: Match,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/matches',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get single match (Admin)
     * @returns any Match details
     * @throws ApiError
     */
    public static getApiAdminMatches1({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/matches/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Match not found`,
            },
        });
    }
    /**
     * Update match (Admin)
     * @returns any Match updated
     * @throws ApiError
     */
    public static putApiAdminMatches({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: Match,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/admin/matches/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Match not found`,
            },
        });
    }
    /**
     * Partially update match (Admin)
     * @returns any Match updated successfully
     * @throws ApiError
     */
    public static patchApiAdminMatches({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: {
            showOnFrontend?: boolean;
            status?: string;
            isLive?: boolean;
        },
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/admin/matches/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Match not found`,
            },
        });
    }
    /**
     * Delete match (Admin)
     * @returns any Match deleted
     * @throws ApiError
     */
    public static deleteApiAdminMatches({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/admin/matches/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Match not found`,
            },
        });
    }
    /**
     * Create real teams from match players
     * @returns any Real teams created successfully
     * @throws ApiError
     */
    public static postApiAdminMatchesCreateRealTeams({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/matches/{id}/create-real-teams',
            path: {
                'id': id,
            },
            errors: {
                404: `Match not found`,
            },
        });
    }
}
