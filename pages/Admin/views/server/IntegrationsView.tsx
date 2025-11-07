import React from 'react';
import ApiKeysCard from '../../components/server/ApiKeysCard';
import WebhooksCard from '../../components/server/WebhooksCard';
import SwaggerCard from '../../components/server/SwaggerCard';

// --- Main View ---
const IntegrationsView: React.FC = () => {
    return (
        <div className="h-full flex flex-col gap-8">
            <SwaggerCard />
            <ApiKeysCard />
            <WebhooksCard />
        </div>
    );
};

export default IntegrationsView;