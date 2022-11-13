import {Schema, model} from 'mongoose';
import IShortened from '../types/Shortened'

interface IUser {
    username: string,
    password: string,
    shortened: Array<IShortened>,
    recoveryKey: string,
}

const userSchema = new Schema<IUser>({
    username: {type: String, required: true},
    password: {type: String, required: true},
    shortened: {type: [], required: true},
    recoveryKey: {type: String, required: false}
})

const User = model<IUser>('User', userSchema);
export default User;