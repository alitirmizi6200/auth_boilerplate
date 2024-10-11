import mongoose, { Document,CallbackError, Model } from "mongoose";
import crypto from 'crypto'

export interface IUser extends Document {
    _id: string;
    username: string;
    email: string;
    password: string;
    salt: string;
    role: 'user' | 'admin';
    createdAt: Date; 
    updatedAt: Date; 
    validatePassword(data: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    salt: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'], 
        default: 'user'
    },
},{timestamps: true})

UserSchema.pre<IUser>('validate', async function save(next) {
 
    try {
        if (!this.isModified('password')) return next();

        this.salt = crypto.randomBytes(16).toString('hex');
        const derivedKey = await new Promise<Buffer>((resolve, reject) => {
            crypto.scrypt(this.password, this.salt, 64,(err, derivedKey) => {
                if (err) return next(err);
                else resolve(derivedKey);
            })
        });
        this.password = derivedKey.toString('hex');
        next();
    } catch (err) {
        return next(err as CallbackError);
    }
});

UserSchema.methods.validatePassword = async function (data: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        crypto.scrypt(data, this.salt, 64, (err, derivedKey) => {
            if (err) return reject(err);
            
            const isMatch = derivedKey.toString('hex') === this.password;
            resolve(isMatch);
        });
    });
};
export const users: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
