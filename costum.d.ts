declare module 'webidl-conversions'; 

import "express-session";

declare module "express-session" {
  interface SessionData {
    profile?: {
      _id: string;
      [key: string]: any; // Add more fields if needed
    };
  }
}