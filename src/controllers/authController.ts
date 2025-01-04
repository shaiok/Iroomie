

import { Request, Response } from 'express';
import User, { IUser } from '../models/userModel'; // Adjust the import path as needed
import Roommate, { IRoommate } from '../models/roommateModel'; // Adjust the import path as needed
import Apartment from '../models/apartmentModel'; // Adjust the import path as needed
import Question from '../models/questionModel'; // Adjust the import path as needed
import { format } from 'date-fns';
import uploadToCloudinary from '../utils/uploadToCloudinary'; // Adjust the import path as needed
import mongoose, { Types } from 'mongoose';

interface GoogleUser {
  id: string;
  displayName: string;
  emails: { value: string }[];
  photos: { value: string }[];
}

// Extend the Session interface to include userRegitration
declare module 'express-session' {
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


export const googleAuthCallback = async (req: Request, res: Response): Promise<void> => {
  const userInfo = req.user as GoogleUser;
  const { id, displayName, emails, photos } = userInfo;

  if (!req.session) {
    console.error('Session is undefined');
    res.redirect(`${process.env.FRONTEND_URL}/auth`);
    return;
  }

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
      req.session.profile = user.profile?.toString() ;
      res.redirect(`${process.env.FRONTEND_URL}/`);
    }
  } catch (error) {
    console.error(error);
    res.redirect(`${process.env.FRONTEND_URL}/auth`);
  }
};

export const getCurrentUser = (req: Request, res: Response): void => {
  if (req.session?.user) {
    
    const userType = req.session.user.userType;
    if (userType === 'roommate') {
      Roommate.findById(req.session.profile)
        .populate('questionnaire')
        .then((roommate) => {
           if (!req.session) {
    console.error('Session is undefined');
    res.redirect(`${process.env.FRONTEND_URL}/auth`);
    return;
  }
          res.json({ user: req.session.user, profile: roommate });
        })
        .catch((err) => {
          console.error(err);
          res.status(400).json({ message: err.message });
        });
    } else if (userType === 'apartment') {
      Apartment.findById(req.session.profile)
        .populate('questionnaire')
        .then((apartment) => {
          if (!req.session) {
            console.error('Session is undefined');
            res.redirect(`${process.env.FRONTEND_URL}/auth`);
            return;
          }
          res.json({ user: req.session.user, profile: apartment });
        })
        .catch((err) => {
          console.error(err);
          res.status(400).json({ message: err.message });
        });
    }
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
};

export const completeRoommateRegistration = async (req: Request, res: Response): Promise<void> => {
  try { 
    if (!req.session) {
      return console.error('Session is undefined');}

    const { questionnaireAnswers, personalInfo, interests, social } = req.body;
    const { fullName, email, googleId, picture } = req.session.userRegitration!;

    const user = new User({
      fullName,
      email,
      googleId,
      userType: 'roommate',
      picture,
    });
    await user.save();

    const parsedQuestionnaire = JSON.parse(questionnaireAnswers);
    const parsedPersonalInfo = JSON.parse(personalInfo);
    const parsedInterests = JSON.parse(interests);
    const parsedSocial = JSON.parse(social);
    let files: Express.Multer.File[] = [];
    if (req.files) {
      if (Array.isArray(req.files)) {
        files = req.files;
      } else {
        files = Object.values(req.files).flat();
      }
    }
 const imageUrl = files.length > 0 ? await uploadToCloudinary(files) : [];

    const savedQuestionnaire = await new Question(parsedQuestionnaire).save();

    const newRoommate = await new Roommate({
      user: user._id,
      questionnaire: savedQuestionnaire._id,
      personalInfo: { ...parsedPersonalInfo, name: fullName },
      interests: parsedInterests,
      social: {
        ...parsedSocial,
        profileImage: imageUrl ? imageUrl[0] : undefined,
      },
    }).save();

    user.profile = newRoommate._id as Types.ObjectId ;
    if (imageUrl) {
      user.picture = imageUrl[0];
    }
    await user.save();

    res.status(201).json({
      message: 'Roommate registration completed successfully',
      userId: user._id,
      roommateId: newRoommate._id,
    });
  } catch (err ) {
    console.error(err);
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
};

export const completeApartmentRegistration = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.session) {
      return console.error('Session is undefined');}

    const { questionnaireAnswers, info, amenities, details } = req.body;

    console.log(req.session.userRegitration);
    const {
      fullName = 'user',
      email,
      googleId,
      picture,
    } = req.session.userRegitration!;

    const user = new User({
      fullName,
      email,
      googleId,
      userType: 'apartment',
      picture,
    });
    await user.save();

    const parsedQuestionnaire = JSON.parse(questionnaireAnswers);
    const parsedInfo = JSON.parse(info);
    const parsedAmenities = JSON.parse(amenities);
    const parsedDetails = JSON.parse(details);

    let files: Express.Multer.File[] = [];
    if (req.files) {
      if (Array.isArray(req.files)) {
        files = req.files;
      } else {
        files = Object.values(req.files).flat();
      }
    }

    const imageUrls = files.length > 0 ? await uploadToCloudinary(files) : [];

    const savedQuestionnaire = await new Question(parsedQuestionnaire).save();

    const newApartment = await new Apartment({
      user: user._id,
      questionnaire: savedQuestionnaire._id,
      info: {
        ...parsedInfo,
        leaseTerms: {
          ...parsedInfo.leaseTerms,
          availableFrom: format(
            new Date(parsedInfo.leaseTerms.availableFrom),
            'dd MMMM, yyyy'
          ),
        },
        roommates: [user.fullName],
        images: imageUrls,
      },
      amenities: parsedAmenities,
      details: parsedDetails,
    }).save();

    user.profile = newApartment._id as Types.ObjectId;
    await user.save();

    res.status(201).json({
      message: 'Apartment registration completed successfully',
      userId: user._id,
      apartmentId: newApartment._id,
    });
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
};


export const logout = (req: Request, res: Response): void => {

  if (!req.session) {
    return console.error('Session is undefined');}
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out, please try again' });
    }
    res.json({ message: 'Logged out successfully' });
  });
};

interface Registration {
  email: string;
  fullName: string;
  questionnaireAnswers: string;
  info: string;
  images?: string[];
  personalInfo?: string;
  interests?: string;
  social?: string;
  amenities?: string;
  details?: string;
}


export const bulkRegistration = async (req: Request, res: Response): Promise<void> => {
  try {
    const { registrations, userType }: { registrations: Registration[]; userType: string } = req.body;
    const results: Array<{ email: string; userId: mongoose.Types.ObjectId; profileId: mongoose.Types.ObjectId }> = [];

    for (const registration of registrations) {
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
      const savedQuestionnaire = await new Question(JSON.parse(questionnaireAnswers)).save();

      let profile: mongoose.Document | undefined;
      if (userType === 'roommate') {
        const { personalInfo, interests, social } = registration;
        profile = new Roommate({
          user: user._id,
          questionnaire: savedQuestionnaire._id,
          personalInfo: { ...JSON.parse(personalInfo!), name: fullName },
          interests: JSON.parse(interests!),
          social: {
            ...JSON.parse(social!),
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
          amenities: JSON.parse(amenities!),
          details: JSON.parse(details!),
        });
      }

      if (profile) {
        await profile.save();
        user.profile = profile._id as mongoose.Types.ObjectId;
        await user.save();

        results.push({
          email: user.email,
          userId: user._id as Types.ObjectId,
          profileId: profile._id as mongoose.Types.ObjectId,
        });
      }
    }

    res.status(201).json({
      message: `Bulk ${userType} registration completed successfully`,
      results,
    });
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      res.status(400).json({ message: err.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
};

export const testRoommate = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.session) {
      return console.error('Session is undefined');}

    const user = await User.findById('66afab6144060cef69ec439a');
    const roommate = await Roommate.findById('66afab6244060cef69ec43bc').populate('questionnaire');

    if (!user || !roommate) {
      throw new Error('User or roommate profile not found');
    }

    req.session.user = user;
    req.session.profile = roommate.id ;

    res.json({ user, profile: roommate });
  } catch (error) {
    console.error('Error in testRoommate:', error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
};

export const testApartment = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.session) {
      return console.error('Session is undefined');}

    const user = await User.findById('66b7d609cbe50ceed466e729');
    const apartment = await Apartment.findById('66b7d60bcbe50ceed466e74b').populate('questionnaire');

    if (!user || !apartment) {
      throw new Error('User or apartment profile not found');
    }

    req.session.user = user;
    req.session.profile = apartment.id;

    res.json({ user, profile: apartment });
  } catch (error) {
    console.error('Error in testApartment:', error);
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'An unknown error occurred' });
    }
  }
};