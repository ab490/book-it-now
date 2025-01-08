const Dashboard = () => {
    return (
        <div style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
            <h1>Visualizations Dashboard</h1>
            <iframe
                title="Power BI Dashboard"
                width="600"
                height="373.5"
                src="https://app.powerbi.com/view?r=eyJrIjoiMGYyZGRiMWItMTQwNC00Y2NmLTkyNTctOTcyYjhmOGZkOTIwIiwidCI6IjExMTNiZTM0LWFlZDEtNGQwMC1hYjRiLWNkZDAyNTEwYmU5MSIsImMiOjN9"
                frameBorder="0"
                allowFullScreen={true}
                style={{ border: 'none' }}
            ></iframe>
        </div>
    );
};

export default Dashboard;
