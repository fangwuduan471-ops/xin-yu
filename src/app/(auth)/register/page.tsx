import Link from "next/link";

import { isClosedBetaEnabled } from "@/lib/beta-access";
import { registerAction } from "./actions";

export default async function RegisterPage({ searchParams }: PageProps<"/register">) {
  const { error } = await searchParams;
  const isClosedBeta = isClosedBetaEnabled();
  const errorMessage = typeof error === "string" ? error : undefined;

  return (
    <main className="auth-page">
      <Link className="brand" href="/"><span className="brand-mark" aria-hidden="true" /><span>心屿</span></Link>
      <section className="auth-card" aria-labelledby="register-title">
        <p className="eyebrow">{isClosedBeta ? "CLOSED BETA" : "START WRITING"}</p>
        <h1 id="register-title">{isClosedBeta ? "申请测试资格" : "加入心屿"}</h1>
        <p>{isClosedBeta ? "心屿正在小范围测试。请填写管理员提供的邀请码。" : "在这里写下感受，等待被认真读见。"}</p>
        <form action={registerAction}>
          <label>用户名<input name="username" type="text" autoComplete="username" minLength={2} maxLength={24} required /></label>
          <label>邮箱<input name="email" type="email" autoComplete="email" required /></label>
          <label>密码<input name="password" type="password" autoComplete="new-password" minLength={10} required /></label>
          {isClosedBeta && <label>邀请码<input name="inviteCode" type="password" autoComplete="off" required /></label>}
          {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
          <button className="button button-primary" type="submit">{isClosedBeta ? "加入测试" : "创建账号"}</button>
        </form>
        <p className="auth-switch">已有账号？<Link href="/login">去登录</Link>{isClosedBeta && " · 没有邀请码？请联系邀请你的同学或管理员。"}</p>
      </section>
    </main>
  );
}
