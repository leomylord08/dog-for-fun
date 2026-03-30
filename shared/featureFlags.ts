/**
 * Global Feature Flags
 *
 * This file is the single source of truth for all feature flags across the application.
 * Import this file on both the server and client to read flag values.
 *
 * To toggle a flag, change its value here and restart the dev server.
 */

export const featureFlags = {
  /**
   * isStoreLocally
   *
   * When true:  uploaded painting images are saved to the local `uploads/` folder
   *             on the server filesystem and served via the /uploads static route.
   *
   * When false: uploaded painting images are stored in AWS S3 (cloud storage)
   *             and served via the S3 CDN public URL.
   *
   * NOTE: Local storage is intended for development only. Images stored locally
   * will be lost on server restart or redeployment. Switch to false (S3) before
   * going to production.
   */
  isStoreLocally: true,
} as const;

export type FeatureFlags = typeof featureFlags;
