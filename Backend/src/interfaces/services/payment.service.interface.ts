
export interface IPaymentService {
    createPaypalOrder(userId:string,planId:string):Promise<string>
    capturePaypalPayment(userId:string,planId:string,orderID:string):Promise<boolean>
}