"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type CategoryOption = { id: string; name: string };

type EditorValues = {
  title?: string;
  summary?: string;
  categoryId?: string;
  tagNames?: string[];
  contentMarkdown?: string;
};

type WorkEditorFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  categories: CategoryOption[];
  errorMessage?: string;
  values?: EditorValues;
  workId?: string;
};

export function WorkEditorForm({ action, categories, errorMessage, values, workId }: WorkEditorFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const revisionRef = useRef(0);
  const [draftId, setDraftId] = useState(workId);
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveState, setSaveState] = useState("开始写作后会自动保存草稿");
  const [contentLength, setContentLength] = useState(values?.contentMarkdown?.trim().length ?? 0);

  const readPayload = useCallback(() => {
    const form = formRef.current;
    if (!form) return null;
    const data = new FormData(form);
    const title = String(data.get("title") ?? "").trim();
    const summary = String(data.get("summary") ?? "").trim();
    const contentMarkdown = String(data.get("contentMarkdown") ?? "");
    const categoryId = String(data.get("categoryId") ?? "");
    const tagNames = String(data.get("tags") ?? "").split("，").join(",").split(",").map((tag) => tag.trim()).filter(Boolean);
    if (!title || !summary || !contentMarkdown.trim() || !categoryId) return null;
    return { title, summary, contentMarkdown, categoryId, tagNames };
  }, []);

  function markDirty() {
    revisionRef.current += 1;
    setIsDirty(true);
    setSaveState("正在编辑…");
  }

  const autoSave = useCallback(async () => {
    const payload = readPayload();
    if (!payload) {
      setSaveState("填写标题、简介、分类和正文后将自动保存");
      return;
    }
    const revision = revisionRef.current;
    setSaveState("正在自动保存…");
    try {
      const endpoint = draftId ? `/api/works/${draftId}` : "/api/works";
      const response = await fetch(endpoint, {
        method: draftId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { data?: { id: string }; error?: string };
      if (!response.ok || !result.data) throw new Error(result.error ?? "自动保存失败，请稍后重试。");
      if (!draftId) {
        setDraftId(result.data.id);
        window.history.replaceState(null, "", `/write/${result.data.id}`);
      }
      if (revisionRef.current === revision) setIsDirty(false);
      setSaveState(revisionRef.current === revision ? "已自动保存" : "正在编辑…");
    } catch (error) {
      setSaveState(error instanceof Error ? error.message : "自动保存失败，请手动保存草稿。");
    }
  }, [draftId, readPayload]);

  useEffect(() => {
    if (!isDirty || isSubmitting) return;
    const timer = window.setTimeout(() => void autoSave(), 1800);
    return () => window.clearTimeout(timer);
  }, [autoSave, isDirty, isSubmitting]);

  return (
    <form ref={formRef} action={action} className="editor-form" onInput={markDirty} onSubmit={() => setIsSubmitting(true)}>
      {draftId && <input type="hidden" name="workId" value={draftId} />}
      {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
      <label>标题<input name="title" maxLength={120} required defaultValue={values?.title} placeholder="给这篇作品取一个名字" /></label>
      <label>简介<textarea name="summary" maxLength={300} required defaultValue={values?.summary} placeholder="用一两句话介绍它" /></label>
      <label>分类<select name="categoryId" required defaultValue={values?.categoryId ?? ""}><option value="" disabled>请选择分类</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
      <label>标签<input name="tags" defaultValue={values?.tagNames?.join("，")} placeholder="青春，成长，校园（最多 8 个，以逗号分隔）" /></label>
      <label>正文（支持 Markdown）<textarea className="editor-content" name="contentMarkdown" required defaultValue={values?.contentMarkdown} onInput={(event) => setContentLength(event.currentTarget.value.trim().length)} placeholder="从这里开始写……" /></label>
      <div className="editor-status" aria-live="polite"><span>正文 {contentLength} 字 · 提交审核至少 20 字</span><span>{saveState}</span></div>
      <p className="editor-note">保存草稿仅自己可见；提交后将进入人工审核，通过后才会公开发布。</p>
      <div className="editor-actions"><button className="button button-outline" name="intent" value="draft" type="submit">保存草稿</button><button className="button button-primary" name="intent" value="submit" type="submit">提交审核</button></div>
    </form>
  );
}
