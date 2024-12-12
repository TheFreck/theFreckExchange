import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';


const baseFolder =
env.APPDATA !== undefined && env.APPDATA !== ''
? `${env.APPDATA}/ASPNET/https`
: `${env.HOME}/.aspnet/https`;

fs.mkdirSync(baseFolder, {recursive: true});

const certificateName = "theFreckExchange.client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (0 !== child_process.spawnSync('dotnet', [
        'dev-certs',
        'https',
        '--export-path',
        certFilePath,
        '--format',
        'Pem',
        '--no-password',
    ], { stdio: 'inherit', }).status) {
        throw new Error("Could not create certificate.");
    }
}
console.log("env: ", env.NODE_ENV);

const target = env.NODE_ENV == "development" ? "https://localhost:7299" : "https://thefreckexchange-cvgkagadbkcedyfm.westus-01.azurewebsites.net/";

export default defineConfig({
    plugins: [plugin()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        proxy: {
            '/api': {
                target,
                changeOrigin: true,
                secure: false
            }
        },
        port: 5174,
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        }
    }
})
