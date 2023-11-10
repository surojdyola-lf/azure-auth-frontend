// config.js
export const msalConfig = {
    auth: {
      clientId: '<client-id>',
      authority: 'https://login.microsoftonline.com/<tenant-id>',
      redirectUri: 'http://localhost:3000',
    },
    cache: {
        cacheLocation: 'localStorage',
      },
  };

export const loginRequest = {
    scopes: ['openid', 'profile', 'user.read'],
};