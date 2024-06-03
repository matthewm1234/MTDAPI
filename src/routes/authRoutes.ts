import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { getDate } from '../../utils';
import { verify } from 'crypto';
import { sendEmailToken } from '../services/emailService';

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const AUTHENTICATION_EXPIRATION_HOURS =  720;
const JWT_SECRET = process.env.JWT_SECRET || 'SUPER SECRET';

const router = Router();
const prisma = new PrismaClient();

// Generate a random 8 digit number as the email token
function generateEmailToken(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}

function generateAuthToken(tokenId: number): string {
    const jwtPayload = { tokenId };

    return jwt.sign(jwtPayload, JWT_SECRET, {
        algorithm: 'HS256',
        noTimestamp: true,
    });
}

async function assignToken(res: any, email: string, name = null, phone = null, password = "1234") {

    // generate token
    const emailToken = generateEmailToken();
    const expiration = new Date(
        getDate().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000
    );
    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    const hash = await bcrypt.hash(password, saltRounds)
    try {
        const createdToken = await prisma.token.create({
            data: {
                type: 'EMAIL',
                emailToken,
                expiration,
                user: {
                    connectOrCreate: {
                        where: { email },
                        create: { email, name, password: hash },
                    },
                },
            },
        });

        console.log(createdToken);
        // TODO send emailToken to user's email
        // await sendEmailToken(email, emailToken);
        return res.sendStatus(200);
    } catch (e) {
        console.log(e);
        return res
            .status(400)
            .json({ error: "Couldn't start the authentication process" });
    }
}
// Create a user, if it doesn't exist,
// generate the emailToken and send it to their email
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: { email: email },
    });
    if (user && user?.isVerified) {
        return res.sendStatus(406);
    }
    else if (user && !user?.isVerified) {
        await assignToken(res, email)
    }
    else {
        await assignToken(res, email, name, password)
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("got to this login")
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (user && user?.isVerified) {
            const bcrypt = require('bcrypt');
            const response = await bcrypt.compare(password, user.password);
            if (response) {
                // generate an API token
                const expiration = new Date(
                    getDate().getTime() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000
                );
                const apiToken = await prisma.token.create({
                    data: {
                        type: 'API',
                        expiration,
                        user: {
                            connect: {
                                email,
                            },
                        },
                    },
                });
                const { password, updatedAt, createdAt, ...userData } = user;
                // generate the JWT token
                const authToken = generateAuthToken(apiToken.id);
                return res.json({ user: userData, authToken });
            }
            else {
                return res.sendStatus(401)
            }
        }
        else if (user && !user?.isVerified) {
            return res.sendStatus(404);
        }
        else {
            return res.sendStatus(404);
        }
    } catch (e) {
        console.log(e);
        res
            .status(400)
            .json({ error: "Couldn't start the authentication process" });
    }
});

// Validate the emailToken
// Generate a long-lived JWT token
router.post('/authenticate', async (req, res) => {
    const { email, emailToken } = req.body;
    console.log(emailToken)

    const dbEmailToken = await prisma.token.findUnique({
        where: {
            emailToken,
        },
        include: {
            user: true,
        },
    });
    console.log(dbEmailToken)

    if (!dbEmailToken || !dbEmailToken.valid) {
        return res.sendStatus(401);
    }

    if (dbEmailToken.expiration < getDate()) {
        return res.status(401).json({ error: 'Token expired!' });
    }

    // Here we validated that the user is the owner of the email
    if (dbEmailToken?.user?.email !== email) {
        return res.sendStatus(401);
    }

    // Invalidate the token
    await prisma.token.update({
        where: { id: dbEmailToken.id },
        data: { valid: false },
    });

    return res.sendStatus(200);
});

router.post('/phone_link', async (req, res) => {
    const { email, phone } = req.body;
    console.log(phone)
    // Account verified
    const user = await prisma.user.update({
        where: { email: email },
        data: { isVerified: true, phone: phone },
        select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            image: true,
            isVerified: true,
        }
    });
    // generate an API token
    const expiration = new Date(
        getDate().getTime() + AUTHENTICATION_EXPIRATION_HOURS * 60 * 60 * 1000
    );
    const apiToken = await prisma.token.create({
        data: {
            type: 'API',
            expiration,
            user: {
                connect: {
                    email,
                },
            },
        },
    });

    const authToken = generateAuthToken(apiToken.id);

    return res.json({ user, authToken });
})
export default router;