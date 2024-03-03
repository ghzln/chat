import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndCookie from '../utils/generatetoken.js'

export const signup = async (req, res) => {
    try {

        const { fullName, username, password, confirmPassword, gender } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        const user = await User.findOne({ username })
        if (user) {
            return res.status(400).json({ error: "Username already exist" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const newUser = new User({
            fullName,
            username,
            password: hashedPassword,
            gender,
            profilePic: gender === "male" ? boyProfilePic : girlProfilePic
        });
        if (newUser) {
            generateTokenAndCookie(newUser._id, res);

            await newUser.save();

            return res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                fullName: newUser.fullName,
                gender: newUser.gender,
                profilePic: newUser.profilePic
            });

        } else {
            return res.status(400).json({ error: "Invalid user data" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });

    }

}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }
        generateTokenAndCookie(user._id, res);
        return res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });

    }
}

export const logout = async (req, res) => {
    try {

        res.cookie("jwt", "", { maxAge: 0 })
        return res.status(200).json({ message: "Successfully logged out" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });

    }
}

