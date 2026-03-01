import type { Metadata } from "next";
import Link from "next/link";
import { getAllLegalDocuments } from "@/lib/legal-docs";

export const metadata: Metadata = {
  title: "BiMakas Legal Documents",
  description: "Legal documents and policies for BiMakas.",
};

export default function LegalIndexPage() {
  const documents = getAllLegalDocuments();

  return (
    <main className="min-h-screen bg-[#FFF8F0] px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-100 sm:p-10">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Legal Documents</h1>
        <p className="mt-3 text-base text-gray-600">
          Access all policies and legal notices for BiMakas.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {documents.map((document) => (
            <Link
              key={document.slug}
              href={`/legal/${document.slug}`}
              className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-gray-300 hover:shadow-md"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                /legal/{document.slug}
              </p>
              <h2 className="mt-2 text-lg font-semibold text-gray-900">{document.title.en}</h2>
              <p className="mt-1 text-sm text-gray-600">{document.description.en}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
