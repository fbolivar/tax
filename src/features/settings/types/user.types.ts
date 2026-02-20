export interface UserProfile {
    id: string;
    email: string;
    full_name?: string;
    role: 'admin' | 'viewer';
    created_at: string;
}
