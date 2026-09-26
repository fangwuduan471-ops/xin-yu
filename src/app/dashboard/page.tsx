import { redirect } from "next/navigation";

import { auth } from "@/auth";
import Link from "next/link";
import { deleteDraftAction } from "@/app/write/actions";
import { DeleteDraftForm } from "@/components/works/delete-draft-form";
import { getAuthorDashboard } from "@/server/authors/author-service";

const workStatusMeta = {
  DRAFT: { label: "草稿", className: "status-draft" },
  PENDING_REVIEW: { label: "审核中", className: "status-review" },
  PUBLISHED: { label: "已发布", className: "status-published" },
  REJECTED: { label: "审核未通过", className: "status-rejected" },
  TAKEN_DOWN: { label: "已下架", className: "status-taken-down" },
} as const;

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const works = await getAuthorDashboard(session.user.id);
  const drafts = works.filter((work) => work.status === "DRAFT").length;
  const pending = works.filter((work) => work.status === "PENDING_REVIEW").length;
  const published = works.filter((work) => work.status === "PUBLISHED").length;
  return <main className="dashboard-page"><header className="dashboard-header"><div><p className="eyebrow">AUTHOR CENTER</p><h1>你好，{session.user.username}</h1></div><Link className="button button-primary" href="/write">写新作品</Link></header><section className="stats-grid"><article><span>全部作品</span><b>{works.length}</b></article><article><span>草稿</span><b>{drafts}</b></article><article><span>审核中</span><b>{pending}</b></article><article><span>已发布</span><b>{published}</b></article></section><section className="dashboard-list"><h2>我的作品</h2>{works.length ? works.map((work) => { const isEditable = work.status === "DRAFT" || work.status === "REJECTED"; const status = workStatusMeta[work.status]; const deleteAction = deleteDraftAction.bind(null, work.id); return <article key={work.id}><div><p className="dashboard-work-meta"><span>{work.category.name}</span><span className={`work-status-badge ${status.className}`}>{status.label}</span></p><h3>{work.title}</h3></div><div className="dashboard-work-actions"><span>{work._count.likes} 喜欢 · {work._count.collections} 收藏 · {work._count.comments} 评论</span>{isEditable && <Link className="button button-outline" href={`/write/${work.id}`}>继续编辑</Link>}{work.status === "DRAFT" && <DeleteDraftForm action={deleteAction} title={work.title} />}</div></article>; }) : <p className="empty-state">还没有作品，开始写下第一段文字吧。</p>}</section></main>;
}
