import { timingSafeEqual } from "node:crypto";

import { RegistrationError } from "@/server/identity/registration-error";

/** Whether the site is accepting registrations by invitation only. */
export function isClosedBetaEnabled() {
  return process.env.BETA_MODE === "true";
}

/**
 * Validates the invite server-side. The expected code is never sent to the
 * browser and a missing code fails closed while closed beta is enabled.
 */
export function requireValidInviteCode(value: unknown) {
  if (!isClosedBetaEnabled()) return;

  const expected = process.env.BETA_INVITE_CODE;
  const submitted = typeof value === "string" ? value.trim() : "";

  if (!expected) {
    throw new RegistrationError("封闭测试尚未配置邀请码，请联系管理员。");
  }

  const expectedBuffer = Buffer.from(expected);
  const submittedBuffer = Buffer.from(submitted);
  const isValid =
    expectedBuffer.length === submittedBuffer.length &&
    timingSafeEqual(expectedBuffer, submittedBuffer);

  if (!isValid) {
    throw new RegistrationError("邀请码无效，请向邀请你的管理员确认。");
  }
}
