/* eslint-disable prettier/prettier */
import * as mongooose from 'mongoose';

export const JogadorSchema = new mongooose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  ranking: { type: String, required: true },
  rankingPosition: { type: Number, required: true },
  urlProfilePic: { type: String },
}, { timestamps: true, collection: 'jogadores' });
