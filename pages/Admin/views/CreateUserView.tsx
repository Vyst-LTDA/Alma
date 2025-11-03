/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState } from 'react';
import { UserRole, Contact } from '../../../types';
import { mockUsers } from '../../../data/mockData';
import { EyeIcon, EyeOffIcon, ArrowPathIcon, CheckCircleIcon, UserPlusIcon, InfoIcon } from '../../../components/shared/IconComponents';

interface CreateUserViewProps {
  onUserCreated: (notification: any) => void;
  creatableRoles: UserRole[];
}

const CreateUserView: React.FC<CreateUserViewProps> = ({ onUserCreated, creatableRoles }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(creatableRoles[0] || 'professor');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const roleOptions: { [key in UserRole]?: string } = {
    professor: 'Docente',
    warehouse: 'Almoxarifado',
    admin: 'Administrador',
  };

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let newPassword = '';
    for (let i = 0; i < 12; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    setTimeout(() => {
      const newUser: Contact = {
        id: `user-${Date.now()}`,
        name: name,
        avatar: `https://i.pravatar.cc/150?u=${email}`,
        role: role,
        email: email,
      };
      // In a real app, this would be an API call
      mockUsers.push(newUser);
      
      onUserCreated({
        id: Date.now(),
        icon: <UserPlusIcon className="w-5 h-5 text-blue-500" />,
        text: `Convite enviado para ${email}. Aguardando confirmação.`,
        time: "Agora"
      });

      setStatus('sent');

      // Simulate user response after a delay
      setTimeout(() => {
        const accepted = Math.random() > 0.2; // 80% chance of accepting
        const responseText = accepted 
          ? `${name} aceitou o convite e ativou a conta.`
          : `${name} recusou o convite.`;
        
        onUserCreated({
          id: Date.now() + 1,
          icon: <InfoIcon className={`w-5 h-5 ${accepted ? 'text-green-500' : 'text-red-500'}`} />,
          text: responseText,
          time: "Agora"
        });
      }, 15000); // 15 seconds delay

    }, 1500); // simulate network delay
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole(creatableRoles[0] || 'professor');
    setStatus('idle');
  }

  if (status === 'sent') {
    return (
        <div>
            <h2 className="text-2xl font-bold text-dark-text mb-6">Criar Conta de Usuário</h2>
            <div className="bg-light-card p-8 rounded-xl border border-gray-200 text-center">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-dark-text">Convite Enviado!</h3>
                <p className="text-light-text mt-2 mb-6">O usuário {name} receberá um e-mail com as instruções para acessar o sistema. Você será notificado quando ele(a) confirmar o convite.</p>
                <button onClick={resetForm} className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-transform transform hover:scale-105">
                    Criar Outro Usuário
                </button>
            </div>
        </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-dark-text mb-6">Criar Conta de Usuário</h2>
      <div className="bg-light-card p-8 rounded-xl border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-dark-text mb-1">Nome Completo</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-dark-text mb-1">E-mail Institucional</label>
              <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
            </div>
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-dark-text mb-1">Senha</label>
            <div className="relative">
                <input type={showPassword ? "text" : "password"} id="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full pr-20 py-2.5 pl-3 bg-white text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition" />
                <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-1.5 text-gray-500 hover:text-dark-text" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                        {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                    <button type="button" onClick={generatePassword} className="p-1.5 text-gray-500 hover:text-dark-text" aria-label="Gerar senha aleatória">
                        <ArrowPathIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
          </div>
          <div>
              <label htmlFor="role" className="block text-sm font-medium text-dark-text mb-1">Perfil de Acesso</label>
              <select id="role" value={role} onChange={e => setRole(e.target.value as UserRole)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white text-black">
                  {creatableRoles.map(creatableRole => (
                      <option key={creatableRole} value={creatableRole}>
                          {roleOptions[creatableRole]}
                      </option>
                  ))}
              </select>
          </div>
          <div className="flex justify-end pt-4 border-t">
              <button type="submit" disabled={status === 'sending'} className="w-full md:w-auto bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/30 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:scale-100 disabled:cursor-wait">
                {status === 'sending' ? 'Enviando...' : 'Criar Conta e Enviar Convite'}
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserView;
