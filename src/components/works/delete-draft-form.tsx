"use client";

import { useFormStatus } from "react-dom";

type DeleteDraftFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  title: string;
};

function DeleteButton() {
  const { pending } = useFormStatus();

  return <button className="button button-danger" type="submit" disabled={pending}>{pending ? "正在删除…" : "删除草稿"}</button>;
}

export function DeleteDraftForm({ action, title }: DeleteDraftFormProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`确定删除草稿《${title}》吗？删除后无法恢复。`)) event.preventDefault();
      }}
    >
      <DeleteButton />
    </form>
  );
}
