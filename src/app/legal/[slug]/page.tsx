import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllLegalDocuments,
  getLegalDocumentBySlug,
  getLegalDocumentContent,
} from "@/lib/legal-docs";

type Block =
  | { type: "h1" | "h2" | "h3" | "p"; text: string }
  | { type: "ul" | "ol"; items: string[] };

const parseMarkdownBlocks = (content: string): Block[] => {
  const lines = content.split(/\r?\n/);
  const blocks: Block[] = [];

  let listType: "ul" | "ol" | null = null;
  let listItems: string[] = [];

  const flushList = () => {
    if (!listType) {
      return;
    }

    blocks.push({ type: listType, items: listItems });
    listType = null;
    listItems = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushList();
      continue;
    }

    const unorderedMatch = line.match(/^-\s+(.+)/);
    if (unorderedMatch) {
      if (listType && listType !== "ul") {
        flushList();
      }

      listType = "ul";
      listItems.push(unorderedMatch[1]);
      continue;
    }

    const orderedMatch = line.match(/^\d+\.\s+(.+)/);
    if (orderedMatch) {
      if (listType && listType !== "ol") {
        flushList();
      }

      listType = "ol";
      listItems.push(orderedMatch[1]);
      continue;
    }

    flushList();

    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4) });
      continue;
    }

    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3) });
      continue;
    }

    if (line.startsWith("# ")) {
      blocks.push({ type: "h1", text: line.slice(2) });
      continue;
    }

    blocks.push({ type: "p", text: line });
  }

  flushList();
  return blocks;
};

const MarkdownSection = ({ content }: { content: string }) => {
  if (!content.trim()) {
    return <p className="text-sm text-gray-500">This section is empty.</p>;
  }

  const blocks = parseMarkdownBlocks(content);

  return (
    <div className="space-y-3 text-gray-800">
      {blocks.map((block, index) => {
        if (block.type === "h1") {
          return (
            <h3 key={index} className="text-xl font-bold text-gray-900">
              {block.text}
            </h3>
          );
        }

        if (block.type === "h2") {
          return (
            <h4 key={index} className="text-lg font-semibold text-gray-900">
              {block.text}
            </h4>
          );
        }

        if (block.type === "h3") {
          return (
            <h5 key={index} className="text-base font-semibold text-gray-900">
              {block.text}
            </h5>
          );
        }

        if (block.type === "ul") {
          return (
            <ul key={index} className="list-disc space-y-1 pl-6 text-sm sm:text-base">
              {block.items.map((item, itemIndex) => (
                <li key={`${index}-${itemIndex}`}>{item}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "ol") {
          return (
            <ol key={index} className="list-decimal space-y-1 pl-6 text-sm sm:text-base">
              {block.items.map((item, itemIndex) => (
                <li key={`${index}-${itemIndex}`}>{item}</li>
              ))}
            </ol>
          );
        }

        return (
          <p key={index} className="text-sm leading-7 text-gray-700 sm:text-base">
            {block.text}
          </p>
        );
      })}
    </div>
  );
};

export function generateStaticParams() {
  return getAllLegalDocuments().map((document) => ({
    slug: document.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const document = getLegalDocumentBySlug(slug);

  if (!document) {
    return {
      title: "Legal Document",
    };
  }

  return {
    title: `${document.title.en} | BiMakas`,
    description: document.description.en,
  };
}

export default async function LegalDocumentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const document = getLegalDocumentBySlug(slug);

  if (!document) {
    notFound();
  }

  const content = await getLegalDocumentContent(slug);

  if (!content) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#FFF8F0] px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-100 sm:p-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Link href="/legal" className="text-sm font-medium text-gray-500 hover:text-gray-700">
            &larr; Back to legal index
          </Link>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
            /legal/{document.slug}
          </span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{document.title.en}</h1>
        <p className="mt-2 text-sm text-gray-600 sm:text-base">{document.description.en}</p>

        <section className="mt-10 rounded-2xl border border-gray-200 bg-gray-50/50 p-6">
          <h2 className="text-lg font-semibold text-gray-900">İngilizce Hali</h2>
          <div className="mt-4">
            <MarkdownSection content={content.en} />
          </div>
        </section>

        <div className="my-8 text-center">
          <p className="font-mono text-sm text-gray-400">-----------------------</p>
        </div>

        <section className="rounded-2xl border border-gray-200 bg-gray-50/50 p-6">
          <h2 className="text-lg font-semibold text-gray-900">Türkçe Hali</h2>
          <div className="mt-4">
            <MarkdownSection content={content.tr} />
          </div>
        </section>
      </div>
    </main>
  );
}
