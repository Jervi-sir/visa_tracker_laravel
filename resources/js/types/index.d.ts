export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    photo_url?: string,
    username?: string,
    current_payment_date?: Date,
    is_subscribed: boolean,
    has_notifications: boolean,
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
        bruh: boolean
    };
};
