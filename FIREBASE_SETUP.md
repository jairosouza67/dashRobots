# CONFIGURAÇÃO DO FIREBASE

Para usar o sistema de autenticação, você precisa configurar um projeto Firebase:

## 1. Criar projeto Firebase:
- Acesse https://console.firebase.google.com/
- Clique em "Adicionar projeto"
- Digite o nome "RespiraZen" (ou outro de sua escolha)
- Desative o Google Analytics (opcional)
- Clique em "Criar projeto"

## 2. Configurar Authentication:
- No painel do Firebase, vá em "Authentication"
- Clique em "Começar"
- Na aba "Sign-in method", ative:
  - Email/Password
  - Google (configure com suas credenciais)

## 3. Configurar Firestore:
- No painel do Firebase, vá em "Firestore Database"
- Clique em "Criar banco de dados"
- Escolha "Começar no modo de teste"
- Selecione a localização mais próxima

## 4. Obter credenciais:
- No painel do Firebase, clique no ícone de engrenagem → "Configurações do projeto"
- Role até "Seus aplicativos" e clique em "Web" (ícone </>)
- Registre o app com nome "RespiraZen"
- Copie as credenciais do firebaseConfig

## 5. Configurar variáveis de ambiente:
- Copie o arquivo `.env.example` para `.env`
- Preencha com suas credenciais do Firebase:

```
VITE_FIREBASE_API_KEY=sua_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com  
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

## 6. Regras de segurança do Firestore:
Substitua as regras padrão por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios podem ler/escrever apenas seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /progress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Depois de configurar tudo, reinicie o servidor de desenvolvimento:
```bash
npm run dev
```