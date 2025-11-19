/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { UserRole, Contact, Message, UserData, UserDto } from '../../types';
import { SearchIcon, PlusIcon, UsersIcon, ChartBarIcon } from '../shared/IconComponents';
import { getUsers } from '../../services/apiService';

const initialConversations: { [key: string]: Message[] } = {
    'warehouse_main': [
        { id: 'msg1', senderId: 'warehouse_main', text: 'Texto de exemplo de mensagem.', timestamp: 'hh:mm' },
    ],
    'admin_main': [
        { id: 'msg3', senderId: 'admin_main', text: 'Texto de exemplo de mensagem.', timestamp: 'hh:mm' },
    ]
};

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (details: { name: string, memberEmails: string[] }) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [emails, setEmails] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const memberEmails = emails.split(/[,;\s]+/).filter(email => email.trim() !== '');
        if (!name || memberEmails.length === 0) {
            alert('Por favor, forneça um nome para o grupo e pelo menos um e-mail.');
            return;
        }
        onCreate({ name, memberEmails });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-light-card w-full max-w-lg rounded-xl shadow-xl p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-dark-text mb-4">Criar um espaço de equipe</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="groupName" className="block text-sm font-medium text-dark-text mb-1">Nome do grupo</label>
                        <input type="text" id="groupName" value={name} onChange={e => setName(e.target.value)} required className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" />
                    </div>
                    <div>
                        <label htmlFor="memberEmails" className="block text-sm font-medium text-dark-text mb-1">E-mails dos participantes</label>
                        <textarea id="memberEmails" value={emails} onChange={e => setEmails(e.target.value)} rows={4} required className="w-full px-3 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" placeholder="Separe os e-mails por vírgula, ponto e vírgula ou espaço"></textarea>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-dark-text font-semibold rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90">Criar Grupo</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// FIX: Added 'professor' role and corrected 'warehouse' role name for consistency.
const roleDisplayMap: Record<UserRole, string> = {
    'admin': 'Administrador',
    'warehouse': 'Almoxarifado',
    'professor': 'Docente',
};

// Main Component
interface ChatProps {
    userRole: UserRole;
    userData: UserData;
    isCreateGroupModalOpen: boolean;
    setCreateGroupModalOpen: (isOpen: boolean) => void;
}

const Chat: React.FC<ChatProps> = ({ userRole, userData, isCreateGroupModalOpen, setCreateGroupModalOpen }) => {
    const [conversations, setConversations] = useState(initialConversations);
    const [messageInput, setMessageInput] = useState('');
    const [contactSearch, setContactSearch] = useState('');
    const [searchStatus, setSearchStatus] = useState('');

    const [userContacts, setUserContacts] = useState<Contact[]>([]);
    const [allUsers, setAllUsers] = useState<Contact[]>([]);
    const [loadingContacts, setLoadingContacts] = useState(true);
    
    const currentUser: Contact = {
        id: userData.id,
        name: 'Você',
        avatar: userData.avatar,
        role: userRole,
        email: userData.email,
    };
    
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    
    useEffect(() => {
        const fetchUsers = async () => {
            setLoadingContacts(true);
            try {
                const result = await getUsers({pageSize: 500});
                
                const mappedUsers = result.items.map((u: UserDto): Contact => ({
                    id: u.id,
                    name: u.fullName || 'Usuário',
                    email: u.email || '',
                    role: u.role?.toLowerCase() as UserRole,
                    avatar: `https://i.pravatar.cc/150?u=${u.id}`,
                }));

                setAllUsers(mappedUsers);
                setUserContacts(mappedUsers.filter(u => u.id !== currentUser.id));
                
            } catch (error) {
                console.error("Failed to fetch users:", error);
                setSearchStatus('Falha ao carregar contatos.');
            } finally {
                setLoadingContacts(false);
            }
        };
        fetchUsers();
    }, [currentUser.id]);
    
    const [activeContactId, setActiveContactId] = useState<string | undefined>(undefined);
    
    useEffect(() => {
        if (!activeContactId && userContacts.length > 0) {
             const defaultContact = userContacts[0]?.id;
             setActiveContactId(defaultContact);
        }
    }, [userContacts, activeContactId]);

    const activeContact = [...userContacts, ...allUsers.filter(u => u.isGroup)].find(u => u.id === activeContactId);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversations, activeContactId]);

    const handleCreateGroup = ({ name, memberEmails }: { name: string, memberEmails: string[] }) => {
        const members = allUsers.filter(u => u.email && memberEmails.includes(u.email));
        const foundEmails = members.map(m => m.email);
        const notFoundEmails = memberEmails.filter(email => !foundEmails.includes(email));
    
        if (notFoundEmails.length > 0) {
            alert(`Os seguintes e-mails não foram encontrados: ${notFoundEmails.join(', ')}`);
        }
        
        const memberIds = [...new Set([...members.map(m => m.id), currentUser.id])];
    
        if (memberIds.length < 2) {
          alert("Um grupo precisa de pelo menos 2 participantes (incluindo você).");
          return;
        }
    
        const newGroup: Contact = {
            id: `group-${Date.now()}`,
            name,
            avatar: '',
            isGroup: true,
            members: memberIds,
            unreadCount: 0
        };
        
        setUserContacts(prev => [newGroup, ...prev]);
        setActiveContactId(newGroup.id);
        setCreateGroupModalOpen(false);
    };
    
    const handleAddContactByEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        const email = contactSearch.trim().toLowerCase();
        if (!email) return;

        const existingContact = userContacts.find(c => c.email === email);
        if (existingContact) {
            setActiveContactId(existingContact.id);
            setContactSearch('');
            setSearchStatus('Contato já está na sua lista.');
            setTimeout(() => setSearchStatus(''), 3000);
            return;
        }
        
        try {
            const result = await getUsers({ searchTerm: email, pageSize: 1 });
            const foundUser = result.items[0];

            if (foundUser && foundUser.id !== currentUser.id) {
                const newContact: Contact = {
                    id: foundUser.id,
                    name: foundUser.fullName || 'Usuário',
                    email: foundUser.email || '',
                    role: foundUser.role?.toLowerCase() as UserRole,
                    avatar: `https://i.pravatar.cc/150?u=${foundUser.id}`,
                };
                setUserContacts(prev => [newContact, ...prev]);
                setActiveContactId(newContact.id);
                setContactSearch('');
                setSearchStatus('Contato adicionado!');
            } else {
                setSearchStatus('Usuário não encontrado ou inválido.');
            }
        } catch (error) {
            setSearchStatus('Erro ao buscar usuário.');
        } finally {
            setTimeout(() => setSearchStatus(''), 3000);
        }
    }

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (messageInput.trim() === '' || !activeContactId) return;

        const newMessage: Message = {
            id: `msg${Date.now()}`,
            senderId: currentUser.id,
            text: messageInput,
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        };

        setConversations(prev => {
            const updatedConversation = [...(prev[activeContactId] || []), newMessage];
            return { ...prev, [activeContactId]: updatedConversation };
        });

        setMessageInput('');
    };

    const handleShareDashboards = () => {
        if (!activeContactId || !activeContact?.isGroup) return;

        const shareMessage: Message = {
            id: `msg${Date.now()}`,
            senderId: currentUser.id,
            text: `${currentUser.name} compartilhou seus dashboards pessoais com o grupo.`,
            timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        };

        setConversations(prev => {
            const updatedConversation = [...(prev[activeContactId] || []), shareMessage];
            return { ...prev, [activeContactId]: updatedConversation };
        });
    };
    
    const ContactItem: React.FC<{ contact: Contact, isActive: boolean, onClick: () => void }> = ({ contact, isActive, onClick }) => (
        <button onClick={onClick} className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-colors ${isActive ? 'bg-primary/10' : 'hover:bg-gray-100'}`}>
            <div className="relative">
                {contact.isGroup ? (
                     <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <UsersIcon className="w-7 h-7 text-gray-500" />
                    </div>
                ) : (
                    <>
                        <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full bg-gray-200" />
                        <span className="absolute bottom-0 right-0 block h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                    </>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-sm ${isActive ? 'text-primary' : 'text-dark-text'}`}>{contact.name || 'Usuário'}</h4>
                <p className="text-xs text-light-text truncate">{contact.isGroup ? `Grupo • ${contact.members?.length || 0} membros` : (roleDisplayMap[contact.role!] || 'Usuário')}</p>
            </div>
            {contact.unreadCount && contact.unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0">{contact.unreadCount}</span>
            )}
        </button>
    );

    const MessageBubble: React.FC<{ message: Message, currentUser: Contact }> = ({ message, currentUser }) => {
        const isSent = message.senderId === currentUser.id;
        const sender = allUsers.find(u => u.id === message.senderId);
    
        if (!sender && !isSent) return null;
    
        const senderDisplay = isSent ? currentUser : sender!;
    
        return (
            <div className={`flex items-end gap-3 my-4 ${isSent ? 'flex-row-reverse' : ''}`}>
                <img src={senderDisplay.avatar} alt={senderDisplay.name} className="w-8 h-8 rounded-full bg-gray-200" />
                <div className={`flex flex-col ${isSent ? 'items-end' : 'items-start'}`}>
                    <div className={`p-3 rounded-xl max-w-sm ${isSent ? 'bg-primary text-white rounded-br-none' : 'bg-gray-100 text-dark-text rounded-bl-none'}`}>
                        <p className="text-sm">{message.text}</p>
                    </div>
                    <span className="text-xs text-light-text mt-1.5">{isSent ? 'Você' : senderDisplay.name} • {message.timestamp}</span>
                </div>
            </div>
        );
    };

    return (
         <div className="h-full flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4">
                    <form onSubmit={handleAddContactByEmail} className="relative flex-grow">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="email" 
                            placeholder="Buscar por e-mail..." 
                            value={contactSearch}
                            onChange={e => setContactSearch(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 bg-white text-black border border-gray-300 rounded-lg focus:ring-primary focus:border-primary" 
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-primary" aria-label="Adicionar Contato">
                            <PlusIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
                {searchStatus && <p className="text-xs text-center text-light-text mb-2">{searchStatus}</p>}

                <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-2">
                    {loadingContacts ? (
                        <div className="text-center text-light-text">Carregando contatos...</div>
                    ) : (
                        userContacts.map(contact => (
                            <ContactItem key={contact.id} contact={contact} isActive={contact.id === activeContactId} onClick={() => setActiveContactId(contact.id)} />
                        ))
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col h-full md:border-l md:border-gray-200 md:pl-6">
                 {activeContact ? (
                     <>
                        <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                            {activeContact.isGroup ? (
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                    <UsersIcon className="w-7 h-7 text-gray-500" />
                                </div>
                            ) : (
                                <img src={activeContact.avatar} alt={activeContact.name} className="w-12 h-12 rounded-full bg-gray-200" />
                            )}
                            <div>
                                <h3 className="font-bold text-lg text-dark-text">{activeContact.name || 'Usuário'}</h3>
                                {activeContact.isGroup ? (
                                    <p className="text-sm text-light-text">{activeContact.members?.length} membros</p>
                                ) : (
                                    <p className="text-sm text-green-600 font-semibold flex items-center">
                                        <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                                        Online
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex-grow overflow-y-auto py-4 pr-2 -mr-2">
                            {(conversations[activeContactId!] || []).map(msg => (
                                <MessageBubble key={msg.id} message={msg} currentUser={currentUser} />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="mt-auto pt-4">
                            <form onSubmit={handleSendMessage} className="relative">
                                <input 
                                    type="text" 
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder={activeContact.isGroup ? `Mensagem em ${activeContact.name}` : `Mensagem para ${activeContact.name || 'Usuário'}...`}
                                    className="w-full pl-4 pr-24 py-3 bg-white text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                />
                                 {activeContact?.isGroup && (
                                    <button 
                                        type="button" 
                                        onClick={handleShareDashboards}
                                        title="Compartilhar meus dashboards"
                                        className="absolute right-14 top-1/2 -translate-y-1/2 p-2 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
                                    >
                                        <ChartBarIcon className="h-5 w-5" />
                                    </button>
                                )}
                                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors disabled:bg-primary/50" disabled={!messageInput.trim()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                     </>
                 ) : (
                     <div className="flex items-center justify-center h-full text-light-text">
                        <p>Selecione um contato para iniciar uma conversa.</p>
                     </div>
                 )}
            </div>
            <CreateGroupModal isOpen={isCreateGroupModalOpen} onClose={() => setCreateGroupModalOpen(false)} onCreate={handleCreateGroup} />
        </div>
    );
};

export default Chat;