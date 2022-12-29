import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// Creating an instance
const openai = new OpenAIApi(configuration);

// Initialise the express
const app = express();
// Config midlewares
app.use(cors());
// Allow to pass json from frontend to backend
app.use(express.json());

// Dummy route
// Reciever of lot of data from frontend
app.get('/', async (req, res) => {
  res.status(200).send({
    message: "Hello World",
  });
});

// But post allow us to have a body or payload
app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt:`${prompt}`,
      temperature: 0,
      max_tokens: 3000,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).send({
        bot: response.data.choices[0].text
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({error})
  }
});

app.listen(3000, () => console.log('server is running on port http://localhost:3000'))
