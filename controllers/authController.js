const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const Question = require("../models/questionModel");
const Apartment = require("../models/apartmentModel");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

exports.loginUser = (req, res) => {
  req.session.user = {
    id: req.user._id,
    email: req.user.email,
    apartmentAssociate: req.user.apartmentAssociate || "",
  };
  res.json({ message: "Login successful" });
};

exports.logoutUser = (req, res) => {
  req.logout();
  res.json({ message: "Logout successful" });
};

exports.registerApartment = async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);
    const { registerInfo, userType, questionnaireAnswers, additionalInfo } =
      data;

    if (!registerInfo || !registerInfo.email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existingUser = await User.findOne({
      "userInfo.email": registerInfo.email,
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const imageUrls =
      req.files && req.files.length > 0
        ? await uploadToCloudinary(req.files)
        : [];

    const hashedPassword = await bcrypt.hash(registerInfo.password, 10);
    const savedQuestionnaire = await new Question(questionnaireAnswers).save();

    const newUser = await new User({
      userInfo: {
        fullName: registerInfo.fullName,
        email: registerInfo.email,
        password: hashedPassword,
      },
      userType: 'apartment',
    }).save();

    const newApartment = await new Apartment({
      userInfo: newUser._id,
      questionnaire: savedQuestionnaire._id,
      apartmentInfo: {
        address: {
          address: additionalInfo.overview.address.address,
          position: additionalInfo.overview.address.position,
        },
        floorNumber: Number(additionalInfo.overview.floorNumber),
        rent: Number(additionalInfo.overview.rent),
        bedrooms: Number(additionalInfo.overview.bedrooms),
        bathrooms: Number(additionalInfo.overview.bathrooms),
        size: Number(additionalInfo.overview.size),
        leaseLength: additionalInfo.overview.leaseLength,
        roommates: additionalInfo.overview.roommates,
        roommatesName: additionalInfo.overview.roommatesName,
        amenities: additionalInfo.amenities,
        nearbyPlaces: additionalInfo.nearbyPlaces,
        about: additionalInfo.about,
        details: additionalInfo.details,
        images: imageUrls,
      },
      existingRoommates: [newUser._id],
    }).save();

    newUser.apartmentAssociate = newApartment._id;
    await newUser.save();

    res.status(201).json({
      message: "Registration successful",
      userId: newUser._id,
      apartmentId: newApartment._id,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.registerUser = async (req, res) => {
  try {
    const data = JSON.parse(req.body.data);
    const { userInfo, userType, questionnaireAnswers, additionalInfo } = data;

    const existingUser = await User.findOne({
      "userInfo.email": userInfo.email,
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const imageUrl =
      req.files && req.files.length > 0
        ? await uploadToCloudinary(req.files[0])
        : null;
    const hashedPassword = await bcrypt.hash(userInfo.password, 10);
    const savedQuestionnaire = await new Question(questionnaireAnswers).save();

    const newRoommate = await new User({
      image: imageUrl,
      userType : 'roommate', 
      userInfo: {
        fullName: userInfo.fullName,
        email: userInfo.email,
        password: hashedPassword,
      },
      questionnaire: savedQuestionnaire._id,
      personalInfo: {
        fullName: userInfo.fullName,
        age: additionalInfo.age,
        gender: additionalInfo.gender,
        from: additionalInfo.from,
        occupation: additionalInfo.occupation,
        education: additionalInfo.education,
        hobbies: additionalInfo.hobbies,
        socialMedia: additionalInfo.socialMedia,
        availability: additionalInfo.availability,
        about: additionalInfo.about,
      },
    }).save();

    res.status(201).json({
      message: "Roommate registration successful",
      roommateId: newRoommate._id,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.bulkRegister = async (req, res) => {
  try {
    console.log("Received data:", JSON.stringify(req.body, null, 2)); // Log the received data

    const { apartments, roommates } = req.body;

    if (!apartments || !Array.isArray(apartments)) {
      return res
        .status(400)
        .json({ message: "Invalid or missing apartments data" });
    }

    if (!roommates || !Array.isArray(roommates)) {
      return res
        .status(400)
        .json({ message: "Invalid or missing roommates data" });
    }

    const registeredApartments = [];
    const registeredRoommates = [];

    // Register apartments
    for (const apartmentData of apartments) {
      const { userInfo, questionnaireAnswers, apartmentInfo, images } =
        apartmentData;

      const hashedPassword = await bcrypt.hash(userInfo.password, 10);
      const savedQuestionnaire = await new Question(
        questionnaireAnswers
      ).save();

      const newUser = await new User({
        userInfo: {
          fullName: userInfo.fullName,
          email: userInfo.email,
          password: hashedPassword,
        },
        userType: "apartment",
      }).save();

      const newApartment = await new Apartment({
        userInfo: newUser._id,
        questionnaire: savedQuestionnaire._id,
        apartmentInfo: {
          ...apartmentInfo,
          images: images || [],
        },
        existingRoommates: [newUser._id],
      }).save();

      newUser.apartmentAssociate = newApartment._id;
      await newUser.save();

      registeredApartments.push({
        userId: newUser._id,
        apartmentId: newApartment._id,
      });
    }

    // Register roommates

    for (const roommateData of roommates) {
      const { userInfo, questionnaireAnswers, personalInfo, image } =
        roommateData;

      const hashedPassword = await bcrypt.hash(userInfo.password, 10);
      const savedQuestionnaire = await new Question(
        questionnaireAnswers
      ).save();

      const newRoommate = await new User({
        userType: "roommate",
        userInfo: {
          fullName: userInfo.fullName,
          email: userInfo.email,
          password: hashedPassword,
        },
        questionnaire: savedQuestionnaire._id,
        roommateInfo: {
          fullName: userInfo.fullName,
          image: image,
          age: personalInfo.age,
          gender: personalInfo.gender,
          from: personalInfo.from,
          occupation: personalInfo.occupation,
          education: personalInfo.education,
          hobbies: personalInfo.hobbies,
          socialMedia: personalInfo.socialMedia,
          availability: personalInfo.availability,
          about: personalInfo.about,
        },
      }).save();

      registeredRoommates.push({
        roommateId: newRoommate._id,
      });
    }

    res.status(201).json({
      message: "Bulk registration successful",
      registeredApartments,
      registeredRoommates,
    });
  } catch (err) {
    console.error("Error in bulkRegister:", err);
    res.status(400).json({ message: err.message });
  }
};
