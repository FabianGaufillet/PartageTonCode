import passport from "passport";
import { Strategy } from "passport-local";
import User from "../models/User.model.js";

passport.use(new Strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

export default passport;
