/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthResponse } from '../models/AuthResponse';
import type { LoginRequest } from '../models/LoginRequest';
import type { RegisterRequest } from '../models/RegisterRequest';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
    /**
     * Register a new user
     * @returns AuthResponse User registered successfully
     * @throws ApiError
     */
    public static postApiAuthRegister({
        requestBody,
    }: {
        requestBody: RegisterRequest,
    }): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error or user already exists`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Login user
     * @returns AuthResponse User logged in successfully
     * @throws ApiError
     */
    public static postApiAuthLogin({
        requestBody,
    }: {
        requestBody: LoginRequest,
    }): CancelablePromise<AuthResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                401: `Invalid credentials or account deactivated`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Authenticate with Google
     * @returns any Google authentication successful
     * @throws ApiError
     */
    public static postApiAuthGoogle({
        requestBody,
    }: {
        requestBody: {
            /**
             * Google ID token from Firebase Auth
             */
            idToken: string;
        },
    }): CancelablePromise<{
        success?: boolean;
        data?: {
            _id?: string;
            name?: string;
            email?: string;
            role?: string;
            token?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/google',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid Google token`,
                401: `Authentication failed`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Get current logged in user
     * @returns any Current user information retrieved successfully
     * @throws ApiError
     */
    public static getApiAuthMe(): CancelablePromise<{
        success?: boolean;
        data?: User;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/me',
            errors: {
                401: `Unauthorized - Invalid or missing token`,
                500: `Internal server error`,
            },
        });
    }
}
