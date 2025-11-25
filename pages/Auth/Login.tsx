/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState } from 'react';
import { UserRole } from '../../types';
import { ERPLogo, MailIcon, LockClosedIcon, EyeIcon, EyeOffIcon, VystLogo } from '../../components/shared/IconComponents';
import AboutModal from '../../components/shared/AboutModal';

interface LoginProps {
    onLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    
    // Form State
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        // Simulating API delay
        setTimeout(() => {
            // Mock Authentication Logic
            if (password === '123456') {
                if (email === 'admin@alma.sys') {
                    onLogin('admin');
                } else if (email === 'almox@alma.sys') {
                    onLogin('warehouse');
                } else if (email === 'docente@alma.sys') {
                    onLogin('professor');
                } else {
                    setError('Usuário não encontrado.');
                    setIsLoading(false);
                }
            } else {
                setError('Credenciais inválidas. Tente novamente.');
                setIsLoading(false);
            }
        }, 800);
    };

    return (
        <>
            <div className="w-full min-h-screen flex items-center justify-center font-sans p-4 relative overflow-hidden animated-gradient">
                 {/* Background Decorative Blobs */}
                <div className="absolute top-10 -left-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-50" style={{ animation: 'float 8s ease-in-out infinite' }}></div>
                <div className="absolute -bottom-10 -right-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-50" style={{ animation: 'float 10s ease-in-out infinite 1s' }}></div>
                <div className="absolute -bottom-40 left-20 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-50" style={{ animation: 'float 12s ease-in-out infinite 2s' }}></div>

                {/* Login Card */}
                <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl text-white">
                    <div className="text-center">
                        <ERPLogo className="w-16 h-16 mx-auto mb-4 text-white"/>
                        <h1 className="text-3xl font-bold">Bem-vindo(a) ao Alma</h1>
                        <p className="text-white/80 mt-2">Faça login para acessar sua conta.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                                Email Institucional
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <MailIcon className="h-5 w-5 text-gray-500" />
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu.nome@alma.sys"
                                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition placeholder:text-gray-400 text-black outline-none"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="password"className="block text-sm font-medium text-white/80 mb-1">
                                Senha
                            </label>
                            <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <LockClosedIcon className="h-5 w-5 text-gray-500" />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition placeholder:text-gray-400 text-black outline-none"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                >
                                    {showPassword ? (
                                        <EyeOffIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm p-3 rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-primary font-bold text-lg py-3 px-4 rounded-xl shadow-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-wait"
                        >
                            {isLoading ? 'Entrando...' : 'Entrar'}
                        </button>
                    </form>
                    
                     {/* Footer link */}
                    <div className="flex flex-col items-center justify-center text-xs text-white/60 pt-4 border-t border-white/10 mt-6">
                        <div className="flex items-center gap-2 mb-2">
                             <VystLogo className="w-5 h-5 opacity-70" />
                             <span className="font-medium">Vyst Ltda.</span>
                        </div>
                        <p>
                            Copyright © 2025 &bull;{' '}
                            <button onClick={() => setIsAboutModalOpen(true)} className="hover:text-white hover:underline">
                                Sobre o Alma
                            </button>
                        </p>
                    </div>
                </div>
            </div>
            <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
        </>
    );
};

export default Login;