import express from "express";
import logger from "./src/config/logging";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/documentation/swagger";
import authMiddleware from "./src/middlewares/auth";
import userRoutes from "./src/routes/userRoutes";
import companyRouter from "./src/routes/companyRoutes";
import authRoutes from "./src/routes/authRoutes";
import clientRoutes from "./src/routes/clientRoutes";
import paymentRoutes from "./src/routes/paymentRoutes";
import taskRoutes from "./src/routes/taskRoutes";
import templateRoutes from "./src/routes/templateRoutes";
import invoiceRoutes from "./src/routes/invoiceRoutes";
import invoiceItemRoutes from "./src/routes/invoiceItemRoutes";
import reminderRoutes from "./src/routes/reminderRoutes";
import subscriptionPlanRoutes from "./src/routes/subscriptionRoutes";
import walletRoutes from "./src/routes/walletRoutes";

const app = express();
const port = process.env.PORT;

app.use((req, res, next)=>{
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', authRoutes);
app.use('/api/users', authMiddleware, userRoutes)
app.use('/api/companies', authMiddleware, companyRouter)
app.use('/api/clients', authMiddleware, clientRoutes)
app.use('/api/payments', authMiddleware, paymentRoutes)
app.use('/api/tasks', authMiddleware, taskRoutes)
app.use('/api/templates', authMiddleware, templateRoutes);
app.use('/api/invoices', authMiddleware, invoiceRoutes);
app.use('/api/invoice-items', authMiddleware, invoiceItemRoutes);
app.use('/api/reminder-schedules', authMiddleware, reminderRoutes);
app.use('/api/subscriptions-plans', authMiddleware, subscriptionPlanRoutes)
app.use('/api/wallets', authMiddleware, walletRoutes);

app.use((err: any, req: any, res: any, next: any)=>{
  logger.error(`${err.message}`);
  res.status(500).send('Something went wrong!');
})

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});