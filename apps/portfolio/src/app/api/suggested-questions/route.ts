import { NextResponse } from "next/server";
import { getSuggestedQuestions } from "@/lib/data";

export async function GET() {
  const questions = await getSuggestedQuestions();
  return NextResponse.json({ questions });
}
