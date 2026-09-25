import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { RegistrationError, registerUser } from "@/server/identity/register-user";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await registerUser(body, body.inviteCode);
    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError || error instanceof RegistrationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Registration failed", error);
    return NextResponse.json({ error: "暂时无法完成注册，请稍后重试。" }, { status: 500 });
  }
}
