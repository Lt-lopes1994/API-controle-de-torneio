/* eslint-disable prettier/prettier */
import * as mongooose from 'mongoose';

export const JogadorSchema = new mongooose.Schema(
  {
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    name: { type: String, required: true },
    ranking: { type: String },
    rankingPosition: { type: Number },
    urlProfilePic: { type: String },
  },
  { timestamps: true, collection: 'jogadores' },
);
