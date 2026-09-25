import Link from "next/link";

type WorkCardProps = {
  work: {
    slug: string;
    title: string;
    summary: string;
    publishedAt: Date | null;
    author: { username: string };
    category: { name: string };
    tags: { tag: { name: string } }[];
  };
};

export function WorkCard({ work }: WorkCardProps) {
  return (
    <article className="public-work-card">
      <p className="work-category">{work.category.name}</p>
      <h2><Link href={`/works/${work.slug}`}>{work.title}</Link></h2>
      <p>{work.summary}</p>
      <div className="tag-row">{work.tags.map(({ tag }) => <span key={tag.name}>#{tag.name}</span>)}</div>
      <footer><span>{work.author.username}</span><time dateTime={work.publishedAt?.toISOString()}>{work.publishedAt?.toLocaleDateString("zh-CN")}</time></footer>
    </article>
  );
}
