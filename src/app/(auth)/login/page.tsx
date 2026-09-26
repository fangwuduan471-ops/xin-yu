import Link from "next/link";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn } from "@/auth";

async function loginAction(formData: FormData) {
  "use server";

  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    // Auth.js throws this expected error for an incorrect credentials pair.
    // Redirect it back to the form instead of surfacing a 500 page.
    if (error instanceof AuthError && error.type === "CredentialsSignin") {
      redirect("/login?error=credentials");
    }
    throw error;
  }
}

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { error } = await searchParams;
  const errorMessage = error === "credentials" ? "邮箱或密码不正确，请重新输入。" : undefined;

  return (
    <main className="auth-page">
      <Link className="brand" href="/"><span className="brand-mark" aria-hidden="true" /><span>心屿</span></Link>
      <section className="auth-card" aria-labelledby="login-title">
        <p className="eyebrow">WELCOME BACK</p>
        <h1 id="login-title">登录心屿</h1>
        <p>继续阅读，也继续写下你的故事。</p>
        <form action={loginAction}>
          {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
          <label>邮箱<input name="email" type="email" autoComplete="email" required /></label>
          <label>密码<input name="password" type="password" autoComplete="current-password" required /></label>
          <button className="button button-primary" type="submit">登录</button>
        </form>
        <p className="auth-switch">还没有账号？<Link href="/register">加入心屿</Link></p>
      </section>
    </main>
  );
}
