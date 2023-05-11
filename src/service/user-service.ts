import { compareSync, hashSync } from "bcrypt";
import { UserModel } from "../models/user-model";
import { PrismaClient } from '@prisma/client';
import { tokenService } from "./token-service";
import UserDTO from "../dtos/user-dto"

const prisma = new PrismaClient();

export const userService = {
    async register(email: string, username: string, password: string) {
        const candidate = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (candidate) {
            throw new Error("User already exists")
        }

        const hashedPassword = hashSync(password, 10);
        const user: UserModel = await prisma.user.create({
            data: {
                email: email,
                username: username,
                password: hashedPassword
            }
        });

        const userDTO = new UserDTO(user);
        const tokens = tokenService.generateTokens(user.id);
        const refreshToken = tokens.refreshToken;
        const accessToken = tokens.accessToken;
        await tokenService.saveToken(user.id, tokens.refreshToken)

        return { refreshToken, accessToken, userDTO }
    },

    async login(email: string, password: string) {
        const user: UserModel | null = await prisma.user.findUnique({
            where:
                { email: email }
        });

        if (user == null) {
            throw new Error('UserModel not found');
        }

        if (!compareSync(password, user.password)) {
            throw new Error('Incorrect password');
        }

        const userDTO = new UserDTO(user);
        const tokens = tokenService.generateTokens(user.id);
        const refreshToken = tokens.refreshToken;
        const accessToken = tokens.accessToken;
        await tokenService.saveToken(user.id, tokens.refreshToken);

        return { refreshToken, accessToken, userDTO }
    }
}