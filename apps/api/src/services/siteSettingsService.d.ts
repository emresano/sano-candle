export declare function getSiteSettings(): Promise<{
    contactEmail: string;
    instagramUrl: string;
    facebookUrl: string;
    notificationEmail: string;
    id: any;
} | {
    id: number;
    contactEmail: string;
    instagramUrl: string;
    facebookUrl: string;
    notificationEmail: string;
    updatedAt: Date;
}>;
export type UpdateSiteSettingsInput = {
    contactEmail?: string;
    instagramUrl?: string | null;
    facebookUrl?: string | null;
    notificationEmail?: string;
};
export declare function upsertSiteSettings(payload: UpdateSiteSettingsInput): Promise<{
    id: number;
    contactEmail: string;
    instagramUrl: string;
    facebookUrl: string;
    notificationEmail: string;
    updatedAt: Date;
}>;
