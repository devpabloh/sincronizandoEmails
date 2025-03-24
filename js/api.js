class ApiManager {
    
    async listLabels() {
        try {
            const response = await gapi.client.gmail.users.labels.list({
                'userId': 'me',
            });
            
            const labels = response.result.labels;
            if (!labels || labels.length === 0) {
                uiManager.displayContent('No labels found.');
                return;
            }
            
            const output = labels.reduce(
                (str, label) => `${str}${label.name}\n`,
                'Labels:\n'
            );
            
            uiManager.displayContent(output);
        } catch (err) {
            uiManager.displayContent(err.message);
        }
    }

    async listarEmailRecebidos(){
        try {
            
            if (!gapi.client.getToken()) {
                uiManager.displayContent('Not authenticated. Please authorize first.');
                return;
            }
            
            const respostaDaMensagem = await gapi.client.gmail.users.messages.list({
                'userId': 'me',
                'labelIds': ['INBOX'],
                'maxResults': 10,
            });

            if(!respostaDaMensagem.result.messages || respostaDaMensagem.result.messages.length === 0){
                uiManager.displayContent('Nenhum email encontrado');
                return;
            }

            let conteudoDoEmail = 'Received Emails:\n\n';
            
            
            console.log('First message:', respostaDaMensagem.result.messages[0]);

            for (const message of respostaDaMensagem.result.messages) {
                try {
                    const emailDetail = await gapi.client.gmail.users.messages.get({
                        'userId': 'me',
                        'id': message.id,
                        'format': 'full' 
                    });
                    
                    
                    console.log('Email detail:', emailDetail);
                    
                    if (emailDetail && emailDetail.result && emailDetail.result.payload) {
                        const headers = emailDetail.result.payload.headers || [];
                        const subject = headers.find(header => header.name === 'Subject')?.value || '(No subject)';
                        const from = headers.find(header => header.name === 'From')?.value || 'Unknown sender';
                        const date = headers.find(header => header.name === 'Date')?.value || 'Unknown date';
                        
                        conteudoDoEmail += `From: ${from}\n`;
                        conteudoDoEmail += `Subject: ${subject}\n`;
                        conteudoDoEmail += `Date: ${date}\n`;
                        
                        
                        let body = '(No body)';
                        if (emailDetail.result.payload.parts && emailDetail.result.payload.parts.length > 0) {
                            
                            const textPart = emailDetail.result.payload.parts.find(part => 
                                part.mimeType === 'text/plain' || part.mimeType === 'text/html');
                            
                            if (textPart && textPart.body && textPart.body.data) {
                                
                                body = atob(textPart.body.data.replace(/-/g, '+').replace(/_/g, '/'));
                                
                                body = body.substring(0, 200) + (body.length > 200 ? '...' : '');
                            }
                        } else if (emailDetail.result.payload.body && emailDetail.result.payload.body.data) {
                            
                            body = atob(emailDetail.result.payload.body.data.replace(/-/g, '+').replace(/_/g, '/'));
                            body = body.substring(0, 200) + (body.length > 200 ? '...' : '');
                        }
                        
                        conteudoDoEmail += `Body: ${body}\n`;
                    } else {
                        conteudoDoEmail += `Error: Could not access email payload\n`;
                    }
                    
                    conteudoDoEmail += `----------------------------\n\n`;
                } catch (detailError) {
                    console.error('Error fetching email details:', detailError);
                    
                    
                    if (detailError.status === 403) {
                        
                        uiManager.displayContent('Permission denied. You need to re-authenticate with additional permissions.');
                        
                        
                        authManager.revokeAndReauthenticate();
                        return; 
                    }
                    
                    conteudoDoEmail += `Error fetching email details: ${detailError ? detailError.message : 'Unknown error'}\n`;
                    conteudoDoEmail += `----------------------------\n\n`;
                }
            }
            
            uiManager.displayContent(conteudoDoEmail);

        } catch (error) {
            console.error('Error fetching emails:', error);
            uiManager.displayContent(`Error fetching emails: ${error ? error.message : 'Unknown error'}`);
        }
    }
}

const apiManager = new ApiManager();