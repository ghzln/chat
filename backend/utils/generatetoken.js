import jwt from 'jsonwebtoken';

const generateTokenAndCookie = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '15d'
    })

    res.cookie('jwt', token, {
        maxAge: 15 * 24 * 60 * 60 * 100, // MS
        httpOnly: true, //prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", //CSRF attacks cross-site reauest forgery attacks
        secure: process.env.NODE_ENV === 'development'
    })

}

export default generateTokenAndCookie;