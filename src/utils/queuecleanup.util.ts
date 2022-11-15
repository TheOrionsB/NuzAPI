import ShortenedQueue from "../models/shortenedqueue";

const cleanQueue = async () => {
    const dateOneHourAgo = new Date(Date.now() - ((3600000 / 60) * 30));
    await ShortenedQueue.deleteMany({enteredQueueAt: { $lt:  dateOneHourAgo}});
}

export default cleanQueue;