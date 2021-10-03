import jwt from 'jsonwebtoken';

const extractBearerToken = headerValue => {
    if (typeof headerValue !== 'string') {
        return false
    }

    const matches = headerValue.match(/(bearer)\s+(\S+)/i)
    return matches && matches[2]
}

export default function JWTMiddleWare(req,res,next) {
    const token = req.query.token || req.body.token || (req.headers.authorization && extractBearerToken(req.headers.authorization));

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
            res.sendStatus(401);
        } else {
            req.user = decodedToken;
            next();
        }
    })
}
