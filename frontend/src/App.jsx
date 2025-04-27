  import { useState } from 'react';
  import axios from 'axios';
  import { 
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Container,
    CssBaseline,
    Link,
    Paper,
    TextField,
    Typography,
    ThemeProvider,
    createTheme
  } from '@mui/material';
  import SearchIcon from '@mui/icons-material/Search';
  import AutoStoriesIcon from '@mui/icons-material/AutoStories';

  const theme = createTheme({
    palette: {
      primary: {
        main: '#3f51b5',
      },
      secondary: {
        main: '#f50057',
      },
      background: {
        default: '#f5f7fa',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
      },
      h2: {
        fontWeight: 600,
        fontSize: '1.8rem',
      },
    },
  });

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
        const response = await axios.get(`https://webcite-71wh.onrender.com/api/search?q=${inputId}`);
        setCitationData(response.data);
      } catch (err) {
        setError('Failed to fetch data. Make to enter a valid DOI.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AutoStoriesIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h1" component="h1" color="primary">
                WebCite
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TextField
                fullWidth
                variant="outlined"
                label="Enter DOI"
                value={inputId}
                onChange={(e) => setInputId(e.target.value)}
                sx={{ mr: 2 }}
                InputProps={{
                  style: {
                    borderRadius: 8,
                  },
                }}
              />
              <Button
                variant="contained"
                size="large"
                onClick={handleFetch}
                disabled={loading || !inputId}
                startIcon={<SearchIcon />}
                sx={{
                  borderRadius: 8,
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </Box>

            {error && (
              <Box sx={{ 
                backgroundColor: 'error.light', 
                color: 'error.contrastText',
                p: 2,
                borderRadius: 2,
                mb: 3,
              }}>
                <Typography>{error}</Typography>
              </Box>
            )}

            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress color="primary" size={60} />
              </Box>
            )}
          </Paper>

          {citationData && (
            <Box>
              <Typography variant="h2" component="h2" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
                Citation Results
              </Typography>

              {citationData.map((citation, index) => (
                <Card key={index} sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                      {citation.title}
                    </Typography>

                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      <strong style={{ color: theme.palette.primary.main }}>Authors:</strong> {citation.authors?.join(', ')}
                    </Typography>

                    {citation.doi && (
                      <Typography variant="body1" color="text.secondary">
                        <strong style={{ color: theme.palette.primary.main }}>DOI:</strong>{' '}
                        <Link 
                          href={citation.doi} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          color="secondary"
                          sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                        >
                          {citation.doi}
                        </Link>
                      </Typography>
                    )}

                    {citation.abstract && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                          {citation.abstract.substring(0, 200)}...
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Container>
      </ThemeProvider>
    );
  }

  export default App;