import { useState } from 'react';
import axios from 'axios';

function App() {
  const [inputId, setInputId] = useState('');
  const [citationData, setCitationData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    setError('');
    setCitationData(null);

    try {
      const response = await axios.get(`https://webcite-hackdartmouth-4995e6597c1a.herokuapp.com/api/search?q=${inputId}`);
      setCitationData(response.data);
    } catch (err) {
      setError('Failed to fetch data. Make sure the DOI is valid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center' }}>WebCite</h1>

      <div style={{ display: 'flex', marginBottom: '2rem', justifyContent: 'center' }}>
        <input
          type="text"
          placeholder="Enter DOI"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
          style={{ padding: '0.75rem', width: '400px', borderRadius: '8px', border: '1px solid #ccc', marginRight: '1rem' }}
        />
        <button
          onClick={handleFetch}
          style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', backgroundColor: '#007bff', color: 'white', border: 'none' }}
        >
          {loading ? 'Loading...' : 'Fetch'}
        </button>
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {citationData && (
        <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>References</h2>

          {citationData.map((citation, index) => (
            <div key={index} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #ddd', paddingBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{citation.title}</h3>

              <p><strong>Authors:</strong> {citation.authors?.join(', ')}</p>

              <p><strong>DOI:</strong> <a href={citation.doi} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>{citation.doi}</a></p>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}

export default App;
