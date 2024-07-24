// controllers/authController.js
const User = require("../models/userModel");
const Roommate = require("../models/roommateModel");
const Apartment = require("../models/apartmentModel");
const Question = require("../models/questionModel");
const {format} = require('date-fns');

const uploadToCloudinary = require("../utils/uploadToCloudinary");

// authController.js
exports.googleAuthCallback = async (req, res) => {
  const { id, displayName, emails, photos } = req.user;
  try {
    const user = await User.findOne({ email: emails[0].value });

    if (!user) {
      req.session.userRegitration = {
        fullName: displayName || emails[0].value.split("@")[0],
        email: emails[0].value,
        googleId: id,
        picture: photos[0]?.value,
      };
      res.redirect(`${process.env.FRONTEND_URL}/complete-signup`);
    } else {
      req.session.user = user;
      req.session.profile = user.profile;
      res.redirect(`${process.env.FRONTEND_URL}/`);
    }
  } catch (error) {
    console.error(error);
    res.redirect(`${process.env.FRONTEND_URL}/auth`);
  }
};

exports.getCurrentUser = (req, res) => {
  if (req.session.user) {
    const userType = req.session.user.userType;
    if (userType === 'roommate') {
      Roommate.findById(req.session.profile)
        .populate("questionnaire")
        .then((roommate) => {
          res.json({ user: req.session.user, profile: roommate });
        })
        .catch((err) => {
          console.error(err);
          res.status(400).json({ message: err.message });
        });
    } else if (userType === 'apartment') {
      Apartment.findById(req.session.profile)
        .populate("questionnaire")
        .then((apartment) => {
          res.json({ user: req.session.user, profile: apartment });
        })
        .catch((err) => {
          console.error(err);
          res.status(400).json({ message: err.message });
        });
    }
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
};

exports.completeRoommateRegistration = async (req, res) => {
  try {
    const { questionnaireAnswers, personalInfo, interests, social } = req.body;
    const { fullName, email, googleId, picture } = req.session.userRegitration;

    const user = new User({
      fullName,
      email,
      googleId,
      userType: "roommate",
      picture,
    });
    await user.save();

    const parsedQuestionnaire = JSON.parse(questionnaireAnswers);
    const parsedPersonalInfo = JSON.parse(personalInfo);
    const parsedInterests = JSON.parse(interests);
    const parsedSocial = JSON.parse(social);
    const imageUrl = req.files ? await uploadToCloudinary(req.files) : null;

    const savedQuestionnaire = await new Question(parsedQuestionnaire).save();

    const newRoommate = await new Roommate({
      user: user._id,
      questionnaire: savedQuestionnaire._id,
      personalInfo: { ...parsedPersonalInfo, name: fullName },
      interests: parsedInterests,
      social: {
        ...parsedSocial,
        profileImage: imageUrl[0],
      },
    }).save();

    user.profile = newRoommate._id;
    imageUrl && (user.picture = imageUrl[0]);
    await user.save();

    res.status(201).json({
      message: "Roommate registration completed successfully",
      userId: user._id,
      roommateId: newRoommate._id,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.completeApartmentRegistration = async (req, res) => {
  try {
    const { questionnaireAnswers, info, amenities, details } = req.body;

console.log(req.session.userRegitration);
    const { fullName = 'user' , email, googleId, picture } = req.session.userRegitration;



    const user = new User({
      fullName,
      email,
      googleId,
      userType: "apartment",
      picture,
    });
    await user.save();

    const parsedQuestionnaire = JSON.parse(questionnaireAnswers);
    const parsedInfo = JSON.parse(info);
    const parsedAmenities = JSON.parse(amenities);
    const parsedDetails = JSON.parse(details);

    const imageUrls = req.files ? await uploadToCloudinary(req.files) : [];

    const savedQuestionnaire = await new Question(parsedQuestionnaire).save();

    const newApartment = await new Apartment({
      user: user._id,
      questionnaire: savedQuestionnaire._id,
      info: {
        ...parsedInfo,
        leaseTerms: {
          ...parsedInfo.leaseTerms,
          availableFrom: format(new Date(parsedInfo.leaseTerms.availableFrom), 'dd MMMM, yyyy'),
        },
        roommates: [user.fullName],
        images: imageUrls,
      },
      amenities: parsedAmenities,
      details: parsedDetails,
    }).save();

    user.profile = newApartment._id;
    await user.save();

    res.status(201).json({
      message: "Apartment registration completed successfully",
      userId: user._id,
      apartmentId: newApartment._id,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Could not log out, please try again" });
    }
    res.json({ message: "Logged out successfully" });
  });
};


exports.bulkRegistration = async (req, res) => {
  try {
    const { registrations, userType } = req.body;
    const results = [];

    for (let registration of registrations) {
      const { email, fullName, questionnaireAnswers, info, images } = registration;

      // Create user
      const user = new User({
        fullName,
        email,
        userType,
        picture: images && images.length > 0 ? images[0] : null,
      });
      await user.save();

      // Create and save questionnaire
      const parsedQuestionnaire = JSON.parse(questionnaireAnswers);
      const savedQuestionnaire = await new Question(parsedQuestionnaire).save();

      let profile;
      if (userType === 'roommate') {
        const { personalInfo, interests, social } = registration;
        profile = new Roommate({
          user: user._id,
          questionnaire: savedQuestionnaire._id,
          personalInfo: { ...JSON.parse(personalInfo), name: fullName },
          interests: JSON.parse(interests),
          social: {
            ...JSON.parse(social),
            profileImage: images && images.length > 0 ? images[0] : null,
          },
        });
      } else if (userType === 'apartment') {
        const { amenities, details } = registration;
        const parsedInfo = JSON.parse(info);
        profile = new Apartment({
          user: user._id,
          questionnaire: savedQuestionnaire._id,
          info: {
            ...parsedInfo,
            leaseTerms: {
              ...parsedInfo.leaseTerms,
              availableFrom: format(new Date(parsedInfo.leaseTerms.availableFrom), 'dd MMMM, yyyy'),
            },
            roommates: [user.fullName],
            images: images || [],
          },
          amenities: JSON.parse(amenities),
          details: JSON.parse(details),
        });
      }

      await profile.save();

      user.profile = profile._id;
      await user.save();

      results.push({
        email: user.email,
        userId: user._id,
        profileId: profile._id,
      });
    }

    res.status(201).json({
      message: `Bulk ${userType} registration completed successfully`,
      results,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};