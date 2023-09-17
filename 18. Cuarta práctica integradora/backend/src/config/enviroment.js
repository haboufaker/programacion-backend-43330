import dotenv from 'dotenv';
import program from './commander.js';

let path = '.env.dev';

if (program.opts().mode === 'prod') {
	path = '.env.prod';
}

dotenv.config({ path });

export default {
	PORT: process.env.PORT,
    COOKIE_PARSER_KEY: process.env.COOKIE_PARSER_KEY,
    DB_URL: process.env.DB_URL,
    DB_CREDENTIALS: process.env.DB_CREDENTIALS,
    ADMIN_USER: process.env.ADMIN_USER,
    ADMIN_PASS: process.env.ADMIN_PASS,
    EMAIL: process.env.EMAIL,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CALLBACK_URL:process.env.CALLBACK_URL,
    ENVIROMENT: process.env.ENVIROMENT,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
};