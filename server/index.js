import express from 'express';
import cors from 'cors';
import { generateResponse } from './services/ollama.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Get AI response
    const aiResponse = await generateResponse(message);


    res.json(aiResponse);

    console.log(res.json);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message 
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});