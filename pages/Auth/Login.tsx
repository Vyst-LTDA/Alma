/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState } from 'react';
import { UserRole } from '../../types';
import { ERPLogo, MailIcon, LockClosedIcon, EyeIcon, EyeOffIcon } from '../../components/shared/IconComponents';
import AboutModal from '../../components/shared/AboutModal';

interface LoginProps {
    onLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

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
                        <p className="text-white/80 mt-2">Acesse sua conta para continuar.</p>
                    </div>

                    <form className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                                Email Institucional
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <MailIcon className="h-5 w-5 text-white/60" />
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="seu.nome@instituicao.edu"
                                    className="w-full pl-10 pr-3 py-2.5 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/80 focus:border-white/80 transition placeholder:text-white/60"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-white/80 mb-1">
                                Senha
                            </label>
                            <div className="relative">
                                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <LockClosedIcon className="h-5 w-5 text-white/60" />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-2.5 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-white/80 focus:border-white/80 transition placeholder:text-white/60"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                >
                                    {showPassword ? (
                                        <EyeOffIcon className="h-5 w-5 text-white/60" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-white/60" />
                                    )}
                                </button>
                            </div>
                        </div>
                         <div className="flex items-center justify-between">
                            <a href="#" className="text-sm text-white/80 hover:underline font-medium">
                                Esqueceu a senha?
                            </a>
                        </div>
                        <button
                            type="submit"
                            onClick={(e) => { e.preventDefault(); onLogin('professor'); }}
                            className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Entrar
                        </button>
                    </form>
                    
                     {/* Footer link */}
                    <div className="text-center text-xs text-white/60 pt-4">
                        <p>
                            Copyright © 2025, Vyst Ltda. &bull;{' '}
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