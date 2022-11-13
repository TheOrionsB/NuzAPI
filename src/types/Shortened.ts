interface IShortened  {
    name: string;
    source: string;
    target: string;
    passwordProtected: boolean;
    password?: string;
    createdAt: Date;
    isExpiringEnabled: boolean;
    expiresAt?: Date;
    stats: {
        nHit: number;
        hitHistory: Array<Object>;
        lastHit: Date
    }
}

export default IShortened;