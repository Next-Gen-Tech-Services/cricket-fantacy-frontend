/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LeaderboardEntry } from '../models/LeaderboardEntry';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LeaderboardService {
    /**
     * Get match leaderboard
     * @returns any Match leaderboard fetched successfully
     * @throws ApiError
     */
    public static getApiLeaderboardMatch({
        matchId,
        page,
        limit,
        userId,
        search,
    }: {
        matchId: string,
        page?: number,
        limit?: number,
        userId?: string,
        search?: string,
    }): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            leaderboard?: Array<LeaderboardEntry>;
            userTeam?: Record<string, any>;
            pagination?: Record<string, any>;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/leaderboard/match/{matchId}',
            path: {
                'matchId': matchId,
            },
            query: {
                'page': page,
                'limit': limit,
                'userId': userId,
                'search': search,
            },
        });
    }
    /**
     * Get tournament leaderboard
     * @returns any Tournament leaderboard fetched successfully
     * @throws ApiError
     */
    public static getApiLeaderboardTournament({
        tournamentId,
        page,
        limit,
        userId,
    }: {
        tournamentId: string,
        page?: number,
        limit?: number,
        userId?: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/leaderboard/tournament/{tournamentId}',
            path: {
                'tournamentId': tournamentId,
            },
            query: {
                'page': page,
                'limit': limit,
                'userId': userId,
            },
        });
    }
    /**
     * Get global leaderboard
     * @returns any Global leaderboard fetched successfully
     * @throws ApiError
     */
    public static getApiLeaderboardGlobal({
        page,
        limit,
        timeframe,
        userId,
    }: {
        page?: number,
        limit?: number,
        timeframe?: 'all' | 'week' | 'month' | 'year',
        userId?: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/leaderboard/global',
            query: {
                'page': page,
                'limit': limit,
                'timeframe': timeframe,
                'userId': userId,
            },
        });
    }
    /**
     * Get player popularity rankings
     * @returns any Player popularity fetched successfully
     * @throws ApiError
     */
    public static getApiLeaderboardPlayersPopular({
        matchId,
        tournamentId,
        limit,
    }: {
        matchId?: string,
        tournamentId?: string,
        limit?: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/leaderboard/players/popular',
            query: {
                'matchId': matchId,
                'tournamentId': tournamentId,
                'limit': limit,
            },
        });
    }
    /**
     * Get leaderboard statistics for a match
     * @returns any Leaderboard statistics fetched successfully
     * @throws ApiError
     */
    public static getApiLeaderboardStats({
        matchId,
    }: {
        matchId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/leaderboard/stats/{matchId}',
            path: {
                'matchId': matchId,
            },
        });
    }
    /**
     * Get leaderboard statistics for a tournament
     * @returns any Tournament statistics fetched successfully
     * @throws ApiError
     */
    public static getApiLeaderboardTournamentStats({
        tournamentId,
    }: {
        tournamentId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/leaderboard/tournament/stats/{tournamentId}',
            path: {
                'tournamentId': tournamentId,
            },
        });
    }
}
