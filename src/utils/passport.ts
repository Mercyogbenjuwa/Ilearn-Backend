import { urlencoded } from "express";
import {  VerifyCallback } from "jsonwebtoken";
import passport, { Profile } from "passport";
import { Strategy, StrategyOptionsWithRequest, _StrategyOptionsBase } from "passport-google-oauth20";

const googleLogin = {
    clientID: process.env.Client_ID,
    clientSecret: process.env.Client_Secret
}

const options:StrategyOptionsWithRequest = {
    clientID: googleLogin.clientID!,
    clientSecret: googleLogin.clientSecret!,
    callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
    passReqToCallback: true
}

const verify = (req: Express.Request, accessToken: string, requestToken: string, profile: Profile, done: VerifyCallback) => {
    return done(null, profile)
}

passport.use(new Strategy(options, verify))