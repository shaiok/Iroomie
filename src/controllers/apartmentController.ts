

import { Request, Response, NextFunction } from "express";
import Roommate, { IRoommate } from "../models/roommateModel";
import Apartment, { IApartment } from "../models/apartmentModel";
import Question, { IQuestion } from "../models/questionModel";
import calculateCompatibilityScore from "../utils/matchingAlgorithm";
import { Types } from "mongoose";
import { calculateDistance } from "../utils/utilsFunction";
import { HydratedDocument } from "mongoose";



export const getMatches = async (req: Request, res: Response) => {
  try {
    // Fetch the apartment
    const myApartment = await Apartment.findById(req.user._id);
    if (!myApartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }

    // Fetch the apartment's questionnaire from the database
    const apartmentQuestionnaire = await Question.findById(myApartment.questionnaire);
    if (!apartmentQuestionnaire) {
      return res.status(400).json({ message: "Apartment questionnaire not found" });
    }

    if (!myApartment.matches || myApartment.matches.length === 0) {
      return res.status(400).json({ message: "No matches found for the apartment" });
    }

    // Fetch matches and their questionnaires
    const matches = await Promise.all(
      myApartment.matches.map(async (matchId: Types.ObjectId) => {
        const match = await Roommate.findById(matchId);
        if (!match || !match.questionnaire) return null;

        const matchQuestionnaire = await Question.findById(match.questionnaire);
        if (!matchQuestionnaire) return null;

        return { match, matchQuestionnaire };
      })
    );

    // Filter and map matches
    const formattedMatches = matches
      .filter(
        (result): result is {
          match: HydratedDocument<IRoommate>;
          matchQuestionnaire: HydratedDocument<IQuestion>;
        } => result !== null
      ) // Filter out null matches
      .map(({ match, matchQuestionnaire }) => {
        const compatibilityScore = calculateCompatibilityScore(
          apartmentQuestionnaire,
          matchQuestionnaire
        );

        return {
          match,
          matchInfo: {
            image: match.social?.profileImage || "No image available",
            score: compatibilityScore,
            title: match.personalInfo?.name || "No name provided",
            subTitle: `${match.personalInfo?.age ?? "Unknown"} years old`,
          },
        };
      })
      .sort((a, b) => b.matchInfo.score - a.matchInfo.score);

    res.status(200).json(formattedMatches);
  } catch (err) {
    console.error("Error fetching matches for apartment:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getActivity = async (req: Request, res: Response) => {
  try {
    // Fetch the apartment
    const myApartment = await Apartment.findById(req.user._id);
    if (!myApartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }

    if (!myApartment.likes || !myApartment.dislikes) {
      return res.status(400).json({ message: "No likes or dislikes found for the apartment" });
    }

    // Fetch the apartment's questionnaire from the database
    const apartmentQuestionnaire = await Question.findById(myApartment.questionnaire);
    if (!apartmentQuestionnaire) {
      return res.status(400).json({ message: "Apartment questionnaire not found" });
    }

    // Helper function to fetch roommates and their questionnaires
    const formatRoommates = async (roommateIds: Types.ObjectId[]) => {
      const roommates = await Promise.all(
        roommateIds.map(async (id) => {
          const roommate = await Roommate.findById(id);
          if (!roommate || !roommate.questionnaire) return null;

          const roommateQuestionnaire = await Question.findById(roommate.questionnaire);
          if (!roommateQuestionnaire) return null;

          return { roommate, roommateQuestionnaire };
        })
      );

      return roommates
        .filter(
          (result): result is {
            roommate: HydratedDocument<IRoommate>;
            roommateQuestionnaire: HydratedDocument<IQuestion>;
          } => result !== null
        ) // Filter out null roommates
        .map(({ roommate, roommateQuestionnaire }) => {
          const compatibilityScore = calculateCompatibilityScore(
            apartmentQuestionnaire,
            roommateQuestionnaire
          );

          return {
            roommate,
            score: compatibilityScore,
          };
        });
    };

    // Format likes and dislikes
    const likes = await formatRoommates(myApartment.likes);
    const dislikes = await formatRoommates(myApartment.dislikes);

    res.status(200).json({ likes, dislikes });
  } catch (err) {
    console.error("Error fetching activity for apartment:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateApartment = async (req: Request, res: Response) => {
  try {
    const { questionnaire, ...otherFields } = req.body;
    let updatedApartment = req.user as IApartment;

    if (questionnaire) {
      const updatedQuestionnaire = await Question.findByIdAndUpdate(
        updatedApartment.questionnaire,
        questionnaire,
        { new: true, runValidators: true }
      );

      if (!updatedQuestionnaire) {
        return res.status(404).json({ message: 'Questionnaire not found' });
      }

      updatedApartment.questionnaire = updatedQuestionnaire._id as Types.ObjectId;
    }

    Object.assign(updatedApartment, otherFields);
    await updatedApartment.save();

    res.json(updatedApartment);
  } catch (err) {
    console.error(err);
    if ((err as Error).name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: (err as any).errors });
    }
  }
}
export const apartmentActions = async (req: Request, res: Response) => {
  try {
    const { targetId } = req.params;
    const { action } = req.query;
    const myApartment = req.user as IApartment;

    const roommate = await Roommate.findById(targetId);
    if (!roommate) {
      return res.status(404).json({ message: 'Roommate not found' });
    }

    switch (action) {
      case 'like':
        if (!myApartment.likes?.includes(roommate._id as Types.ObjectId)) {
          myApartment.likes = myApartment.likes ?? [];
          myApartment.likes.push(roommate._id as Types.ObjectId);
          myApartment.dislikes = myApartment.dislikes?.filter(
            (id) => !id.equals(roommate._id as Types.ObjectId)
          ) ?? [];
        }
        break;
      case 'dislike':
        if (!myApartment.dislikes?.includes(roommate._id as Types.ObjectId)) {
          myApartment.dislikes = myApartment.dislikes ?? [];
          myApartment.dislikes.push(roommate._id as Types.ObjectId);
          myApartment.likes = myApartment.likes?.filter(
            (id) => !id.equals(roommate._id as Types.ObjectId)
          ) ?? [];
        }
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    await myApartment.save();
    return res.json({ message: 'Action successful' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const setApartmentPreferences = async (req: Request, res: Response): Promise<void> => {
  try {
    const apartment = req.user as IApartment;
    const { ageRange, gender, occupations, sharedInterests } = req.body;

    apartment.preferences = {
      ageRange,
      gender,
      occupations,
      sharedInterests,
    };

    await apartment.save();

    res.status(200).json({
      message: 'Apartment preferences updated successfully',
      apartment: apartment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating apartment preferences' });
  }
};

export const getSuggestions = async (req: Request, res: Response) => {
  try {
    // Fetch the apartment
    const apartment = await Apartment.findById(req.user._id);
    if (!apartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }

    const dislikes = apartment.dislikes ?? [];
    const likes = apartment.likes ?? [];
    const matches = apartment.matches ?? [];

    // Fetch the apartment's questionnaire
    const apartmentQuestionnaire = await Question.findById(apartment.questionnaire);
    if (!apartmentQuestionnaire) {
      return res.status(400).json({ message: "Apartment questionnaire not found" });
    }

    // Fetch all roommates
    const roommates = await Roommate.find();

    // Filter and map compatible roommates
    const compatibleRoommates = await Promise.all(
      roommates
        .filter(
          (result) =>
            !dislikes.includes(result._id as Types.ObjectId) &&
            !likes.includes(result._id as Types.ObjectId) &&
            !matches.includes(result._id as Types.ObjectId)
        )
        .map(async (roommate) => {
          // Fetch roommate's questionnaire
          const roommateQuestionnaire = await Question.findById(roommate.questionnaire);
          if (!roommateQuestionnaire) return null;

          const compatibilityScore = calculateCompatibilityScore(
            apartmentQuestionnaire,
            roommateQuestionnaire
          );

          return {
            roommate,
            score: compatibilityScore,
            sortOption: {
              score: compatibilityScore,
              age: roommate.personalInfo?.age || "Unknown",
              date: apartment.info?.leaseTerms?.availableFrom ?? new Date(),
            },
          };
        })
    );

    // Filter out null results and sort by score
    const sortedRoommates = compatibleRoommates
      .filter((result): result is NonNullable<typeof result> => result !== null)
      .sort((a, b) => b.score - a.score);

    res.status(200).json(sortedRoommates);
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};