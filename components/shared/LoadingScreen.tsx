import React, { useState, useEffect } from 'react';
import { ERPLogo } from './IconComponents';

const LoadingScreen: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 1;
            });
        }, 25); 

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full min-h-screen flex items-center justify-center font-sans p-4 relative overflow-hidden animated-gradient">
            <div className="relative z-10 w-full max-w-sm text-center">
                <ERPLogo className="w-24 h-24 mx-auto mb-8 animate-pulse" />
                <div className="w-full bg-white/20 rounded-full h-2.5">
                    <div 
                        className="bg-white h-2.5 rounded-full transition-all duration-150 ease-linear" 
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p className="text-white/80 mt-4 text-sm font-medium">Inicializando sistema...</p>
            </div>
            <p className="absolute bottom-10 text-white/70 text-lg tracking-widest font-sans">
                by Vyst Ltda.
            </p>
        </div>
    );
};

export default LoadingScreen;