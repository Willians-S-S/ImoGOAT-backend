import express from 'express';
import cors from 'cors';
// import routes from './routes';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); 
app.use(express.json());
// app.use(routes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
