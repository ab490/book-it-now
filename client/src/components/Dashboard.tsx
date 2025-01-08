const Dashboard = () => {
    return (
        <div style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
            <h1>Visualizations Dashboard</h1>
            <iframe
                title="Power BI Dashboard"
                width="1140"
                height="541.25"
                src="https://app.powerbi.com/reportEmbed?reportId=419c49b4-9541-4fad-b7c4-afa008d29fd4&autoAuth=true&ctid=1113be34-aed1-4d00-ab4b-cdd02510be91"
                frameBorder="0"
                allowFullScreen={true}
                style={{ border: 'none' }}
            ></iframe>
        </div>
    );
};

export default Dashboard;
