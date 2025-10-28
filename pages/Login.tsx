/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState } from 'react';
import { UserRole } from '../types';
import { CQRSFlowIcon, MailIcon, LockClosedIcon, EyeIcon, EyeOffIcon } from '../components/icons/IconComponents';

interface LoginProps {
    onLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-light-bg font-sans">
            <div className="relative w-full max-w-5xl mx-auto flex bg-light-card shadow-2xl rounded-2xl overflow-hidden h-[700px]">
                {/* Left Panel - Visual Branding */}
                <div className="hidden lg:flex w-1/2 relative items-center justify-center p-12 bg-primary text-white"
                     style={{ backgroundImage: 'url(https://picsum.photos/seed/warehouse/800/1200)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <div className="absolute inset-0 bg-primary opacity-80"></div>
                    <div className="relative z-10 text-center">
                        <CQRSFlowIcon className="w-16 h-16 mx-auto mb-6 text-white" />
                        <h1 className="text-4xl font-bold mb-4">Almoxarifado Educacional</h1>
                        <p className="text-lg font-light max-w-md mx-auto">
                            Eficiência e organização para o futuro da logística.
                        </p>
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold text-dark-text mb-2">Acesse sua Conta</h2>
                    <p className="text-light-text mb-8">Bem-vindo(a) de volta!</p>

                    <form className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-dark-text mb-1">
                                E-mail Institucional
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <MailIcon className="h-5 w-5 text-gray-400" />
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="seu.nome@instituicao.edu"
                                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password"className="block text-sm font-medium text-dark-text mb-1">
                                Senha
                            </label>
                            <div className="relative">
                                 <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                >
                                    {showPassword ? (
                                        <EyeOffIcon className="h-5 w-5 text-gray-500" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-500" />
                                    )}
                                </button>
                            </div>
                        </div>
                         <div className="flex items-center justify-between">
                            <a href="#" className="text-sm text-primary hover:underline font-medium">
                                Esqueceu a senha?
                            </a>
                        </div>
                        <button
                            type="submit"
                            onClick={(e) => { e.preventDefault(); onLogin('warehouse'); }} // Simula login para o almoxarifado por padrão
                            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/30 transition-transform transform hover:scale-105"
                        >
                            Entrar
                        </button>
                    </form>
                    
                    {/* Test Mode Section */}
                    <div className="mt-8 text-center">
                        <div className="relative my-4">
                           <div className="absolute inset-0 flex items-center">
                               <div className="w-full border-t border-gray-300"></div>
                           </div>
                           <div className="relative flex justify-center text-sm">
                               <span className="px-2 bg-light-card text-light-text">Modo de Teste</span>
                           </div>
                        </div>
                        <p className="text-sm text-light-text mb-4">Acesse rapidamente usando um perfil pré-definido.</p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button onClick={() => onLogin('professor')} className="flex-1 text-sm bg-gray-200 text-dark-text font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition">
                                Docente
                            </button>
                            <button onClick={() => onLogin('warehouse')} className="flex-1 text-sm bg-gray-200 text-dark-text font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition">
                                Almoxarifado
                            </button>
                            <button onClick={() => onLogin('admin')} className="flex-1 text-sm bg-gray-200 text-dark-text font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition">
                                Administrador
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;