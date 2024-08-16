import { connectionstr } from "@/app/util/db";
import { tasklist } from "@/app/util/model/tasklist";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PUT(request, content) {
  const Id = content.params.id;
  const filter = { _id: Id };
  const payload = await request.json();

  console.log(payload);

  await mongoose.connect(connectionstr);
  const result = await tasklist.findOneAndUpdate(filter, payload);

  return NextResponse.json({ result, success: true });
}

export async function GET(request, content) {
  const Id = content.params.id;
  const record = { _id: Id };

  await mongoose.connect(connectionstr);
  const result = await tasklist.findById(record);

  return NextResponse.json({ result, success: true });
}

export async function DELETE(request, content) {
  const Id = content.params.id;
  const record = { _id: Id };

  await mongoose.connect(connectionstr);
  const result = await tasklist.deleteOne(record);

  return NextResponse.json({ result, success: true });
}
