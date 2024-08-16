import { connectionstr } from "@/app/util/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { tasklist } from "@/app/util/model/tasklist";

export async function GET() {
  let data = [];
  let success = true;
  try {
    await mongoose.connect(connectionstr);
    data = await tasklist.find();
    // console.log(data);
  } catch (error) {
    data = { result: "error" };
    success = false;
  }
  return NextResponse.json({ result: data, success });
}

export async function POST(request) {
  let success = true;
  const payload = await request.json();
  await mongoose.connect(connectionstr);

  let Tasklist = new tasklist(payload);
  const result = await Tasklist.save();

  return NextResponse.json({ result, success });
}

export async function PUT() {}
