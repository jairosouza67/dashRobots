# 🔒 Instruções de Segurança - Firebase

## ⚠️ AÇÃO URGENTE NECESSÁRIA

As credenciais do Firebase foram expostas no repositório Git. Para resolver:

### 1. Revogar Credenciais Antigas

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Selecione o projeto `respirazen1`
3. Vá em **Configurações do Projeto** (⚙️)
4. Na aba **Geral**, role até **Seus aplicativos**
5. Clique no app web existente
6. **Delete o app atual** e crie um novo
7. Copie as novas credenciais

### 2. Configurar Novas Credenciais

1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` com as novas credenciais:
   ```
   VITE_FIREBASE_API_KEY=sua_nova_api_key
   VITE_FIREBASE_AUTH_DOMAIN=respirazen1.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=respirazen1
   VITE_FIREBASE_STORAGE_BUCKET=respirazen1.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=seu_novo_sender_id
   VITE_FIREBASE_APP_ID=seu_novo_app_id
   ```

### 3. Verificar Segurança

- ✅ `.env` está no `.gitignore`
- ✅ Credenciais antigas foram revogadas
- ✅ Novas credenciais configuradas
- ✅ App funcionando

### 4. Regras para o Futuro

- **NUNCA** commite arquivos `.env`
- **SEMPRE** use `.env.example` como template
- **ROTACIONE** credenciais se expostas
- **MONITORE** alertas de segurança do GitHub

## 📝 Checklist de Resolução

- [ ] Acessei o Firebase Console
- [ ] Deletei o app antigo
- [ ] Criei novo app com novas credenciais
- [ ] Atualizei o arquivo `.env` local
- [ ] Testei se o app funciona
- [ ] Resolvi o alerta no GitHub