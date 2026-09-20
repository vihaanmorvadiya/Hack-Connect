import express from 'express'
import cors from 'cors'
import { connectDB } from './db.js'
import userRoutes from "./routes/userRoutes.js"

const app = express();

await connectDB();
app.use(express.json());
const port = 3000


app.use(cors({
  origin: 'http://localhost:5173'
}));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/test', (req, res) => {
  res.json({ message: 'API WORKING!' })
})

app.use("/api/users",userRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})