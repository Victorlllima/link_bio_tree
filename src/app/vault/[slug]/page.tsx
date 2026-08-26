import { RESOURCES, getResource } from "@/data/vault-resources";
import { notFound } from "next/navigation";
import Link from "next/link";
import ResourceView from "./ResourceView";

export function generateStaticParams() {
  return RESOURCES.map((r) => ({ slug: r.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const r = getResource(params.slug);
  return { title: r ? `${r.titulo} — RedVault` : "RedVault" };
}

export default function ResourcePage({ params }: { params: { slug: string } }) {
  const r = getResource(params.slug);
  if (!r) return notFound();
  return <ResourceView resource={r} />;
}

// server component wraps client view for copy interactivity
export const dynamic = "force-static";
void Link;
