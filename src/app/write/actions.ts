"use server";

import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { auth } from "@/auth";
import { WorkError, createDraft, submitForReview, updateDraft } from "@/server/works/work-service";

function readWorkInput(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    contentMarkdown: String(formData.get("contentMarkdown") ?? ""),
    categoryId: String(formData.get("categoryId") ?? ""),
    tagNames: String(formData.get("tags") ?? "").split("，").join(",").split(",").filter((tag) => tag.trim().length > 0),
  };
}

function workErrorMessage(error: unknown) {
  if (error instanceof ZodError) return error.issues[0]?.message ?? "作品内容不符合要求。";
  if (error instanceof WorkError) return error.message;
  return "暂时无法保存作品，请稍后重试。";
}

export async function saveWorkAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  let draft;
  try {
    draft = await createDraft(session.user.id, readWorkInput(formData));
  } catch (error) {
    redirect(`/write?error=${encodeURIComponent(workErrorMessage(error))}`);
  }

  if (formData.get("intent") === "submit") {
    try {
      await submitForReview(session.user.id, draft.id);
    } catch (error) {
      // The draft has already been safely saved. Continue editing it in place.
      redirect(`/write/${draft.id}?error=${encodeURIComponent(workErrorMessage(error))}`);
    }
  }
  redirect("/dashboard");
}

export async function updateWorkAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const workId = String(formData.get("workId") ?? "");

  try {
    await updateDraft(session.user.id, workId, readWorkInput(formData));
  } catch (error) {
    redirect(`/write/${workId}?error=${encodeURIComponent(workErrorMessage(error))}`);
  }

  if (formData.get("intent") === "submit") {
    try {
      await submitForReview(session.user.id, workId);
    } catch (error) {
      redirect(`/write/${workId}?error=${encodeURIComponent(workErrorMessage(error))}`);
    }
  }
  redirect("/dashboard");
}
