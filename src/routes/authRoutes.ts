import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { getDate } from '../../utils';
import { verify } from 'crypto';
import { sendEmailToken } from '../services/emailService';

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const AUTHENTICATION_EXPIRATION_HOURS = 720;
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

async function assignToken(res: any, email: string, name = null, password: string, phone = null) {

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
        await sendEmailToken(email, emailToken);
        return res.sendStatus(200);
    } catch (e) {
        console.log(e);
        return res
            .status(400)
            .json({ error: "Couldn't start the authentication process" });
    }
}

async function resetToken(res: any, email: string) {

    // generate token
    const emailToken = generateEmailToken();
    const expiration = new Date(
        getDate().getTime() + EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000
    );

    try {
        const createdToken = await prisma.token.create({
            data: {
                type: 'EMAIL',
                emailToken,
                expiration,
                user: {
                    connect: {
                        email
                    },
                },
            },
        });

        console.log(createdToken);
        // TODO send emailToken to user's email
        await sendEmailToken(email, emailToken);
        return res.sendStatus(200);
    } catch (e) {
        console.log(e);
        return res
            .status(400)
            .json({ error: "Couldn't start the authentication process" });
    }
}

router.post('/change_password', async (req, res) => {
    const { email, password } = req.body;
    console.log(password)
    // Account verified
    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    const hash = await bcrypt.hash(password, saltRounds)

    try {
        const user = await prisma.user.update({
            where: { email: email },
            data: { isVerified: true, password: hash },
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
    } catch (e) {
        console.log(e);
        return res
            .status(400)
            .json({ error: "Couldn't start the authentication process" });
    }
})
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
        await assignToken(res, email, name, password)
    }
    else {
        await assignToken(res, email, name, password)
    }
});

router.post('/resetRequest', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });
        if (user && user?.isVerified) {
            await resetToken(res, email)
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

router.post('/login', async (req, res) => {
    const { data, deviceInfo } = req.body;
    const { email, password } = data;
    const { deviceId, platform } = deviceInfo;
    console.log("got to this login")
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
            include: {
                devices: true,
                incomingCall: {
                    select: {
                        android: true,
                        ios: true,
                        web: true,
                    }
                }
            }
        });

        if (user && user?.isVerified) {
            const bcrypt = require('bcrypt');
            const response = await bcrypt.compare(password, user.password);
            if (response) {
                const deviceExists = user.devices.some(device => device.deviceId === deviceInfo.deviceId);
                if (!deviceExists) {
                    await prisma.device.create({
                        data: { userId: user.id, deviceId, platform }
                    })
                }
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
                const devices = await prisma.device.findMany({
                    where: { userId: user.id },
                    select: {
                        id: true,
                        deviceId: true,
                        platform: true
                    }
                });
                const { password, updatedAt, createdAt, ...userData } = user;
                // generate the JWT token
                const authToken = generateAuthToken(apiToken.id);
                return res.json({ user: { ...userData, devices }, authToken });
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
    const { data, deviceInfo } = req.body;
    const { email, phone } = data;
    const { deviceId, platform } = deviceInfo;

    const userInstance = await prisma.user.findUnique({ where: { email } })
    // Account verified
    const user = await prisma.user.update({
        where: { email },
        data: {
            isVerified: true,
            phone: phone,
            incomingCall: {
                connectOrCreate: {
                    where: { userId: userInstance?.id },
                    create: { ios: true, android: true, web: false },
                }
            }
        },
        select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            image: true,
            isVerified: true,
            devices: true,
            incomingCall: {
                select: {
                    android: true,
                    ios: true,
                    web: true,
                }
            }
        }
    });
    const deviceExists = user.devices.some(device => device.deviceId === deviceInfo.deviceId);
    if (!deviceExists) {
        await prisma.device.create({
            data: { userId: user.id, deviceId, platform }
        })
    }
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

    const devices = await prisma.device.findMany({
        where: { userId: user.id },
        select: {
            id: true,
            deviceId: true,
            platform: true
        }
    });
    const authToken = generateAuthToken(apiToken.id);

    return res.json({ user: { ...user, devices }, authToken });
})
export default router;