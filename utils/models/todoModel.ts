import mongoose, { Document, Schema } from "mongoose";

interface ITodo extends Document {
  text: string;
  completed: boolean;
}

const TodoSchema: Schema = new Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

export default mongoose.models.Todo ||
  mongoose.model<ITodo>("Todo", TodoSchema);
