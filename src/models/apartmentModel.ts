import { Schema, model, Document, Types } from "mongoose";
import { IQuestion } from "./questionModel";

// 1. Define interfaces for nested structures
interface IOverview {
  title?: string;
  description?: string;
  propertyType?: string;
  totalCapacity?: number;
  availableRooms?: number;
}

interface ILocation {
  address?: {
    street?: string;
    city?: string;
  };
  coordinates?: [number, number];
  nearbyPlaces?: string[];
}

interface ISpecifications {
  size?: number;
  bedrooms?: number;
  bathrooms?: number;
  floorNumber?: number;
}

interface IFinancials {
  rent?: number;
  securityDeposit?: number;
}

interface ILeaseTerms {
  leaseDuration?: string;
  availableFrom?: Date;
}

interface IInfo {
  overview?: IOverview;
  location?: ILocation;
  specifications?: ISpecifications;
  roommates?: string[];
  financials?: IFinancials;
  leaseTerms?: ILeaseTerms;
  images?: string[];
}

interface IAmenities {
  general?: string[];
  kitchen?: string[];
  bathroom?: string[];
  bedroom?: string[];
  outdoor?: string[];
  entertainment?: string[];
  safety?: string[];
}

interface IDetails {
  AC?: boolean;
  Parking?: boolean;
  Balcony?: boolean;
  Furnished?: boolean;
  Elevator?: boolean;
  "Pet Friendly"?: boolean;
  "Smoking Allowed"?: boolean;
}

interface IPreferences {
  ageRange?: [number, number];
  gender?: string[];
  occupations?: string[];
  sharedInterests?: string[];
}

// 2. Define the main Apartment document interface
export interface IApartment extends Document {
  user: Types.ObjectId;
  info?: IInfo;
  amenities?: IAmenities;
  details?: IDetails;
  questionnaire?: Types.ObjectId;
  preferences?: IPreferences;
  likes?: Types.ObjectId[];
  dislikes?: Types.ObjectId[];
  matches?: Types.ObjectId[];
}

// 3. Define the Apartment schema
const apartmentSchema: Schema<IApartment> = new Schema<IApartment>({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  info: {
    overview: {
      title: String,
      description: String,
      propertyType: String,
      totalCapacity: Number,
      availableRooms: Number,
    },
    location: {
      address: {
        street: String,
        city: String,
      },
      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
      nearbyPlaces: [String],
    },
    specifications: {
      size: Number,
      bedrooms: Number,
      bathrooms: Number,
      floorNumber: Number,
    },
    roommates: [String],
    financials: {
      rent: Number,
      securityDeposit: Number,
    },
    leaseTerms: {
      leaseDuration: String,
      availableFrom: Date,
    },
    images: [String],
  },
  amenities: {
    general: [String],
    kitchen: [String],
    bathroom: [String],
    bedroom: [String],
    outdoor: [String],
    entertainment: [String],
    safety: [String],
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
  questionnaire: {
    type: Schema.Types.ObjectId,
    ref: "Question",
  },
  preferences: {
    ageRange: [Number],
    gender: [String],
    occupations: [String],
    sharedInterests: [String],
  },
  likes: [{ type: Schema.Types.ObjectId, ref: "Roommate" }],
  dislikes: [{ type: Schema.Types.ObjectId, ref: "Roommate" }],
  matches: [{ type: Schema.Types.ObjectId, ref: "Roommate" }],
});

// 4. Create and export the Apartment model
const Apartment = model<IApartment>("Apartment", apartmentSchema);

export default Apartment;
