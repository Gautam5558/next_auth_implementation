import { currentUser } from "@/lib/currentUser";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await currentUser();
  console.log("kivve ho ji");
  console.log(user);
  // @ts-ignore
  if (user.role === UserRole.ADMIN) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false });
}
