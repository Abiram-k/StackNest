import { NextFunction, Request, Response } from "express";
import { ResFetchBannerDTO } from "../../dtos/user/banner/fetchBanner.dto.js";

export interface IUserBannerController {
    fetchBanners(req:Request,res:Response<ResFetchBannerDTO>,next:NextFunction):Promise<void>
}