export const msalConfig = {
    auth: {
        clientId: import.meta.env.VITE_MSAL_CLIENT_ID || "",
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_MSAL_TENANT_ID || ""}/v2.0`,
        redirectUri: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        navigateToLoginRequestUrl: false
    },
    cache: {
        cacheLocation: "localStorage", // More reliable for popup-to-parent communication
        storeAuthStateInCookie: true, // Backup for older browsers or strict privacy settings
    },
    system: {
        allowRedirectInIframe: true,
        navigateFrameWait: 0,
    }
};

export const loginRequest = {
    scopes: ["User.Read", "profile", "email", "openid"]
};
