import mongoose from "mongoose";

const todo_list_Model = new mongoose.Schema({
  taskname: String,
});

export const tasklist =
  mongoose.models.tasklists || mongoose.model("tasklists", todo_list_Model);
