import passport from "passport";
import { Strategy as localStraegy} from "passport-local";
import mongoose from "mongoose";
import { users } from "../models/user.model";

passport.serializeUser((user, done)=>{
    //@ts-ignore
    done(null, user._id)
});

passport.deserializeUser(async (_id, done)=> {
    try{
    const user = await users.findById(_id)
    if(!user) throw new Error("Unable to fiind user AUTH")
    done(null, user)

    } catch(err){
        done(err, null)
    }
})

export default passport.use(
    new localStraegy({usernameField: "email", passwordField: "password"}, async (username, password, done) => {
        try{
            const user = await users.findOne({email: username})
            if (!user) {
                throw new Error( "User not found" );
            }

            const isValidPassword = await (user).validatePassword(password);

            if (!isValidPassword) {
                throw new Error( "Invalid password");
            }
            console.log(user)
            return done(null, user);

        } catch (error) {
            return done(error, false)
        }
        
    })
)