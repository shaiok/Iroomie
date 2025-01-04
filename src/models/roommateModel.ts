import { Schema, model, Document, Types } from "mongoose";
import { IQuestion } from "./questionModel";

// Define interfaces for the document structure
interface IPersonalInfo {
  name?: string;
  age?: number;
  gender?: string;
  occupation?: string;
  education?: string;
  hometown?: string;
}

interface IInterests {
  hobbies?: string[];
  music?: string[];
  movies?: string[];
  sports?: string[];
}

interface ISocial {
  bio?: string;
  profileImage?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
  };
}

interface IPreferences {
  overview?: {
    rentRange?: number;
    bedrooms?: number;
    bathrooms?: number;
    minSize?: number;
  };
  details?: {
    AC?: boolean;
    Parking?: boolean;
    Balcony?: boolean;
    Furnished?: boolean;
    Elevator?: boolean;
    "Pet Friendly"?: boolean;
    "Smoking Allowed"?: boolean;
  };
  leaseDuration?: {
    duration?: number;
    moveInDateStart?: Date;
  };
  location?: {
    address?: {
      street?: string;
      city?: string;
      coordinates?: [number, number];
    };
    radius?: number;
  };
}

// Define the main Roommate interface
export interface IRoommate extends Document {
  user: Types.ObjectId;
  personalInfo?: IPersonalInfo;
  interests?: IInterests;
  social?: ISocial;
  questionnaire?: IQuestion ;
  preferences?: IPreferences;
  likes?: Types.ObjectId[];
  dislikes?: Types.ObjectId[];
  matches?: Types.ObjectId[];
}

// Define the Roommate Schema
const roommateSchema: Schema<IRoommate> = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  personalInfo: {
    name: String,
    age: Number,
    gender: String,
    occupation: String,
    education: String,
    hometown: String,
  },
  interests: {
    hobbies: [String],
    music: [String],
    movies: [String],
    sports: [String],
  },
  social: {
    bio: String,
    profileImage: String,
    socialMedia: {
      facebook: String,
      instagram: String,
    },
  },
  questionnaire: {
    type: Schema.Types.ObjectId,
    ref: "Question",
  },
  preferences: {
    overview: {
      rentRange: Number,
      bedrooms: Number,
      bathrooms: Number,
      minSize: Number,
    },
    details: {
      AC: Boolean,
      Parking: Boolean,
      Balcony: Boolean,
      Furnished: Boolean,
      Elevator: Boolean,
      "Pet Friendly": Boolean,
      "Smoking Allowed": Boolean,
    },
    leaseDuration: {
      duration: Number,
      moveInDateStart: Date,
    },
    location: {
      address: {
        street: String,
        city: String,
        coordinates: {
          type: [Number],
          index: "2dsphere",
        },
      },
      radius: Number,
    },
  },
  likes: [{ type: Schema.Types.ObjectId, ref: "Apartment" }],
  dislikes: [{ type: Schema.Types.ObjectId, ref: "Apartment" }],
  matches: [{ type: Schema.Types.ObjectId, ref: "Apartment" }],
});

// Create and export the Roommate model
const Roommate = model<IRoommate>("Roommate", roommateSchema);

export default Roommate;