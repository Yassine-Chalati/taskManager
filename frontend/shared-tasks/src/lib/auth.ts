import axios, { AxiosResponse } from 'axios';
import qs from 'qs';
import dotenv from 'dotenv';
import path from 'path';
const jwksRsa = require('jwks-rsa');
const jwt = require('jsonwebtoken');

// Load environment variables from the custom path ../lib/.env.local
// dotenv.config({ path: path.resolve(__dirname, '.env.local') });

class Authentication {
    private API_URL: string;

    constructor() {
        // Get the API URL from the environment variable
        this.API_URL = process.env.KEYCLOAK_URL_AUTH || 'http://69.62.106.98:9001/realms/Chalati%20/protocol/openid-connect/token';  // Default to empty string if not defined
    }

  // Method to authenticate user and get the token
    public async authenticate(username: string, password: string): Promise<{ access_token: string; refresh_token: string }> {
        const payload = qs.stringify({
            client_id: 'Chalati-Mini-Application',
            username,
            password,
            grant_type: 'password',
        });

        try {
            const response: AxiosResponse = await axios.post(this.API_URL, payload, {
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const { access_token, refresh_token }: { access_token: string; refresh_token: string } = response.data;
            if (access_token && refresh_token) {
                return { access_token, refresh_token };
            } else {
                throw new Error('Authentication failed');
            }
        } catch (error) {
            console.error('Authentication error:', error);
            throw error;
        }
    }

}

const authenticationApi = new Authentication();

export default authenticationApi;

// You can export the class if needed
