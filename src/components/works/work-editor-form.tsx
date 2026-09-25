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
  return (
    <form action={action} className="editor-form">
      {workId && <input type="hidden" name="workId" value={workId} />}
      {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
      <label>标题<input name="title" maxLength={120} required defaultValue={values?.title} placeholder="给这篇作品取一个名字" /></label>
      <label>简介<textarea name="summary" maxLength={300} required defaultValue={values?.summary} placeholder="用一两句话介绍它" /></label>
      <label>分类<select name="categoryId" required defaultValue={values?.categoryId ?? ""}><option value="" disabled>请选择分类</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
      <label>标签<input name="tags" defaultValue={values?.tagNames?.join("，")} placeholder="青春，成长，校园（最多 8 个，以逗号分隔）" /></label>
      <label>正文（支持 Markdown）<textarea className="editor-content" name="contentMarkdown" required defaultValue={values?.contentMarkdown} placeholder="从这里开始写……" /></label>
      <p className="editor-note">保存草稿仅自己可见；提交后将进入人工审核，通过后才会公开发布。</p>
      <div className="editor-actions"><button className="button button-outline" name="intent" value="draft" type="submit">保存草稿</button><button className="button button-primary" name="intent" value="submit" type="submit">提交审核</button></div>
    </form>
  );
}
