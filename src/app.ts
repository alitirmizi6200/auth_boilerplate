import express, {Request, Response} from 'express'
import cors from 'cors'; 
import cookieParser from 'cookie-parser';
import { default as session} from 'express-session'
import { default as connectMongoDBSession} from 'connect-mongodb-session';
import "./middlewares/auth.middleware"
import passport from 'passport'
import jwt from 'jsonwebtoken';

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
    
        // const newUser = new users({
        //     username: "w",
        //     email: "w@q.com",
        //     password: "qqqqqq"
        // });
        // // This will trigger the pre('save') hook
        // await newUser.save({validateBeforeSave: true});
        res.send("Welcome, This is auth bolilerplate code")
    })

    app.post('/auth', passport.authenticate("local",{session: false}),async (req: Request, res: Response) => {
        try{
            const token = jwt.sign(
                // @ts-ignore
                {_id : req.user._id, email: req.user.email, role: req.user.role }, 
                process.env.JWT_SECRET, 
                {expiresIn: "15d"}
            );

            // where header is needed
            res.setHeader('Authorization', `Bearer ${token}`);

            // where cookie is needed
            res.cookie('autorization', token, {
                httpOnly: true,   // Prevent JavaScript from accessing the cookie (for security)
                maxAge: 1000 * 60 * 60 * 24 * 15,  // 15 days expiration
                sameSite: 'strict'  // Prevent CSRF
            });
            
            res.json({message: "success"})
        } catch (error) {
            res.status(500).json({message: "error while signing jwt"})
        }
    })

    app.get('/authJWT', passport.authenticate("jwt"),async (req: Request, res: Response) => {
        res.send("Welcome, This is auth bolilerplate code")
    })
    // Now every request will deserialize user stored and provide to request

    return app
}