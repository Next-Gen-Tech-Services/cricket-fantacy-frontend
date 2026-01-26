/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type PushSubscription = {
    subscription: {
        /**
         * Push service endpoint URL
         */
        endpoint?: string;
        keys?: {
            /**
             * Public key for encryption
             */
            p256dh?: string;
            /**
             * Authentication secret
             */
            auth?: string;
        };
        /**
         * Optional subscription expiration time
         */
        expirationTime?: string;
    };
    preferences?: {
        matchUpdates?: boolean;
        contestReminders?: boolean;
        teamUpdates?: boolean;
        leaderboardUpdates?: boolean;
        adminAlerts?: boolean;
        promotions?: boolean;
    };
    /**
     * Browser user agent string
     */
    userAgent?: string;
};

