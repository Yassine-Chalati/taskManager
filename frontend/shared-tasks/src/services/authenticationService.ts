import dotenv from 'dotenv';
import path from 'path';
import authentication from '../lib/auth';
import { User } from '../types/user';
import Cookies from 'js-cookie';


// Load environment variables from the custom path ../lib/.env.local
dotenv.config({ path: path.resolve(__dirname, '../lib/.env.local') });

class AuthenticationService {

    // Method to login and use the authenticate method
    public async loginUser(user: User): Promise<boolean> {
        try {
            const tokens = await authentication.authenticate(user.username, user.password);
            // store the refresh tokens in localStorage and cookies
            localStorage.setItem('refresh_token', tokens.refresh_token);

            //store the access token in cookies
            Cookies.set('access_token', tokens.access_token);
            console.log('Logged in successfully, token:', tokens);

            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    }

}

// Example usage
const authenticationService = new AuthenticationService();

// You can export the class if needed
export default authenticationService;
