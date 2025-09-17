# 🚀 Guia de Deploy - RespiraZen

## 🔧 Configuração de Variáveis de Ambiente

Para o app funcionar na nuvem, você precisa configurar estas variáveis de ambiente na sua plataforma de deploy:

### Variáveis Obrigatórias:

```bash
VITE_FIREBASE_API_KEY=AIzaSyC4pT4VOlILHbiL9-96J12FVsmjMCfPAQI
VITE_FIREBASE_AUTH_DOMAIN=respirazen1.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=respirazen1
VITE_FIREBASE_STORAGE_BUCKET=respirazen1.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=605899344642
VITE_FIREBASE_APP_ID=1:605899344642:web:935379ab245ab3cf7f901b
```

## 📦 Plataformas de Deploy Suportadas

### 🔸 Netlify
1. Vá para **Site settings → Environment variables**
2. Adicione cada variável acima
3. Faça novo deploy

### 🔸 Vercel
1. Vá para **Project → Settings → Environment Variables**
2. Adicione cada variável acima
3. Faça novo deploy

### 🔸 Lovable (se usando)
1. Vá para **Project Settings → Environment**
2. Adicione as variáveis
3. Redeploy

### 🔸 Firebase Hosting
```bash
npm run build
firebase deploy
```

## 🐛 Problemas Comuns

### Tela Branca:
- ✅ **Variáveis de ambiente configuradas?**
- ✅ **Build sem erros?** (`npm run build`)
- ✅ **Console do navegador tem erros?**

### Autenticação não funciona:
- ✅ **Firebase configurado para o domínio correto?**
- ✅ **Authorized domains incluem seu domínio?**

## ⚙️ Firebase Configuration

No [Firebase Console](https://console.firebase.google.com):

1. **Authentication → Settings → Authorized domains**
   - Adicione seu domínio de produção
   - Ex: `seu-app.netlify.app`

2. **Project Settings → General**
   - Verifique se as credenciais estão corretas

## 📋 Checklist de Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Build funciona localmente (`npm run build`)
- [ ] Domínio autorizado no Firebase
- [ ] Deploy realizado
- [ ] App funcionando na URL de produção

## 🔍 Debug

Se ainda der tela branca:

1. **Abra Console do navegador** (F12)
2. **Procure por erros** na aba Console
3. **Verifique Network** se recursos carregam
4. **Teste localmente** com `npm run preview` após build