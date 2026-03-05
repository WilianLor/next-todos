import mongoose, {
  type Document,
  type InferSchemaType,
  model,
  Schema,
  type SchemaTimestampsConfig,
} from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    name: String,
    image: String,
  },
  { timestamps: true },
);

export type User = InferSchemaType<typeof userSchema> & Document;

type UserModel = User & SchemaTimestampsConfig;

export const UserModel =
  (mongoose.models.User as mongoose.Model<UserModel>) ??
  model<UserModel>("User", userSchema);
