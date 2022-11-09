import {Schema, model} from 'mongoose';
import {ShortenedArrayT} from '../types/ShortenedArray'

interface IUser {
    username: String,
    password: String,
    shortened: Array<ShortenedArrayT>,
    recoveryKey: String,
}

const userSchema = new Schema<IUser>({
    username: {type: String, required: true},
    password: {type: String, required: true},
    shortened: {type: [], required: true},
    recoveryKey: {type: String, required: false}
})

const User = model<IUser>('User', userSchema);
export default User;