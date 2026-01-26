/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BulkNotification = {
    /**
     * Notification title
     */
    title: string;
    /**
     * Notification body text
     */
    body: string;
    /**
     * Array of user IDs to target (empty = all users)
     */
    targetUsers?: Array<string>;
    /**
     * Which user preference to check before sending
     */
    preference?: 'matchUpdates' | 'contestReminders' | 'teamUpdates' | 'leaderboardUpdates' | 'adminAlerts' | 'promotions';
    /**
     * Additional data to include with notification
     */
    data?: Record<string, any>;
};

