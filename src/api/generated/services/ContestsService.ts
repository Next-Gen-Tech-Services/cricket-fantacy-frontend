/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Contest } from '../models/Contest';
import type { ContestJoin } from '../models/ContestJoin';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ContestsService {
    /**
     * Get all active contests
     * @returns any Active contests retrieved successfully
     * @throws ApiError
     */
    public static getApiContestsActive({
        matchId,
        type,
        limit = 20,
        page = 1,
    }: {
        /**
         * Filter by match ID
         */
        matchId?: string,
        /**
         * Filter by contest type
         */
        type?: 'HEAD_TO_HEAD' | 'LEAGUE' | 'MEGA_CONTEST' | 'PRIVATE' | 'PRACTICE',
        /**
         * Number of contests per page
         */
        limit?: number,
        /**
         * Page number
         */
        page?: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contests/active',
            query: {
                'matchId': matchId,
                'type': type,
                'limit': limit,
                'page': page,
            },
            errors: {
                500: `Server error`,
            },
        });
    }
    /**
     * Get featured contests
     * @returns any Featured contests retrieved successfully
     * @throws ApiError
     */
    public static getApiContestsFeatured(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contests/featured',
        });
    }
    /**
     * Get contests by match
     * @returns any Match contests retrieved successfully
     * @throws ApiError
     */
    public static getApiContestsMatch({
        matchId,
        type,
        entryFeeRange,
        sortBy = 'entryFee',
    }: {
        /**
         * Match ID
         */
        matchId: string,
        /**
         * Contest type filter
         */
        type?: string,
        /**
         * Entry fee range (e.g., "0-100")
         */
        entryFeeRange?: string,
        /**
         * Sort field
         */
        sortBy?: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contests/match/{matchId}',
            path: {
                'matchId': matchId,
            },
            query: {
                'type': type,
                'entryFeeRange': entryFeeRange,
                'sortBy': sortBy,
            },
        });
    }
    /**
     * Get user's contests
     * @returns any User contests retrieved successfully
     * @throws ApiError
     */
    public static getApiContestsMy({
        status,
        limit = 20,
        page = 1,
    }: {
        /**
         * Filter by contest status
         */
        status?: string,
        limit?: number,
        page?: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contests/my',
            query: {
                'status': status,
                'limit': limit,
                'page': page,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get contest by ID
     * @returns any Contest retrieved successfully
     * @throws ApiError
     */
    public static getApiContests({
        contestId,
    }: {
        /**
         * Contest ID
         */
        contestId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contests/{contestId}',
            path: {
                'contestId': contestId,
            },
            errors: {
                404: `Contest not found`,
            },
        });
    }
    /**
     * Update contest (Admin only)
     * @returns any Contest updated successfully
     * @throws ApiError
     */
    public static putApiContests({
        contestId,
        requestBody,
    }: {
        /**
         * Contest ID
         */
        contestId: string,
        requestBody: Contest,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/contests/{contestId}',
            path: {
                'contestId': contestId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request or contest cannot be updated`,
                401: `Unauthorized`,
                403: `Admin access required`,
                404: `Contest not found`,
            },
        });
    }
    /**
     * Get contest leaderboard
     * @returns any Contest leaderboard retrieved successfully
     * @throws ApiError
     */
    public static getApiContestsLeaderboard({
        contestId,
        page = 1,
        limit = 50,
    }: {
        /**
         * Contest ID
         */
        contestId: string,
        page?: number,
        limit?: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contests/{contestId}/leaderboard',
            path: {
                'contestId': contestId,
            },
            query: {
                'page': page,
                'limit': limit,
            },
            errors: {
                404: `Contest not found`,
            },
        });
    }
    /**
     * Get contest prize structure
     * @returns any Prize structure retrieved successfully
     * @throws ApiError
     */
    public static getApiContestsPrizeStructure({
        contestId,
    }: {
        /**
         * Contest ID
         */
        contestId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contests/{contestId}/prize-structure',
            path: {
                'contestId': contestId,
            },
            errors: {
                404: `Contest not found`,
            },
        });
    }
    /**
     * Join a contest
     * @returns any Successfully joined contest
     * @throws ApiError
     */
    public static postApiContestsJoin({
        contestId,
        requestBody,
    }: {
        /**
         * Contest ID
         */
        contestId: string,
        requestBody: ContestJoin,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/contests/{contestId}/join',
            path: {
                'contestId': contestId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request or contest full`,
                401: `Unauthorized`,
                404: `Contest or team not found`,
            },
        });
    }
    /**
     * Leave a contest
     * @returns any Successfully left contest
     * @throws ApiError
     */
    public static postApiContestsLeave({
        contestId,
        requestBody,
    }: {
        /**
         * Contest ID
         */
        contestId: string,
        requestBody: {
            /**
             * Team ID to remove (optional, removes all if not specified)
             */
            teamId?: string;
        },
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/contests/{contestId}/leave',
            path: {
                'contestId': contestId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Cannot leave contest or not participating`,
                401: `Unauthorized`,
                404: `Contest not found`,
            },
        });
    }
    /**
     * Create a new contest (Admin only)
     * @returns any Contest created successfully
     * @throws ApiError
     */
    public static postApiContests({
        requestBody,
    }: {
        requestBody: Contest,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/contests',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request data`,
                401: `Unauthorized`,
                403: `Admin access required`,
            },
        });
    }
    /**
     * Distribute contest prizes (Admin only)
     * @returns any Prizes distributed successfully
     * @throws ApiError
     */
    public static postApiContestsDistributePrizes({
        contestId,
    }: {
        /**
         * Contest ID
         */
        contestId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/contests/{contestId}/distribute-prizes',
            path: {
                'contestId': contestId,
            },
            errors: {
                400: `Contest not ready for prize distribution`,
                401: `Unauthorized`,
                403: `Admin access required`,
                404: `Contest not found`,
            },
        });
    }
    /**
     * Get contest statistics (Admin only)
     * @returns any Contest statistics retrieved successfully
     * @throws ApiError
     */
    public static getApiContestsStats({
        contestId,
    }: {
        /**
         * Contest ID
         */
        contestId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/contests/{contestId}/stats',
            path: {
                'contestId': contestId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Admin access required`,
                404: `Contest not found`,
            },
        });
    }
}
