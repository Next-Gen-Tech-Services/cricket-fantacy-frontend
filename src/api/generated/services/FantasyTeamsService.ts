/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FantasyTeam } from '../models/FantasyTeam';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FantasyTeamsService {
    /**
     * Get user's fantasy teams
     * @returns any Fantasy teams fetched successfully
     * @throws ApiError
     */
    public static getApiFantasyTeams({
        tournament,
        match,
        status,
        page,
        limit,
    }: {
        /**
         * Filter by tournament ID
         */
        tournament?: string,
        /**
         * Filter by match ID
         */
        match?: string,
        status?: 'DRAFT' | 'SUBMITTED' | 'LOCKED' | 'LIVE' | 'COMPLETED',
        page?: number,
        limit?: number,
    }): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            teams?: Array<FantasyTeam>;
            pagination?: Record<string, any>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/fantasy-teams',
            query: {
                'tournament': tournament,
                'match': match,
                'status': status,
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * Create a new fantasy team
     * @returns any Fantasy team created successfully
     * @throws ApiError
     */
    public static postApiFantasyTeams({
        requestBody,
    }: {
        requestBody: {
            name: string;
            tournament: string;
            match: string;
            players?: Array<{
                player?: string;
                role?: 'PLAYER' | 'CAPTAIN' | 'VICE_CAPTAIN';
            }>;
        },
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/fantasy-teams',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error or team creation deadline passed`,
                404: `Tournament or match not found`,
            },
        });
    }
    /**
     * Get single fantasy team by ID
     * @returns any Fantasy team fetched successfully
     * @throws ApiError
     */
    public static getApiFantasyTeams1({
        id,
    }: {
        /**
         * Fantasy Team ID
         */
        id: string,
    }): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: FantasyTeam;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/fantasy-teams/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Access denied`,
                404: `Fantasy team not found`,
            },
        });
    }
    /**
     * Update a fantasy team
     * @returns any Fantasy team updated successfully
     * @throws ApiError
     */
    public static putApiFantasyTeams({
        id,
        requestBody,
    }: {
        /**
         * Fantasy Team ID
         */
        id: string,
        requestBody: {
            name?: string;
            players?: Array<{
                player?: string;
                role?: string;
            }>;
        },
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/fantasy-teams/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Team cannot be edited or validation error`,
                403: `Access denied`,
                404: `Fantasy team not found`,
            },
        });
    }
    /**
     * Delete a fantasy team
     * @returns any Fantasy team deleted successfully
     * @throws ApiError
     */
    public static deleteApiFantasyTeams({
        id,
    }: {
        /**
         * Fantasy Team ID
         */
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/fantasy-teams/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Team cannot be deleted in current status`,
                403: `Access denied`,
                404: `Fantasy team not found`,
            },
        });
    }
    /**
     * Submit a fantasy team
     * @returns any Fantasy team submitted successfully
     * @throws ApiError
     */
    public static postApiFantasyTeamsSubmit({
        id,
    }: {
        /**
         * Fantasy Team ID
         */
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/fantasy-teams/{id}/submit',
            path: {
                'id': id,
            },
            errors: {
                400: `Team validation failed`,
                403: `Access denied`,
                404: `Fantasy team not found`,
            },
        });
    }
    /**
     * Set team captain
     * @returns any Captain set successfully
     * @throws ApiError
     */
    public static postApiFantasyTeamsCaptain({
        id,
        requestBody,
    }: {
        /**
         * Fantasy Team ID
         */
        id: string,
        requestBody: {
            playerId: string;
        },
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/fantasy-teams/{id}/captain',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Player not found in team or team cannot be edited`,
                403: `Access denied`,
                404: `Fantasy team not found`,
            },
        });
    }
    /**
     * Set team vice captain
     * @returns any Vice Captain set successfully
     * @throws ApiError
     */
    public static postApiFantasyTeamsViceCaptain({
        id,
        requestBody,
    }: {
        /**
         * Fantasy Team ID
         */
        id: string,
        requestBody: {
            playerId: string;
        },
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/fantasy-teams/{id}/vice-captain',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Player not found in team or team cannot be edited`,
                403: `Access denied`,
                404: `Fantasy team not found`,
            },
        });
    }
    /**
     * Get match leaderboard
     * @returns any Match leaderboard fetched successfully
     * @throws ApiError
     */
    public static getApiFantasyTeamsMatchLeaderboard({
        matchId,
        limit,
    }: {
        /**
         * Match ID
         */
        matchId: string,
        /**
         * Number of top teams to return
         */
        limit?: number,
    }): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: Array<FantasyTeam>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/fantasy-teams/match/{matchId}/leaderboard',
            path: {
                'matchId': matchId,
            },
            query: {
                'limit': limit,
            },
        });
    }
    /**
     * Get match statistics
     * @returns any Match statistics fetched successfully
     * @throws ApiError
     */
    public static getApiFantasyTeamsMatchStats({
        matchId,
    }: {
        /**
         * Match ID
         */
        matchId: string,
    }): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            totalTeams?: number;
            averagePoints?: number;
            maxPoints?: number;
            minPoints?: number;
            averageCredits?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/fantasy-teams/match/{matchId}/stats',
            path: {
                'matchId': matchId,
            },
        });
    }
}
