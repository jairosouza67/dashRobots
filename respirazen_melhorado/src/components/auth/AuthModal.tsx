import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleLogin } from './GoogleLogin';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const { signInWithEmail, signUpWithEmail, resetPassword } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        if (!displayName.trim()) {
          setError('Nome é obrigatório');
          setIsLoading(false);
          return;
        }
        await signUpWithEmail(email, password, displayName);
      }
      onClose();
      resetForm();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Digite seu email para redefinir a senha');
      return;
    }

    try {
      await resetPassword(email);
      setResetSent(true);
      setError('');
    } catch (error: any) {
      setError(error.message);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setError('');
    setResetSent(false);
    setShowPassword(false);
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {resetSent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Email Enviado!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Verifique sua caixa de entrada para redefinir sua senha.
                </p>
              </div>
              <Button
                onClick={() => setResetSent(false)}
                variant="outline"
                className="w-full"
              >
                Voltar ao Login
              </Button>
            </div>
          ) : (
            <>
              {/* Google Login */}
              <GoogleLogin onSuccess={onClose} />

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                    ou continue com email
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-gray-700 dark:text-gray-300">
                      Nome completo
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="displayName"
                        type="text"
                        placeholder="Seu nome"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="pl-10"
                        required={!isLogin}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={isLogin ? 'Sua senha' : 'Mínimo 6 caracteres'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                      minLength={isLogin ? undefined : 6}
                    />
                    <Button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
                </Button>

                {isLogin && (
                  <Button
                    type="button"
                    onClick={handleForgotPassword}
                    variant="ghost"
                    className="w-full text-blue-600 hover:text-blue-700"
                  >
                    Esqueci minha senha
                  </Button>
                )}
              </form>

              {/* Toggle Mode */}
              <div className="text-center pt-4 border-t dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                  <Button
                    onClick={toggleMode}
                    variant="ghost"
                    className="ml-1 text-blue-600 hover:text-blue-700 p-0 h-auto font-medium"
                  >
                    {isLogin ? 'Criar conta' : 'Fazer login'}
                  </Button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};