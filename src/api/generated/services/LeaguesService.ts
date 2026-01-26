/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { League } from '../models/League';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LeaguesService {
    /**
     * Create a new league
     * @returns any League created successfully
     * @throws ApiError
     */
    public static postApiLeagues({
        requestBody,
    }: {
        requestBody: League,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/leagues',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid request data`,
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get user's leagues
     * @returns any User leagues retrieved successfully
     * @throws ApiError
     */
    public static getApiLeaguesMy({
        status,
    }: {
        /**
         * Filter by league status
         */
        status?: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'ARCHIVED',
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/leagues/my',
            query: {
                'status': status,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get public leagues
     * @returns any Public leagues retrieved successfully
     * @throws ApiError
     */
    public static getApiLeaguesPublic({
        category,
        search,
        limit = 20,
        page = 1,
    }: {
        /**
         * Filter by league category
         */
        category?: 'FRIENDS' | 'OFFICE' | 'FAMILY' | 'COMMUNITY' | 'COMPETITIVE',
        /**
         * Search leagues by name, description, or code
         */
        search?: string,
        /**
         * Number of leagues per page
         */
        limit?: number,
        /**
         * Page number
         */
        page?: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/leagues/public',
            query: {
                'category': category,
                'search': search,
                'limit': limit,
                'page': page,
            },
        });
    }
    /**
     * Join league by code
     * @returns any Successfully joined league
     * @throws ApiError
     */
    public static postApiLeaguesJoinByCode({
        requestBody,
    }: {
        requestBody: {
            /**
             * League code to join
             */
            code: string;
        },
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/leagues/join-by-code',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid code or cannot join`,
                401: `Unauthorized`,
                404: `League not found`,
            },
        });
    }
    /**
     * Get league by ID
     * @returns any League retrieved successfully
     * @throws ApiError
     */
    public static getApiLeagues({
        leagueId,
    }: {
        /**
         * League ID
         */
        leagueId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/leagues/{leagueId}',
            path: {
                'leagueId': leagueId,
            },
            errors: {
                403: `Access denied to private league`,
                404: `League not found`,
            },
        });
    }
    /**
     * Update league (Admin/Owner only)
     * @returns any League updated successfully
     * @throws ApiError
     */
    public static putApiLeagues({
        leagueId,
        requestBody,
    }: {
        /**
         * League ID
         */
        leagueId: string,
        requestBody: League,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/leagues/{leagueId}',
            path: {
                'leagueId': leagueId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                403: `Only league admins can update`,
                404: `League not found`,
            },
        });
    }
    /**
     * Join a league
     * @returns any Successfully joined league
     * @throws ApiError
     */
    public static postApiLeaguesJoin({
        leagueId,
        requestBody,
    }: {
        /**
         * League ID
         */
        leagueId: string,
        requestBody?: {
            /**
             * Invite token (required for invite-only leagues)
             */
            inviteToken?: string;
        },
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/leagues/{leagueId}/join',
            path: {
                'leagueId': leagueId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Cannot join league`,
                401: `Unauthorized`,
                403: `Invitation required`,
                404: `League not found`,
            },
        });
    }
    /**
     * Leave a league
     * @returns any Successfully left league
     * @throws ApiError
     */
    public static postApiLeaguesLeave({
        leagueId,
    }: {
        /**
         * League ID
         */
        leagueId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/leagues/{leagueId}/leave',
            path: {
                'leagueId': leagueId,
            },
            errors: {
                400: `Cannot leave league (e.g., owner)`,
                401: `Unauthorized`,
                404: `League not found`,
            },
        });
    }
    /**
     * Get league leaderboard
     * @returns any League leaderboard retrieved successfully
     * @throws ApiError
     */
    public static getApiLeaguesLeaderboard({
        leagueId,
        limit = 50,
    }: {
        /**
         * League ID
         */
        leagueId: string,
        /**
         * Number of members to return
         */
        limit?: number,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/leagues/{leagueId}/leaderboard',
            path: {
                'leagueId': leagueId,
            },
            query: {
                'limit': limit,
            },
            errors: {
                403: `Access denied to private league`,
                404: `League not found`,
            },
        });
    }
    /**
     * Invite users to league
     * @returns any Invitations sent successfully
     * @throws ApiError
     */
    public static postApiLeaguesInvite({
        leagueId,
        requestBody,
    }: {
        /**
         * League ID
         */
        leagueId: string,
        requestBody: {
            /**
             * Array of email addresses to invite
             */
            emails: Array<string>;
        },
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/leagues/{leagueId}/invite',
            path: {
                'leagueId': leagueId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid email addresses`,
                401: `Unauthorized`,
                403: `Not authorized to invite users`,
                404: `League not found`,
            },
        });
    }
    /**
     * Update member role (Owner only)
     * @returns any Member role updated successfully
     * @throws ApiError
     */
    public static putApiLeaguesMembersRole({
        leagueId,
        memberId,
        requestBody,
    }: {
        /**
         * League ID
         */
        leagueId: string,
        /**
         * Member user ID
         */
        memberId: string,
        requestBody: {
            /**
             * New role for the member
             */
            role: 'ADMIN' | 'MEMBER';
        },
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/leagues/{leagueId}/members/{memberId}/role',
            path: {
                'leagueId': leagueId,
                'memberId': memberId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid role or member not found`,
                401: `Unauthorized`,
                403: `Only league owner can change roles`,
                404: `League not found`,
            },
        });
    }
    /**
     * Remove member (Owner/Admin only)
     * @returns any Member removed successfully
     * @throws ApiError
     */
    public static deleteApiLeaguesMembers({
        leagueId,
        memberId,
    }: {
        /**
         * League ID
         */
        leagueId: string,
        /**
         * Member user ID
         */
        memberId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/leagues/{leagueId}/members/{memberId}',
            path: {
                'leagueId': leagueId,
                'memberId': memberId,
            },
            errors: {
                400: `Cannot remove member (e.g., owner)`,
                401: `Unauthorized`,
                403: `Only league admins can remove members`,
                404: `League not found`,
            },
        });
    }
    /**
     * Get league statistics
     * @returns any League statistics retrieved successfully
     * @throws ApiError
     */
    public static getApiLeaguesStats({
        leagueId,
    }: {
        /**
         * League ID
         */
        leagueId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/leagues/{leagueId}/stats',
            path: {
                'leagueId': leagueId,
            },
            errors: {
                403: `Access denied to private league`,
                404: `League not found`,
            },
        });
    }
}
