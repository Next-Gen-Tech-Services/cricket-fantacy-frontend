/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Tournament } from '../models/Tournament';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminTournamentsService {
    /**
     * Get all tournaments (Admin)
     * @returns any List of tournaments
     * @throws ApiError
     */
    public static getApiAdminTournaments({
        status,
        search,
        page = 1,
        limit = 10,
    }: {
        status?: 'upcoming' | 'live' | 'completed',
        search?: string,
        page?: number,
        limit?: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/tournaments',
            query: {
                'status': status,
                'search': search,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * Create tournament (Admin)
     * @returns any Tournament created
     * @throws ApiError
     */
    public static postApiAdminTournaments({
        requestBody,
    }: {
        requestBody: Tournament,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/tournaments',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get single tournament (Admin)
     * @returns any Tournament details
     * @throws ApiError
     */
    public static getApiAdminTournaments1({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/tournaments/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Tournament not found`,
            },
        });
    }
    /**
     * Update tournament (Admin)
     * @returns any Tournament updated
     * @throws ApiError
     */
    public static putApiAdminTournaments({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: Tournament,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/admin/tournaments/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Tournament not found`,
            },
        });
    }
    /**
     * Delete tournament (Admin)
     * @returns any Tournament deleted
     * @throws ApiError
     */
    public static deleteApiAdminTournaments({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/admin/tournaments/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Tournament not found`,
            },
        });
    }
}
