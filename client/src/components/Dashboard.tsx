import React from 'react';

const Dashboard = () => {
    return (
        <div style={{ width: '100%', height: '800px' }}>
            <iframe
                title="Power BI Dashboard"
                width="100%"
                height="100%"
                src="https://app.powerbi.com/groups/me/reports/419c49b4-9541-4fad-b7c4-afa008d29fd4/74e10b007580064071e9?experience=power-bi"
                allowFullScreen={true}
            ></iframe>
        </div>
    );
};

export default Dashboard;
