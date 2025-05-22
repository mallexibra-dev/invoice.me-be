import logger from "../config/logging";
import prisma from "../config/prismaClient";
import supabase from "../config/supabaseClient";
import prismaError from "../errors/prismaError";
import type { ServiceResponse } from "../types/serviceResponse";
import { midtransApi } from "../utils/midtransAPI";

export const changeSubscriptionService = async (
  token: string,
  planId: string
): Promise<ServiceResponse> => {
  try {
    const userLogin = await supabase.auth.getUser(token);
    const user = await prisma.user.findFirst({
      where: { id: userLogin.data.user?.id },
    });

    if (!user) return { error: true, status: 404, message: "User not found" };
    
    const company = await prisma.companies.findFirst({
      where: { id: user.company_id! },
    });
    
    if (!company) return { error: true, status: 404, message: "Company not found" };
    
    const subscription = await prisma.subscriptions.findFirst({
      where: { id: company?.subscription_id },
    });
    
    if (!subscription) return { error: true, status: 404, message: "Subscription not found" };

    const transaction = await prisma.transaction.findFirst({
      where: { order_id: subscription?.id, type: "subscription" },
    });

    if (transaction)
      return {
        error: true,
        status: 403,
        message: "Transaction already exist, please check your email company",
      };

    const plan = await prisma.subscriptionPLan.findFirst({
      where: { id: planId },
    });
    if (!plan)
      return {
        error: true,
        status: 404,
        message: "Subscription Plan not found",
      };

    const transactionCreate = await prisma.transaction.create({
      data: {
        order_id: subscription.id,
        company_id: company.id,
        type: "subscription",
        plan_id: planId,
        net_amount: plan.price,
        status: "unpaid",
      },
    });

    // Send email payment link
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

    return { error: true, status: 500, message: "Something wrong." };
  }
};

export const createChargeSubscriptionService = async (
  orderId: string,
  companyId: string,
  paymentType: string,
  transactionDetails: any,
  amount: any
): Promise<ServiceResponse> => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        order_id: orderId,
        company_id: companyId,
      },
    });

    if (!transaction)
      return { error: true, status: 404, message: "Transaction not found" };

    if (transaction.net_amount !== amount.net_amount)
      return { error: true, status: 403, message: "Amount doesn't matched" };

    if (transactionDetails.gross_amount !== amount.net_amount + amount.fee)
      return { error: true, status: 403, message: "Amount doesn't matched" };

    const company = await prisma.companies.findFirst({
      where: { id: companyId },
    });

    const data = {
      payment_type: paymentType,
      transaction_details: transactionDetails,
      customer_details: {
        name: company?.name,
        email: company?.email,
      },
    };

    const response = await midtransApi.post("/v2/charge", data);
    const dataResponse = response.data;

    if (Number(dataResponse.status_code) !== 201)
      return {
        error: true,
        status: Number(dataResponse.status_code),
        message: response.data.status_message,
      };

      const transactionUpdate = await prisma.transaction.update({
        data: {
          gross_amount: transactionDetails.gross_amount,
          fee: amount.fee,
          payment_method: paymentType,
          status: "pending",
          update_at: new Date(),
        }, where: {order_id: orderId}
      });
  
      if (!transaction) {
        const cancelResponse = await cancelTransactionChangeSubscriptionService(
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

    return { error: true, status: 500, message: "Something wrong." };
  }
};

export const cancelChangeSubscriptionService = async (orderId: string): Promise<ServiceResponse> => {
    try{
        const transaction = await prisma.transaction.findFirst({where: {
            order_id: orderId, status: "pending"
        }});

        if(transaction) return {error: true, status: 406, message: "Transaction is pending"};

        const transactionToUpdate = await prisma.transaction.update({where: {order_id: orderId, status: "unpaid"}, data: {status: "cancelled", update_at: new Date()}});

        return {error: false, data: transactionToUpdate};
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

export const cancelTransactionChangeSubscriptionService = async (orderId: string): Promise<ServiceResponse> => {
  try {
    const transaction = await prisma.transaction.findFirst({where: {order_id: orderId, status: "pending"}});
    if(!transaction) return {error: true, status: 404, message: "Transaction not found"};

    const response = await midtransApi.post(`/v2/${orderId}/cancel`);
    const data = response.data;

    if(Number(data.status_code) !== 200) return {error: true, status: Number(data.status_code), message: data.status_message};

    await prisma.transaction.update({where: {order_id: orderId, status: "pending"}, data: {status: "cancelled", update_at: new Date()}});

    return {error: false, data};
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
