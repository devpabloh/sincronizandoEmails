// Inicialização da aplicação e ligação de eventos
document.addEventListener('DOMContentLoaded', () => {
    // Adiciona event listeners aos botões
    document.getElementById('authorize_button').addEventListener('click', () => {
        authManager.handleAuthClick();
    });
    
    document.getElementById('signout_button').addEventListener('click', () => {
        authManager.handleSignoutClick();
    });
    
    document.getElementById('fetch_emails_button').addEventListener('click', () => {
        // Aqui estava o problema - o nome do método deve corresponder ao definido em api.js
        apiManager.listarEmailRecebidos();
    });
    
    document.getElementById('reauth_button').addEventListener('click', () => {
        authManager.revokeAndReauthenticate();
    });
});