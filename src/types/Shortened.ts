type Shortened = {
    source: String,
    target: String,
    passwordProtected: Boolean,
    password: String,
    createdAt: Date,
    isExpiringEnabled: Boolean,
    ExpiresAt?: Date,
    stats: {
        nHit: Number,
        hitHistory: Array<Object>,
        lastHit: Date
    }
}

export type ShortenedT = Shortened;