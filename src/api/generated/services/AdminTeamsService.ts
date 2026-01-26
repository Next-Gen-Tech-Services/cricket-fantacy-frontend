/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminTeamsService {
    /**
     * Get all teams (Admin)
     * @returns any List of teams
     * @throws ApiError
     */
    public static getApiAdminTeams({
        match,
        user,
        tournament,
        page = 1,
        limit = 10,
    }: {
        match?: string,
        user?: string,
        tournament?: string,
        page?: number,
        limit?: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/teams',
            query: {
                'match': match,
                'user': user,
                'tournament': tournament,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * Get single team (Admin)
     * @returns any Team details
     * @throws ApiError
     */
    public static getApiAdminTeams1({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/teams/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Team not found`,
            },
        });
    }
    /**
     * Delete team (Admin)
     * @returns any Team deleted
     * @throws ApiError
     */
    public static deleteApiAdminTeams({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/admin/teams/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Team not found`,
            },
        });
    }
    /**
     * Update team points (Admin)
     * @returns any Team points updated
     * @throws ApiError
     */
    public static putApiAdminTeamsPoints({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: {
            totalPoints?: number;
        },
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/admin/teams/{id}/points',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Team not found`,
            },
        });
    }
}
