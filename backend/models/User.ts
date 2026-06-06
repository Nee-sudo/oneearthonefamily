import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  id: string; // Map back and forth from mongodb _id/string custom ID
  name: string;
  username: string;
  email: string;
  dob: string;
  territory: string;
  flagEmoji: string;
  gender: string;
  currentRank: string;
  knowledgeCredits: number;
  contributionCredits: number;
  reputationScore: number;
  personalityTraits: string;
  bio: string;
  followers: number;
  following: number;
  onboardingCompleted: boolean;
  citizenOathAccepted: boolean;
  isCandidate: boolean;
  campaignManifesto: string;
  campaignVision: string;
  votesCount: number;
  hasVoted: boolean;
  profilePhoto: string;
  passphrase: string;
}

const UserSchema = new Schema<IUser>(
  {
    _id: { type: String, required: true }, // Store email or custom username ID directly
    name: { type: String, required: true },
    username: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true, lowercase: true, trim: true },
    dob: { type: String, default: "" },
    territory: { type: String, default: "Global" },
    flagEmoji: { type: String, default: "🌍" },
    gender: { type: String, default: "Male" },
    currentRank: { type: String, default: "Citizen" },
    knowledgeCredits: { type: Number, default: 0 },
    contributionCredits: { type: Number, default: 0 },
    reputationScore: { type: Number, default: 98 },
    personalityTraits: { type: String, default: "" },
    bio: { type: String, default: "Honorable citizen of the digital Empire. Committed to service and knowledge." },
    followers: { type: Number, default: 120 },
    following: { type: Number, default: 95 },
    onboardingCompleted: { type: Boolean, default: false },
    citizenOathAccepted: { type: Boolean, default: false },
    isCandidate: { type: Boolean, default: false },
    campaignManifesto: { type: String, default: "" },
    campaignVision: { type: String, default: "" },
    votesCount: { type: Number, default: 0 },
    hasVoted: { type: Boolean, default: false },
    profilePhoto: { type: String, default: "" },
    passphrase: { type: String, default: "1234" }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Pre-save auto rank calculation
UserSchema.pre<IUser>('save', function (next) {
  const totalCredits = (this.knowledgeCredits || 0) + (this.contributionCredits || 0);
  if (totalCredits >= 300) {
    this.currentRank = "Guardian";
  } else if (totalCredits >= 150) {
    this.currentRank = "Contributor";
  } else {
    this.currentRank = "Citizen";
  }
  next();
});

export const User = model<IUser>('User', UserSchema);
