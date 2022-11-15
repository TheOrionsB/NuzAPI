import mongoose, { model } from "mongoose"

interface IShortenedQueue {
    src: string,
    enteredQueueAt: Date,
    initiatedBy: string
}

const ShortenedQueueSchema = new mongoose.Schema({
    src: String,
    enteredQueueAt: Date,
    initiatedBy: String
})

const ShortenedQueue = model<IShortenedQueue>('shortenedqueue', ShortenedQueueSchema);
export default ShortenedQueue;