"use server";

import { redirect } from "next/navigation";

import { RegistrationError, registerUser } from "@/server/identity/register-user";

export async function registerAction(formData: FormData) {
  try {
    await registerUser({
      username: String(formData.get("username") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    }, formData.get("inviteCode"));
  } catch (error) {
    const message = error instanceof Error ? error.message : "暂时无法完成注册，请稍后重试。";
    const query = error instanceof RegistrationError ? "error" : "error";
    redirect(`/register?${query}=${encodeURIComponent(message)}`);
  }
  redirect("/login?registered=1");
}
