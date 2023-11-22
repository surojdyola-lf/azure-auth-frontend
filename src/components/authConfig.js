// config.js
export const msalConfig = {
    auth: {
      clientId: '8f19d90e-f554-4d96-ab3c-9750fbd1f001',
      authority: 'https://login.microsoftonline.com/8dba8cf5-f55e-4360-96b5-f36d8b7fd8ca',
      redirectUri: 'http://localhost:3000',
    },
    cache: {
        cacheLocation: 'localStorage',
      },
  };

export const loginRequest = {
    scopes: ['openid', 'profile', 'user.read'],
};