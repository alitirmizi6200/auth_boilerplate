import { IUser } from '../models/user.model'
declare namespace Express{
    export interface Request{
        user?: IUser | payLoad;
    }
    export interface Response{
        user?: IUser | payLoad;
    } 
  
}

export interface payLoad {
    _id : string, 
    email: string,
    role: string
}

// test 