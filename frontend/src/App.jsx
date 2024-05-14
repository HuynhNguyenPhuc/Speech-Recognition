import { useState } from 'react';
import { useSpeechRecognition } from 'react-speech-kit';
import axios from 'axios';
import { Box, Button, Container, TextField, Typography, CircularProgress } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

function App() {
  const [value, setValue] = useState('');
  const [result, setResult] = useState(null);
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      setValue(result);
    },
  });

  const handleStop = async () => {
    stop();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/process', {
        sentence: value,
      });
      console.log('Response:', response.data);
      setResult(response.data.command);
    } catch (error) {
      console.error('Error sending text to backend:', error);
    }
  };

  return (
    <Container maxWidth="sm" style={{ margin: 'auto 0' }}>
      <Typography variant="h4" align="center" gutterBottom>
        Speech to Text
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Your text will appear here..."
          margin="normal"
        />
        <Box display="flex" justifyContent="center" alignItems="center" marginY={2}>
          <Button
            variant="contained"
            color="primary"
            onMouseDown={listen}
            startIcon={<MicIcon />}
            disabled={listening}
          >
            {listening ? 'Listening...' : 'Start Listening'}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleStop}
            startIcon={<StopIcon />}
            disabled={!listening}
            style={{ marginLeft: '1rem' }}
          >
            Stop
          </Button>
        </Box>
        {listening && (
          <Box display="flex" justifyContent="center" alignItems="center" marginY={2}>
            <CircularProgress />
            <Typography variant="body1" marginLeft={2}>
              Go ahead, I'm listening
            </Typography>
          </Box>
        )}
        {result && (
          <Box marginTop={2}>
            <Typography variant="h6">Processed Result:</Typography>
            <Typography variant="body1">{result}</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default App;