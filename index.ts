import express from "express";
import logger from "./src/config/logging";
import bodyParser from "body-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/documentation/swagger";
import authMiddleware from "./src/middlewares/auth";
import userRoutes from "./src/routes/userRoutes";
import authRoutes from "./src/routes/authRoutes";

const app = express();
const port = process.env.PORT;

app.use((req, res, next)=>{
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(cors())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', authRoutes);
app.use('/api/users', authMiddleware, userRoutes)

app.use((err: any, req: any, res: any, next: any)=>{
  logger.error(`${err.message}`);
  res.status(500).send('Something went wrong!');
})

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});