import React, { useState } from 'react';
import { UserRole } from '../../types';
import { FileTextIcon, ExclamationTriangleIcon } from '../shared/IconComponents';

const announcementCategories = {
    'Normal': { urgency: 'low', color: 'blue' },
    'Pouco urgente': { urgency: 'medium', color: 'yellow' },
    'Urgente': { urgency: 'high', color: 'orange' },
    'Muito urgente': { urgency: 'high', color: 'red' },
} as const;

type AnnouncementCategory = keyof typeof announcementCategories;

interface Announcement {
    id: number;
    category: AnnouncementCategory;
    color: string;
    title: string;
    author: string;
    date: string;
    content: string;
    urgency: 'high' | 'medium' | 'low';
}


const mockAnnouncements: Announcement[] = [
    {
        id: 1,
        category: 'Muito urgente',
        color: 'red',
        title: 'Manutenção Crítica do Servidor',
        author: 'Admin',
        date: 'dd/mm/aaaa',
        content: 'Haverá uma interrupção de serviço hoje à noite para uma manutenção de emergência.',
        urgency: 'high',
    },
    {
        id: 2,
        category: 'Urgente',
        color: 'orange',
        title: 'Atualização de Inventário',
        author: 'Usuário comum',
        date: 'dd/mm/aaaa',
        content: 'O inventário de materiais de escritório será atualizado amanhã. Pedidos podem sofrer atrasos.',
        urgency: 'high',
    },
    {
        id: 3,
        category: 'Pouco urgente',
        color: 'yellow',
        title: 'Nova Política de Requisições',
        author: 'Admin',
        date: 'dd/mm/aaaa',
        content: 'Uma nova política para requisição de itens eletrônicos entrará em vigor na próxima semana.',
        urgency: 'medium',
    },
    {
        id: 4,
        category: 'Normal',
        color: 'blue',
        title: 'Horário de Fim de Ano',
        author: 'Admin',
        date: 'dd/mm/aaaa',
        content: 'O almoxarifado funcionará em horário reduzido durante as festas de fim de ano.',
        urgency: 'low',
    },
];

const CategoryTag: React.FC<{category: string, color: string}> = ({ category, color }) => {
    const colorClasses: {[key: string]: string} = {
        blue: 'bg-blue-100 text-blue-800',
        yellow: 'bg-yellow-100 text-yellow-800',
        orange: 'bg-orange-100 text-orange-800',
        red: 'bg-red-100 text-red-800',
    }
    return (
        <span className={`px-2 py-1 text-xs font-bold rounded ${colorClasses[color] || 'bg-gray-100 text-gray-800'}`}>
            {category}
        </span>
    )
}

const AnnouncementCard: React.FC<Announcement> = ({ category, color, title, author, date, content, urgency }) => {
    const urgencyClasses = {
        high: 'border-l-4 border-red-500',
        medium: 'border-l-4 border-yellow-500',
        low: 'border-l-4 border-gray-300',
    }
    const urgencyIcon = {
        high: <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />,
        medium: <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" />,
        low: null
    }

    return (
        <div className={`bg-white p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow ${urgencyClasses[urgency]}`}>
            <div className="flex justify-between items-start mb-2">
                <CategoryTag category={category} color={color} />
                <span className="text-xs text-light-text">{date}</span>
            </div>
            <h3 className="text-lg font-bold text-dark-text mb-2 flex items-center">
                {urgencyIcon[urgency]}
                <span>{title}</span>
            </h3>
            <p className="text-sm text-dark-text mb-3">{content}</p>
            <p className="text-xs font-semibold text-light-text">Publicado por: {author}</p>
        </div>
    )
}

const NewAnnouncementModal: React.FC<{isOpen: boolean, onClose: () => void, onAdd: (data: any) => void}> = ({ isOpen, onClose, onAdd }) => {
    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get('title'),
            category: formData.get('category'),
            content: formData.get('content'),
        };
        onAdd(data);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-light-card w-full max-w-lg rounded-xl shadow-xl p-6" onClick={e => e.stopPropagation()}>
                 <h2 className="text-xl font-bold text-dark-text mb-4">Nova Publicação</h2>
                 <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                         <label htmlFor="title" className="block text-sm font-medium text-dark-text mb-1">Título</label>
                         <input type="text" id="title" name="title" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"/>
                     </div>
                     <div>
                         <label htmlFor="category" className="block text-sm font-medium text-dark-text mb-1">Categoria</label>
                         <select id="category" name="category" defaultValue="Normal" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary bg-white">
                            {(Object.keys(announcementCategories) as AnnouncementCategory[]).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                         </select>
                     </div>
                     <div>
                         <label htmlFor="content" className="block text-sm font-medium text-dark-text mb-1">Conteúdo</label>
                         <textarea id="content" name="content" rows={4} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"></textarea>
                     </div>
                     <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-dark-text font-semibold rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90">Publicar</button>
                     </div>
                 </form>
            </div>
        </div>
    )
}

interface AnnouncementsProps {
    userRole: UserRole;
}

const Announcements: React.FC<AnnouncementsProps> = ({ userRole }) => {
    const urgencyOrder = { high: 0, medium: 1, low: 2 };
    const [announcements, setAnnouncements] = useState(() => 
        [...mockAnnouncements].sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency])
    );
    const [isModalOpen, setIsModalOpen] = useState(false);
    const canPost = userRole === 'admin';

    const handleAddAnnouncement = (newAnnouncementData: { title: string, category: AnnouncementCategory, content: string }) => {
        const { category } = newAnnouncementData;
        const categoryProps = announcementCategories[category];

        if (!categoryProps) return;
        
        const newAnnouncement: Announcement = {
            id: Date.now(),
            author: userRole === 'admin' ? 'Admin' : 'Usuário comum',
            date: new Date().toLocaleDateString('pt-BR'),
            color: categoryProps.color,
            urgency: categoryProps.urgency,
            title: newAnnouncementData.title as string,
            category: newAnnouncementData.category,
            content: newAnnouncementData.content as string
        }
        setAnnouncements(prev => [newAnnouncement, ...prev].sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]));
        setIsModalOpen(false);
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-dark-text">Mural de Avisos</h3>
                {canPost && (
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-primary text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-primary/90 transition-all">
                        <FileTextIcon className="w-4 h-4 mr-2"/>
                        Nova Publicação
                    </button>
                )}
            </div>
            <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                {announcements.map(ann => <AnnouncementCard key={ann.id} {...ann} />)}
            </div>
            <NewAnnouncementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddAnnouncement} />
        </div>
    );
}

export default Announcements;