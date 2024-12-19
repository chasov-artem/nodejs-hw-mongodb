import { OAuth2Client } from 'google-auth-library';

const googleOAuth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
});

export function generateOAuthURL() {
  return googleOAuth2Client.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
}

export async function validateCode(code) {
  try {
    const token = await googleOAuth2Client.getToken(code);

    console.log(token);
    // googleOAuth2Client.verifyIdToken()
  } catch (error) {
    throw error;
  }
}
