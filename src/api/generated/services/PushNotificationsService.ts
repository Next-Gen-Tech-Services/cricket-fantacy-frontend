/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BulkNotification } from '../models/BulkNotification';
import type { NotificationPreferences } from '../models/NotificationPreferences';
import type { PushSubscription } from '../models/PushSubscription';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PushNotificationsService {
    /**
     * Get VAPID public key for client subscription
     * @returns any VAPID public key retrieved successfully
     * @throws ApiError
     */
    public static getApiPushVapidPublicKey(): CancelablePromise<{
        success?: boolean;
        data?: {
            publicKey?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/push/vapid-public-key',
            errors: {
                503: `Push notifications not configured`,
            },
        });
    }
    /**
     * Subscribe to push notifications
     * @returns any Subscription updated successfully
     * @throws ApiError
     */
    public static postApiPushSubscribe({
        requestBody,
    }: {
        requestBody: PushSubscription,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/push/subscribe',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid push subscription`,
                401: `Unauthorized`,
                409: `Subscription already exists`,
            },
        });
    }
    /**
     * Unsubscribe from push notifications
     * @returns any Successfully unsubscribed
     * @throws ApiError
     */
    public static postApiPushUnsubscribe({
        requestBody,
    }: {
        requestBody: {
            /**
             * Push subscription endpoint to remove
             */
            endpoint: string;
        },
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/push/unsubscribe',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Endpoint is required`,
                401: `Unauthorized`,
                404: `Subscription not found`,
            },
        });
    }
    /**
     * Get user's push subscriptions
     * @returns any Subscriptions retrieved successfully
     * @throws ApiError
     */
    public static getApiPushSubscriptions(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/push/subscriptions',
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Update notification preferences
     * @returns any Preferences updated successfully
     * @throws ApiError
     */
    public static putApiPushSubscriptionsPreferences({
        subscriptionId,
        requestBody,
    }: {
        /**
         * Push subscription ID
         */
        subscriptionId: string,
        requestBody: {
            preferences?: NotificationPreferences;
        },
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/push/subscriptions/{subscriptionId}/preferences',
            path: {
                'subscriptionId': subscriptionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid preferences object`,
                401: `Unauthorized`,
                404: `Subscription not found`,
            },
        });
    }
    /**
     * Send test notification to user
     * @returns any Test notifications sent
     * @throws ApiError
     */
    public static postApiPushTest({
        requestBody,
    }: {
        requestBody?: {
            /**
             * Test message content
             */
            message?: string;
        },
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/push/test',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Unauthorized`,
                404: `No active subscriptions found`,
            },
        });
    }
    /**
     * Get push notification statistics (Admin only)
     * @returns any Statistics retrieved successfully
     * @throws ApiError
     */
    public static getApiPushAdminStats(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/push/admin/stats',
            errors: {
                401: `Unauthorized`,
                403: `Admin access required`,
            },
        });
    }
    /**
     * Send bulk notifications (Admin only)
     * @returns any Bulk notifications sent successfully
     * @throws ApiError
     */
    public static postApiPushAdminSend({
        requestBody,
    }: {
        requestBody: BulkNotification,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/push/admin/send',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Title and body are required`,
                401: `Unauthorized`,
                403: `Admin access required`,
                404: `No eligible subscriptions found`,
            },
        });
    }
    /**
     * Cleanup expired subscriptions (Admin only)
     * @returns any Cleanup completed successfully
     * @throws ApiError
     */
    public static postApiPushAdminCleanup(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/push/admin/cleanup',
            errors: {
                401: `Unauthorized`,
                403: `Admin access required`,
            },
        });
    }
}
