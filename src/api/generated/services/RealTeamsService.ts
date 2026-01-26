/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RealTeamsService {
    /**
     * Get all real teams with filters and pagination
     * @returns any Teams fetched successfully
     * @throws ApiError
     */
    public static getApiRealTeams({
        page,
        limit,
        country,
        type,
        status,
        search,
    }: {
        page?: number,
        limit?: number,
        country?: string,
        type?: 'NATIONAL' | 'FRANCHISE' | 'CLUB' | 'STATE',
        status?: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
        search?: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/real-teams',
            query: {
                'page': page,
                'limit': limit,
                'country': country,
                'type': type,
                'status': status,
                'search': search,
            },
        });
    }
    /**
     * Create a new real team
     * @returns any Team created successfully
     * @throws ApiError
     */
    public static postApiRealTeams({
        requestBody,
    }: {
        requestBody: Record<string, any>,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/real-teams',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error or team already exists`,
            },
        });
    }
    /**
     * Get all active teams
     * @returns any Active teams fetched successfully
     * @throws ApiError
     */
    public static getApiRealTeamsActive(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/real-teams/active',
        });
    }
    /**
     * Search teams by name, short name, or code
     * @returns any Search completed successfully
     * @throws ApiError
     */
    public static getApiRealTeamsSearch({
        q,
    }: {
        q: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/real-teams/search',
            query: {
                'q': q,
            },
        });
    }
    /**
     * Get teams by country
     * @returns any Teams fetched successfully
     * @throws ApiError
     */
    public static getApiRealTeamsCountry({
        country,
    }: {
        country: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/real-teams/country/{country}',
            path: {
                'country': country,
            },
        });
    }
    /**
     * Get teams participating in a tournament
     * @returns any Tournament teams fetched successfully
     * @throws ApiError
     */
    public static getApiRealTeamsTournament({
        tournamentId,
    }: {
        tournamentId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/real-teams/tournament/{tournamentId}',
            path: {
                'tournamentId': tournamentId,
            },
        });
    }
    /**
     * Get single team by ID
     * @returns any Team fetched successfully
     * @throws ApiError
     */
    public static getApiRealTeams1({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/real-teams/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Team not found`,
            },
        });
    }
    /**
     * Update a real team
     * @returns any Team updated successfully
     * @throws ApiError
     */
    public static putApiRealTeams({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/real-teams/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Delete a real team (soft delete)
     * @returns any Team deleted successfully
     * @throws ApiError
     */
    public static deleteApiRealTeams({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/real-teams/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get team with all its players
     * @returns any Team with players fetched successfully
     * @throws ApiError
     */
    public static getApiRealTeamsPlayers({
        id,
    }: {
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/real-teams/{id}/players',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Add match result for a team
     * @returns any Match result added successfully
     * @throws ApiError
     */
    public static postApiRealTeamsMatchResult({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: Record<string, any>,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/real-teams/{id}/match-result',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
