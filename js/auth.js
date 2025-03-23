// Gerenciamento de autenticação
class AuthManager {
    constructor() {
        this.tokenClient = null;
        this.gapiInited = false;
        this.gisInited = false;
    }

    // Inicializa o cliente GAPI
    async initializeGapiClient() {
        await gapi.client.init({
            apiKey: config.API_KEY,
            discoveryDocs: [config.DISCOVERY_DOC],
        });
        this.gapiInited = true;
        uiManager.maybeEnableButtons();
    }

    // Inicializa o cliente GIS
    initializeGisClient() {
        this.tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: config.CLIENT_ID,
            scope: config.SCOPES,
            callback: '', // Definido posteriormente
        });
        this.gisInited = true;
        uiManager.maybeEnableButtons();
    }

    // Gerencia o clique no botão de autenticação
    handleAuthClick() {
        this.tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                throw resp;
            }
            uiManager.updateUIAfterAuth();
            await apiManager.listLabels();
        };

        if (gapi.client.getToken() === null) {
            this.tokenClient.requestAccessToken({prompt: 'consent'});
        } else {
            this.tokenClient.requestAccessToken({prompt: ''});
        }
    }

    // Gerencia o clique no botão de logout
    handleSignoutClick() {
        const token = gapi.client.getToken();
        if (token !== null) {
            google.accounts.oauth2.revoke(token.access_token);
            gapi.client.setToken('');
            uiManager.updateUIAfterSignout();
        }
    }

    // Add this method to your AuthManager class
    revokeAndReauthenticate() {
        const token = gapi.client.getToken();
        if (token !== null) {
            google.accounts.oauth2.revoke(token.access_token);
            gapi.client.setToken('');
            uiManager.displayContent('Previous token revoked. Please authenticate again with new permissions.');
            uiManager.updateUIAfterSignout();
            setTimeout(() => this.handleAuthClick(), 1000);
        } else {
            this.handleAuthClick();
        }
    }
}

// Callbacks para carregamento das APIs
window.gapiLoaded = function() {
    gapi.load('client', () => authManager.initializeGapiClient());
};

window.gisLoaded = function() {
    authManager.initializeGisClient();
};

const authManager = new AuthManager();