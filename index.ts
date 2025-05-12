import express from "express";
import logger from "./src/config/logging";
import bodyParser from "body-parser";
import authMiddleware from "./src/middlewares/auth";
import userRoutes from "./src/routes/userRoutes";
import authRoutes from "./src/routes/authRoutes";

const app = express();
const port = 8080;

app.use((req, res, next)=>{
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/users', authMiddleware, userRoutes)

app.use((err: any, req: any, res: any, next: any)=>{
  logger.error(`${err.message}`);
  res.status(500).send('Something went wrong!');
})

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});