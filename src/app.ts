import express, {Request, Response} from 'express'
import cors from 'cors'; 
import cookieParser from 'cookie-parser';
import { default as session} from 'express-session'
import { default as connectMongoDBSession} from 'connect-mongodb-session';
import "./middlewares/auth.middleware"
import passport from 'passport'

import { users } from './models/user.model';

export const createApp = async () => { 

    const MongoStore = connectMongoDBSession(session);
    var store = new MongoStore({
        uri: process.env.MONGO_CONNECTION_URI! ,
        collection: 'sessions'
    });

    const app = express();

    app.use(express.urlencoded({
        extended: true,
        limit: "15kb" 
    }))

    app.use(express.static("public"))

    app.use(cors({
        origin: process.env.CORS,
        credentials: true 
    }))

    app.use(cookieParser())

    app.use(express.json({
        limit: "15kb"
    }))

    app.use(session({
        secret: process.env.SESSION_SECRET!,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 1000*60*60*24
        },
        store: store,

    }))

    app.use(passport.initialize());
    app.use(passport.session())

    app.get('/', async (req: Request, res: Response) => {
        const newUser = new users({
            username: "a",
            email: "q@q.com",
            password: "qqqqqq"
        });
        // This will trigger the pre('save') hook
        await newUser.save({validateBeforeSave: true});
        res.send("Welcome, This is auth bolilerplate code")
    })

    app.post('/auth', passport.authenticate("local"),(req: Request, res: Response) => {
        res.send("Welcome, This is auth bolilerplate code")
    })

    // Now every request will deserialize user stored and provide to request

    return app
}