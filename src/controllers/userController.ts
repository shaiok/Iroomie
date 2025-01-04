import { Request, Response, NextFunction } from "express";
import Roommate, { IRoommate } from "../models/roommateModel";
import Apartment, { IApartment } from "../models/apartmentModel";
import * as roommateController from "./roommateController";
import * as apartmentController from "./apartmentController";

// Extend Express Request Interface
interface CustomRequest extends Request {
  userType?: "roommate" | "apartment";
  user?: IRoommate | IApartment | null;
}

// Define Controller Method Type
type ControllerMethod = (req: CustomRequest, res: Response) => {};

// Define Controller Map
const controllerMap: Record<
  "roommate" | "apartment",
  Record<string, ControllerMethod>
> = {
  roommate: {
    getMatches: roommateController.getMatches,
    getActivity: roommateController.getActivity,
    getSuggestions: roommateController.getSuggestions,
     updateUser: roommateController.updateUser,
     setPreferences: roommateController.setRoommatePreferences,
    setAction: roommateController.roommateActions,
  },
  apartment: {
    getMatches: apartmentController.getMatches,
    getActivity: apartmentController.getActivity,
    getSuggestions: apartmentController.getSuggestions,
    updateUser: apartmentController.updateApartment,
    setPreferences: apartmentController.setApartmentPreferences,
    setAction: apartmentController.apartmentActions,
  }
};

// Create Controller Method Dynamically
const createControllerMethod = (methodName: keyof typeof controllerMap["roommate"] | keyof typeof controllerMap["apartment"]) => {
  return async (req: CustomRequest, res: Response): Promise<void> => {
    try {
      const method = controllerMap[req.userType!]?.[methodName]; // Non-null assertion on `userType`

      if (!method) {
        res.status(400).json({ message: `Action not supported for ${req.userType}` });
        return;
      }

      method(req, res); // Pass the request and response objects
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};

// Export Controller Methods
export const getmatches = createControllerMethod("getMatches");
export const getSuggestions = createControllerMethod("getSuggestions");
export const getactivity = createControllerMethod("getActivity");
export const updateUser = createControllerMethod("updateUser");
export const setPreferences = createControllerMethod("setPreferences");
export const setAction = createControllerMethod("setAction");

// Middleware to Check User Type and Fetch User Object
export const checkUserType = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.session?.profile) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userId = req.session.profile;

    // Try to find the user as a roommate
    let user: IRoommate | IApartment | null = await Roommate.findById(userId).populate("questionnaire");

    if (user) {
      req.userType = "roommate";
      req.user = user;
    } else {
      // Try to find the user as an apartment
      user = await Apartment.findById(userId).populate("questionnaire");

      if (user) {
        req.userType = "apartment";
        req.user = user;
      } else {
        res.status(400).json({ message: "Invalid user type" });
        return;
      }
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

