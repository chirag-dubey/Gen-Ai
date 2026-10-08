import express from 'express';
import { generate } from '../Ai/app.js';
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, welcome to ChatDPT!');
});

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  console.log(message)

  const result = await generate(message);
  res.json({message:result})
 })

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 