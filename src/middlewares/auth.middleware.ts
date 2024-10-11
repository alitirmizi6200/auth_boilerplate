import passport, { Passport } from "passport";
import { Strategy as localStraegy} from "passport-local";
import { IUser, users } from "../models/user.model";
import * as passportJWT from 'passport-jwt'; 
import { payLoad } from "../types/types";

const cookieExtractor = req => {
    let jwt = null 

    if (req && req.cookies) {
        jwt = req.cookies['autorization']
    }

    return jwt
}

passport.serializeUser((user: IUser, done)=>{
    
    if(user.password) {
        delete user.password; 
    }
    done(null, user._id)
});

passport.deserializeUser(async (_id, done)=> {
    try{
        const user: IUser = await users.findById(_id)
        if(!user) throw new Error("Unable to find user AUTH")
        done(null, user)

    } catch(err){
        done(err, null)

    }
})
// Local session based Strategy
export default passport.use(
    new localStraegy({usernameField: "email", passwordField: "password"}, async (username, password, done) => {
        try{
            const user: IUser = await users.findOne({email: username})
            if (!user) {
                throw new Error( "User not found" );
            }

            const isValidPassword = await (user).validatePassword(password);

            if (!isValidPassword) {
                throw new Error( "Invalid password");
            }
            return done(null, user);

        } catch (error) {
            return done(error, false)
        }
        
    })
)

// Passport jwt strategy 
passport.use(new passportJWT.Strategy({
    jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([
        passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),  // Extract from Bearer token
        cookieExtractor  // Extract from cookie
    ]),
    secretOrKey: process.env.JWT_SECRET || 'JWT_SECRET'
}, (payLoad: payLoad, done) => {

    try{
        done(null, payLoad)
    } catch(error) {
        done(error, null)
    }
    
}))