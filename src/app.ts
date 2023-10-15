import "reflect-metadata"
import express, { Request, Response, NextFunction } from 'express';
import User from "./entities/user"
import AppDataSource from "./config"
import bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken";

import dotenv from "dotenv"
dotenv.config()

const app = express()
app.use(express.json())

app.post('/login', async (req, res) => {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
        where: { email: req.body.email }
    });

    if (!user) {
        return res.send({ message: "User not found, Please Registered!" })
    }

    const passwordMatch = bcrypt.compare(req.body.password, user.password)

    if (!passwordMatch) {
        return res.send({ message: "Invalid Credentials!, Please try again." })
    }

    const id = user.user_id;
    const secret = process.env.TOKEN_SECRET;
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.json({
        username: user.username,
        accessToken,
        refreshToken,
    });
});

const generateAccessToken = (user: User) => {
    const id = user.user_id
    return jwt.sign(
        { id },
        process.env.TOKEN_SECRET || "",
        { expiresIn: "2h" },
    );
};

const generateRefreshToken = (user: User) => {
    const id = user.user_id
    return jwt.sign(
        { id },
        process.env.TOKEN_SECRET || "",
    );
};

app.post("/register", async (req, res) => {
    const userRepo = AppDataSource.getRepository(User);
    const emailCheck = await userRepo.findOne({
        where: { email: req.body.email },
    });
    if (!emailCheck) {
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        let user: User = new User();
        user = { ...req.body };
        user.password = hashedPassword;

        let userInserted = await userRepo.save(user);
        const id = userInserted.user_id;
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.json({
            username: user.username,
            accessToken,
            refreshToken,
        });
    } else {
        res.json({ result: "User already exists" });
    }
});

interface DecodedToken {
    userId: string;
}

const secretKey = process.env.TOKEN_SECRET;

function verifyJwt(token: string): DecodedToken | null {
    try {
        const decoded = jwt.verify(token, secretKey || "") as DecodedToken;
        return decoded;
    } catch (error) {
        // Handle verification errors (e.g., token expired, invalid signature, etc.)
        console.error('JWT verification failed:', error);
        return null;
    }
}

// Example usage
const jwtToken = 'your-jwt-token';

const decodedToken = verifyJwt(jwtToken);

if (decodedToken) {
    console.log('Token is valid. Decoded payload:', decodedToken);
} else {
    console.log('Token is invalid.');
}

app.post('/message:user_id', async (req, res) => {
    const userRepo = AppDataSource.getRepository(User);

    try {
        const user = await userRepo.findOne({
            where: { user_id: req.params.user_id }
        });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.message = req.body.message;
        const sendMessage = user.message;
        await userRepo.save(user);
        res.json({ message: sendMessage });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


const port = 3000

AppDataSource.initialize().then(() => {
    console.log('Database connected successfully');
    app.listen(port, () => {
        console.log(`running on port ${port}`);
    })
}).catch((err) => {
    console.log(`Error`, err);
});