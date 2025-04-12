
export interface IPaymentService {
    createStripeOrder(userId:string,planId:string):Promise<string>
    createPaypalOrder(userId:string,planId:string):Promise<string>
    capturePaypalPayment(userId:string,planId:string,orderID:string):Promise<boolean>
    stripeWebhook(sig:any,reqBody:any):Promise<any>
}