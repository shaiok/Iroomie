const Roommate = require("../models/roommateModel");
const Apartment = require("../models/apartmentModel");
const roommateController = require("./roommateController");
const apartmentController = require("./apartmentController");

const controllerMap = {
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

  },
};

const createControllerMethod = (methodName) => async (req, res) => {
  try {
    const method = controllerMap[req.userType][methodName];

    if (!method) {
      return res.status(400).json({ message: `Action not supported for ${req.userType}` });
    }

    // Pass the user object to the controller method
    return method(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getMatches = createControllerMethod('getMatches');
exports.getSuggestions = createControllerMethod('getSuggestions');
exports.getActivity = createControllerMethod('getActivity');
exports.updateUser = createControllerMethod('updateUser');
exports.setPreferences = createControllerMethod('setPreferences');
exports.setAction = createControllerMethod('setAction');



// Middleware for checking user type and fetching user object
exports.checkUserType = async (req, res, next) => {
  if (!req.session.profile) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.session.profile;
  let user = await Roommate.findById(userId).populate("questionnaire");
  
  if (user) {
    req.userType = "roommate";
    req.user = user;
  } else {
    user = await Apartment.findById(userId).populate("questionnaire");
    if (user) {
      req.userType = "apartment";
      req.user = user;
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }
  }

  next();
};
