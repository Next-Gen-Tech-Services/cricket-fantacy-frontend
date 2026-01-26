/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminUsersService {
    /**
     * Get all users with pagination and filters
     * @returns any Users retrieved successfully
     * @throws ApiError
     */
    public static getApiAdminUsers({
        role,
        search,
        page = 1,
        limit = 10,
        status,
    }: {
        /**
         * Filter by user role
         */
        role?: 'user' | 'admin' | 'superadmin',
        /**
         * Search by name or email
         */
        search?: string,
        /**
         * Page number
         */
        page?: number,
        /**
         * Items per page
         */
        limit?: number,
        /**
         * Filter by active status
         */
        status?: 'active' | 'inactive',
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/users',
            query: {
                'role': role,
                'search': search,
                'page': page,
                'limit': limit,
                'status': status,
            },
            errors: {
                403: `Admin access required`,
            },
        });
    }
}
