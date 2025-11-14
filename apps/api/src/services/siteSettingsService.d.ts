export declare function getSiteSettings(): Promise<{
    contactEmail: string;
    instagramUrl: string;
    facebookUrl: string;
    notificationEmail: string;
    id: any;
} | {
    contactEmail: string;
    instagramUrl: string;
    facebookUrl: string;
    notificationEmail: string;
}>;
export type UpdateSiteSettingsInput = {
    contactEmail?: string;
    instagramUrl?: string | null;
    facebookUrl?: string | null;
    notificationEmail?: string;
};
export declare function upsertSiteSettings(payload: UpdateSiteSettingsInput): Promise<{
    contactEmail: string;
    instagramUrl: string;
    facebookUrl: string;
    notificationEmail: string;
}>;
