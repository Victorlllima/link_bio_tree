import { RESOURCES, getResource } from "@/data/vault-resources";
import { notFound } from "next/navigation";
import ResourceView from "./ResourceView";

export function generateStaticParams() {
  return RESOURCES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = getResource(slug);
  return { title: r ? `${r.titulo} — RedVault` : "RedVault" };
}

export default async function ResourcePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = getResource(slug);
  if (!r) return notFound();
  return <ResourceView resource={r} />;
}
