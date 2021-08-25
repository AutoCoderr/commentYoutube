import {Router} from "express";
import jwt from 'jsonwebtoken';
import User, {IUser} from "../models/User";
import JWTMiddleWare from "../middlewares/JWTMiddleWare";
import request from "../lib/request";

const SessionRouter = Router();

SessionRouter.post('/login', async (req,res) => {
    const {code} = req.body;
    let googleUserInfos: any = null;
    if (code) {
        let body: any = {
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            code,
            redirect_uri: "http://www.s2c-ingenieurstructure.com:3000",
            grant_type: "authorization_code"
        }
        body = Object.keys(body).map(key => encodeURIComponent(key)+"="+encodeURIComponent(body[key])).join("&");
        const {access_token} = JSON.parse(await request("https://oauth2.googleapis.com/token", { // "token endpoint
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Content-length': Buffer.byteLength(body)
            },
            body
        }));
        if (access_token) {
            googleUserInfos = JSON.parse(await request("https://openidconnect.googleapis.com/v1/userinfo", {
                headers: {
                    'authorization': 'Bearer '+access_token,
                },
            }));
            if (!googleUserInfos.given_name || !googleUserInfos.family_name || !googleUserInfos.email) {
                googleUserInfos = null;
            }
        }
    }


    const user: IUser = {
        id: new Date().getTime().toString()+"_"+rand(1000,9999),
        type: googleUserInfos ? "google" : "anon",
        firstname:  googleUserInfos ? googleUserInfos.given_name : "anon",
        lastname: googleUserInfos ? googleUserInfos.family_name : rand(1,1000),
    }

    if (googleUserInfos) {
        user.email = googleUserInfos.email;
        const existingUser = await User.findOne({
            where: {email: user.email}
        });
        if (existingUser != null) {
            if (existingUser.firstname != user.firstname || existingUser.lastname != user.lastname) {
                existingUser.firstname = user.firstname;
                existingUser.lastname = user.lastname;
                await existingUser.save();
            }
            user.id = existingUser.id
        }
    }

    res.json({
        ...user,
        token: jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1 hour' })
    });
});

SessionRouter.get("/client_id", (req,res) =>
    res.json(process.env.GOOGLE_CLIENT_ID)
)

SessionRouter.use(JWTMiddleWare);

SessionRouter.get("/test", (req,res) => {
    res.sendStatus(200);
})

export default SessionRouter;

const rand = (a,b) => a+Math.floor(Math.random()*(b-a+1));
