import logger from "../config/logging";
import prisma from "../config/prismaClient";
import prismaError from "../errors/prismaError";
import type { ServiceResponse } from "../types/serviceResponse";
import { midtransApi } from "../utils/midtransAPI";
import crypto from "crypto";

export const sendTransaction = async (invoiceId: string): Promise<ServiceResponse> => {
  try {
    const invoice = await prisma.invoices.findFirst({where: {id: invoiceId}});

    if(!invoice) return {error: true, status: 404, message: "Invoice not found"};

    const transactionUnpaid = await prisma.transaction.findFirst({where: {order_id: invoiceId, status: "unpaid"}});
    if(transactionUnpaid) return {error: true, status: 406, message: "Cannot create duplicate transaction"};

    const transactionCreate = await prisma.transaction.create({
      data: {
        order_id: invoiceId,
        company_id: invoice.company_id,
        type: "invoice",
        net_amount: invoice.total,
        status: "unpaid",
        update_at: new Date()
      },
    });

    // Send email payment link
    return {error: false, data: transactionCreate};
  } catch (error: any) {
    logger.error(error.message);
    const errorPrisma = prismaError(error);
    if (errorPrisma?.error)
      return {
        error: true,
        status: errorPrisma.statusCode,
        message: errorPrisma.message,
      };

    return { error: true, status: 500, message: "Something wrong." };
  }
}

export const chargeTransactionService = async (
  paymentType: string,
  transactionDetails: any,
  customerDetail: any,
  amount: any
): Promise<ServiceResponse> => {
  try {
    const invoice = await prisma.invoices.findFirst({
      where: { id: transactionDetails.order_id},
    });

    if (!invoice)
      return {
        error: true,
        status: 404,
        message: "Invoice by order id not found",
      };

    if (invoice.status === "paid")
      return { error: true, status: 400, message: "Invoice already paid" };

    if (amount.net_amount !== invoice.total)
      return {
        error: true,
        status: 400,
        message: "Amount must not be different from total pay",
      };

      if(transactionDetails.gross_amount !== (amount.net_amount + amount.fee)) return {error: true, status: 400, message: "Invalid gross amount"}

    const transactionOld = await prisma.transaction.findFirst({
      where: { order_id: transactionDetails.order_id, status: "pending" },
    });

    if (transactionOld)
      return {
        error: true,
        status: 400,
        message: "Cannot charge transaction again",
      };

    const data = {
      payment_type: paymentType,
      transaction_details: transactionDetails,
      customer_details: customerDetail,
    };

    const response = await midtransApi.post("/v2/charge", data);
    const dataResponse = response.data;

    if (Number(dataResponse.status_code) !== 201)
      return {
        error: true,
        status: Number(dataResponse.status_code),
        message: response.data.status_message,
      };

    const transaction = await prisma.transaction.update({
      data: {
        gross_amount: transactionDetails.gross_amount,
        fee: amount.fee,
        status: "pending",
        payment_method: paymentType,
        update_at: new Date(),
      }, where: {order_id: transactionDetails.order_id, status: "unpaid"}
    });

    if (!transaction) {
      const cancelResponse = await cancelTransactionService(
        transactionDetails.order_id
      );
      if (cancelResponse.error)
        return { error: true, status: 500, message: "Something wrong." };

      return { error: true, status: 500, message: "Cannot create transaction" };
    }

    return { error: false, data: dataResponse };
  } catch (error: any) {
    logger.error(error.message);
    const errorPrisma = prismaError(error);
    if (errorPrisma?.error)
      return {
        error: true,
        status: errorPrisma.statusCode,
        message: errorPrisma.message,
      };

    return { error: true, status: 500, message: "Something wrong" };
  }
};

export const cancelSendInvoice = async (orderId: string): Promise<ServiceResponse> => {
  try {
    const invoice = await prisma.invoices.findFirst({where: {id: orderId}});
    if(!invoice) return {error: true, status: 404, message: "Invoice not found"};
    if(invoice.status === "paid") return {error: true, status: 406, message: "Invoice already paid"};

    const transaction = await prisma.transaction.findFirst({where: {order_id: invoice.id, status: "unpaid"}});
    if(!transaction) return {error: true, status: 404, message: "Transaction not found"};

    const transactionToUpdate = await prisma.transaction.update({where: {order_id: orderId, status: "cancelled"}, data:{status: "cancelled", update_at: new Date()}});

    return {error: false, data: null};
  } catch (error: any) {
    logger.error(error.message);
    const errorPrisma = prismaError(error);
    if (errorPrisma?.error)
      return {
        error: true,
        status: errorPrisma.statusCode,
        message: errorPrisma.message,
      };

    return { error: true, status: 500, message: "Something wrong" };
  }
}

export const cancelTransactionService = async (
  orderId: string
): Promise<ServiceResponse> => {
  try {
    const transaction = await prisma.transaction.findFirst({where: {order_id: orderId, status: "pending"}});
    if(!transaction) return {error: true, status: 404, message: "Transaction not found"};

    const response = await midtransApi.post(`/v2/${orderId}/cancel`);
    const data = response.data;

    if (Number(data.status_code) !== 200) {
      return {
        error: true,
        status: Number(data.status_code),
        message: data.status_message,
      };
    }

    await prisma.transaction.update({where: {order_id: orderId, status: "pending"}, data: {status: "cancelled", update_at: new Date()}});
    
    return { error: false, data };
  } catch (error: any) {
    logger.error(error.message);
    const errorPrisma = prismaError(error);
    if (errorPrisma?.error)
      return {
        error: true,
        status: errorPrisma.statusCode,
        message: errorPrisma.message,
      };

    return { error: true, status: 500, message: "Something wrong." };
  }
};

export const statusTransactionService = async (
  orderId: string
): Promise<ServiceResponse> => {
  try {
    const response = await midtransApi.get(`/v2/${orderId}/status`);
    const data = response.data;

    if (
      Number(data.status_code) !== 200 &&
      Number(data.status_code) !== 201 &&
      Number(data.status_code) !== 407
    )
      return {
        error: true,
        status: Number(data.status_code),
        message: data.status_message,
      };
    return { error: false, data };
  } catch (error: any) {
    logger.error(error.message);

    return { error: true, status: 500, message: "Something wrong" };
  }
};

export const notificationTransactionService = async (
  data: any
): Promise<ServiceResponse> => {
  const {
    order_id,
    status_code,
    gross_amount,
    signature_key: receivedSignature,
    transaction_status,
    payment_type,
    fraud_status,
  } = data;
  try {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const rawSignature = `${order_id}${status_code}${gross_amount}${serverKey}`;
    const expectedSignature = crypto
      .createHash("sha512")
      .update(rawSignature)
      .digest("hex")
      .toLowerCase();

    if (receivedSignature !== expectedSignature)
      return { error: true, status: 400, message: "Invalid Signature" };

    const transaction = await prisma.transaction.findFirst({
      where: { order_id },
    });
    if (!transaction)
      return { error: true, status: 404, message: "Transaction not found" };

    if (
      transaction_status === "settlement" ||
      (transaction_status === "capture" && fraud_status === "accept")
    ) {
      if(transaction.type === "invoice") {
        const invoices = await prisma.invoices.findFirst({
          where: { id: order_id },
        });
  
        if (!invoices)
          return { error: true, status: 404, message: "Invoice not found" };
  
        if (invoices.status === "paid")
          return { error: true, status: 400, message: "Invoice already paid" };
  
        const company = await prisma.companies.findFirst({
          where: { id: invoices?.company_id },
        });
  
        if (!company)
          return { error: true, status: 404, message: "Company not found" };
  
        await prisma.invoices.update({
          where: { id: order_id },
          data: {
            status: "paid",
            paid_at: new Date(),
          },
        });
  
        await prisma.companies.update({
          where: { id: invoices?.company_id },
          data: {
            amount: (company?.amount || 0) + (invoices?.total || 0),
          },
        });
      }else if(transaction.type === "subscription"){
        const company = await prisma.companies.findFirst({
          where: { id: transaction?.company_id },
        });
  
        if (!company)
          return { error: true, status: 404, message: "Company not found" };
  
        await prisma.subscriptions.update({where: {id: company.subscription_id}, data: {
          plan_id: transaction.plan_id ? { set: transaction.plan_id } : undefined
        }});
      }

      await prisma.transaction.update({
        where: { order_id },
        data: {
          update_at: new Date(),
          status: "paid",
          payment_method: payment_type,
        },
      });
    } else if (
      transaction_status === "expire" ||
      transaction_status === "cancel"
    ) {
      if(transaction.type === "invoice") {
        await prisma.invoices.update({
          where: { id: order_id },
          data: {
            status: "unpaid",
            paid_at: null,
          },
        });
        const invoices = await prisma.invoices.findFirst({
          where: { id: order_id, status: "paid" },
        });
        if (invoices)
          return {
            error: true,
            status: 400,
            message: "Cannot change status transaction",
          };
      }

      await prisma.transaction.update({
        where: { order_id },
        data: {
          status: "failed",
          update_at: new Date(),
        },
      });

    }

    return { error: false, data: null };
  } catch (error: any) {
    logger.error(error.message);
    const errorPrisma = prismaError(error);
    if (errorPrisma?.error)
      return {
        error: true,
        status: errorPrisma.statusCode,
        message: errorPrisma.message,
      };

    return { error: true, status: 500, message: "Something wrong" };
  }
};
