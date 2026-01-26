/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminDashboardService {
    /**
     * Get dashboard statistics
     * @returns any Dashboard statistics retrieved successfully
     * @throws ApiError
     */
    public static getApiAdminDashboardStats(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/dashboard/stats',
            errors: {
                403: `Admin access required`,
            },
        });
    }
}
