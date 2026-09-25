import Link from "next/link";

import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <Link className="brand" href="/"><span className="brand-mark">心</span><span>心屿</span></Link>
      <section className="auth-card" aria-labelledby="login-title">
        <p className="eyebrow">WELCOME BACK</p>
        <h1 id="login-title">登录心屿</h1>
        <p>继续阅读，也继续写下你的故事。</p>
        <form action={async (formData) => {
          "use server";
          await signIn("credentials", {
            email: String(formData.get("email") ?? ""),
            password: String(formData.get("password") ?? ""),
            redirectTo: "/dashboard",
          });
        }}>
          <label>邮箱<input name="email" type="email" autoComplete="email" required /></label>
          <label>密码<input name="password" type="password" autoComplete="current-password" required /></label>
          <button className="button button-primary" type="submit">登录</button>
        </form>
        <p className="auth-switch">还没有账号？<Link href="/register">加入心屿</Link></p>
      </section>
    </main>
  );
}
