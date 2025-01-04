import { Request } from "express";

declare module "*.js";



declare module "express-serve-static-core" {
  interface Request {
    userType?: "roommate" | "apartment";
    user?: any;
    session?: {
      destroy(arg0: (err: any) => import("express").Response<any, Record<string, any>> | undefined): unknown;
      user: import("mongoose").Document<unknown, {}, import("c:/Users/shaio/iRoomie/iRoommie/src/models/userModel").IUser> & import("c:/Users/shaio/iRoomie/iRoommie/src/models/userModel").IUser & Required<{ _id: unknown; }> & { __v: number; };
      userRegitration: { fullName: string; email: string; googleId: string; picture: string; };
      profile?: string;
    };
  }

  interface Session {
    userRegitration?: {
      fullName: string;
      email: string;
      googleId: string;
      picture?: string;
    };
    user?: IUser; // Use the IUser interface from your model
    profile?: mongoose.Types.ObjectId; // Adjust the type as needed
  }
}
