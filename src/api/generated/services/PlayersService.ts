/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Player } from '../models/Player';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PlayersService {
    /**
     * Get all players with filters and pagination
     * @returns any Players fetched successfully
     * @throws ApiError
     */
    public static getApiPlayers({
        page,
        limit,
        role,
        team,
        tournament,
        status,
        minCredits,
        maxCredits,
        search,
        sortBy,
        sortOrder,
    }: {
        /**
         * Page number
         */
        page?: number,
        /**
         * Number of players per page
         */
        limit?: number,
        /**
         * Filter by player role
         */
        role?: 'BATSMAN' | 'BOWLER' | 'ALL_ROUNDER' | 'WICKET_KEEPER',
        /**
         * Filter by team ID
         */
        team?: string,
        /**
         * Filter by tournament availability
         */
        tournament?: string,
        /**
         * Filter by player status
         */
        status?: 'ACTIVE' | 'INJURED' | 'SUSPENDED' | 'RETIRED',
        /**
         * Minimum credits filter
         */
        minCredits?: number,
        /**
         * Maximum credits filter
         */
        maxCredits?: number,
        /**
         * Search by name or short name
         */
        search?: string,
        /**
         * Sort field
         */
        sortBy?: 'name' | 'shortName' | 'role' | 'credits' | 'stats.fantasyPoints' | 'createdAt',
        /**
         * Sort order
         */
        sortOrder?: 'asc' | 'desc',
    }): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            players?: Array<Player>;
            pagination?: Record<string, any>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/players',
            query: {
                'page': page,
                'limit': limit,
                'role': role,
                'team': team,
                'tournament': tournament,
                'status': status,
                'minCredits': minCredits,
                'maxCredits': maxCredits,
                'search': search,
                'sortBy': sortBy,
                'sortOrder': sortOrder,
            },
        });
    }
    /**
     * Create a new player
     * @returns any Player created successfully
     * @throws ApiError
     */
    public static postApiPlayers({
        requestBody,
    }: {
        requestBody: {
            name: string;
            shortName: string;
            role: 'BATSMAN' | 'BOWLER' | 'ALL_ROUNDER' | 'WICKET_KEEPER';
            team?: string;
            credits?: number;
            playerId?: string;
            dateOfBirth?: string;
            nationality?: string;
            battingStyle?: string;
            bowlingStyle?: string;
            description?: string;
            avatar?: string;
        },
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/players',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error or player already exists`,
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get single player by ID
     * @returns any Player fetched successfully
     * @throws ApiError
     */
    public static getApiPlayers1({
        id,
    }: {
        /**
         * Player ID
         */
        id: string,
    }): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: Player;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/players/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Player not found`,
            },
        });
    }
    /**
     * Update a player
     * @returns any Player updated successfully
     * @throws ApiError
     */
    public static putApiPlayers({
        id,
        requestBody,
    }: {
        /**
         * Player ID
         */
        id: string,
        requestBody: {
            name?: string;
            shortName?: string;
            role?: string;
            credits?: number;
            status?: string;
        },
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/players/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                404: `Player not found`,
            },
        });
    }
    /**
     * Delete a player (soft delete)
     * @returns any Player deleted successfully
     * @throws ApiError
     */
    public static deleteApiPlayers({
        id,
    }: {
        /**
         * Player ID
         */
        id: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/players/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                404: `Player not found`,
            },
        });
    }
    /**
     * Bulk create players
     * @returns any Bulk creation completed
     * @throws ApiError
     */
    public static postApiPlayersBulk({
        requestBody,
    }: {
        requestBody: {
            players: Array<Record<string, any>>;
        },
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/players/bulk',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get players by team
     * @returns any Team players fetched successfully
     * @throws ApiError
     */
    public static getApiPlayersTeam({
        teamId,
        role,
        status,
    }: {
        /**
         * Team ID
         */
        teamId: string,
        /**
         * Filter by role
         */
        role?: 'BATSMAN' | 'BOWLER' | 'ALL_ROUNDER' | 'WICKET_KEEPER',
        /**
         * Filter by status
         */
        status?: 'ACTIVE' | 'INJURED' | 'SUSPENDED' | 'RETIRED',
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/players/team/{teamId}',
            path: {
                'teamId': teamId,
            },
            query: {
                'role': role,
                'status': status,
            },
        });
    }
    /**
     * Get players available for a tournament
     * @returns any Tournament players fetched successfully
     * @throws ApiError
     */
    public static getApiPlayersTournament({
        tournamentId,
        role,
        teamId,
        minCredits,
        maxCredits,
    }: {
        /**
         * Tournament ID
         */
        tournamentId: string,
        /**
         * Filter by role
         */
        role?: 'BATSMAN' | 'BOWLER' | 'ALL_ROUNDER' | 'WICKET_KEEPER',
        /**
         * Filter by team
         */
        teamId?: string,
        /**
         * Minimum credits filter
         */
        minCredits?: number,
        /**
         * Maximum credits filter
         */
        maxCredits?: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/players/tournament/{tournamentId}',
            path: {
                'tournamentId': tournamentId,
            },
            query: {
                'role': role,
                'teamId': teamId,
                'minCredits': minCredits,
                'maxCredits': maxCredits,
            },
        });
    }
    /**
     * Update player statistics
     * @returns any Player stats updated successfully
     * @throws ApiError
     */
    public static patchApiPlayersStats({
        id,
        requestBody,
    }: {
        /**
         * Player ID
         */
        id: string,
        requestBody: {
            stats?: {
                runs?: number;
                wickets?: number;
                catches?: number;
                stumpings?: number;
            };
            fantasyPoints?: number;
            matchId?: string;
        },
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/players/{id}/stats',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                404: `Player not found`,
            },
        });
    }
}
