// Gerenciamento da interface do usuário
class UIManager {
    constructor() {
        this.authorizeButton = document.getElementById('authorize_button');
        this.signoutButton = document.getElementById('signout_button');
        this.fetchEmailsButton = document.getElementById('fetch_emails_button');
        this.contentElement = document.getElementById('content');
    }

    // Habilita os botões quando as APIs estão carregadas
    maybeEnableButtons() {
        if (authManager.gapiInited && authManager.gisInited) {
            this.authorizeButton.style.visibility = 'visible';
        }
    }

    // Atualiza a UI após autenticação
    updateUIAfterAuth() {
        this.signoutButton.style.visibility = 'visible';
        this.fetchEmailsButton.style.visibility = 'visible'; // Certifique-se de que esta linha existe
        this.authorizeButton.innerText = 'Refresh';
    }

    // Atualiza a UI após logout
    updateUIAfterSignout() {
        this.contentElement.innerText = '';
        this.authorizeButton.innerText = 'Authorize';
        this.signoutButton.style.visibility = 'hidden';
        this.fetchEmailsButton.style.visibility = 'hidden';
    }

    // Exibe conteúdo no elemento pre
    displayContent(content) {
        this.contentElement.innerText = content;
    }
}

const uiManager = new UIManager();