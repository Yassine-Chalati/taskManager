// keycloakMiddleware.js
const axios = require('axios');
const jwksRsa = require('jwks-rsa');
const jwt = require('jsonwebtoken');

// Set up JWKS client to get the public key from Keycloak's /certs endpoint
const jwksClient = jwksRsa({
  jwksUri: 'http://69.62.106.98:9001/realms/Chalati%20/protocol/openid-connect/certs', // Keycloak certs URL
});

// Function to get the signing key from the JWKS
function getSigningKey(kid) {
    return new Promise((resolve, reject) => {
        jwksClient.getSigningKey(kid, (err, key) => {
        if (err) {
            return reject(err);
        }
        resolve(key.publicKey || key.rsaPublicKey);
        });
    });
}

// Middleware to validate the JWT token
const checkJwt = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract the token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Token missing or invalid' });
    }

    // Decode the JWT to get the 'kid' (Key ID)
    const decodedToken = jwt.decode(token, { complete: true });
    if (!decodedToken || !decodedToken.header.kid) {
        return res.status(401).json({ message: 'Invalid token' });
    }

    const kid = decodedToken.header.kid; // Extract the Key ID from the token header

    try {
        // Get the public key from JWKS using the 'kid'
        const publicKey = await getSigningKey(kid);

        // Verify the JWT using the public key
        jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded; // Store the decoded JWT data in the request object
        next(); // Proceed to the next middleware/route handler
        });
    } catch (error) {
        console.error('JWT verification failed:', error);
        res.status(401).json({ message: 'Token verification failed' });
    }
};

module.exports = checkJwt;
