import { promises as fs } from "node:fs";
import path from "node:path";

export type LegalDocumentConfig = {
  slug: string;
  fileName: string;
  title: {
    en: string;
    tr: string;
  };
  description: {
    en: string;
    tr: string;
  };
};

export type LegalDocumentContent = {
  en: string;
  tr: string;
};

const LEGAL_DIR = path.join(process.cwd(), "legal");

export const LEGAL_DOCUMENTS: LegalDocumentConfig[] = [
  {
    slug: "privacy-policy",
    fileName: "PRIVACY_POLICY.md",
    title: {
      en: "Privacy Policy",
      tr: "Gizlilik Politikasi",
    },
    description: {
      en: "How BiMakas handles and protects personal data.",
      tr: "BiMakas'in kisisel verileri nasil isledigi ve korudugu.",
    },
  },
  {
    slug: "terms-of-use",
    fileName: "TERMS_OF_USE.md",
    title: {
      en: "Terms of Use",
      tr: "Kullanim Sartlari",
    },
    description: {
      en: "Rules and legal terms for using BiMakas services.",
      tr: "BiMakas hizmetlerinin kullanimina dair kurallar ve hukuki sartlar.",
    },
  },
  {
    slug: "support",
    fileName: "SUPPORT.md",
    title: {
      en: "Support",
      tr: "Destek",
    },
    description: {
      en: "Official support channels and response guidelines.",
      tr: "Resmi destek kanallari ve donus sureleri.",
    },
  },
  {
    slug: "faq",
    fileName: "FAQ.md",
    title: {
      en: "FAQ",
      tr: "Sikca Sorulan Sorular",
    },
    description: {
      en: "Frequently asked questions about BiMakas services.",
      tr: "BiMakas hizmetleriyle ilgili sikca sorulan sorular.",
    },
  },
  {
    slug: "cancellation-and-refund-policy",
    fileName: "CANCELLATION_AND_REFUND_POLICY.md",
    title: {
      en: "Cancellation and Refund Policy",
      tr: "Iptal ve Iade Politikasi",
    },
    description: {
      en: "Rules for booking cancellations and refund processing.",
      tr: "Randevu iptali ve iade sureclerine dair kurallar.",
    },
  },
  {
    slug: "account-deletion",
    fileName: "ACCOUNT_DELETION_AND_DATA_REQUEST.md",
    title: {
      en: "Account Deletion and Data Requests",
      tr: "Hesap Silme ve Veri Talepleri",
    },
    description: {
      en: "How users can request account deletion and data actions.",
      tr: "Kullanicilarin hesap silme ve veri taleplerini iletme sureci.",
    },
  },
  {
    slug: "app-store-legal-links",
    fileName: "APP_STORE_LEGAL_LINKS.md",
    title: {
      en: "App Store Legal Links",
      tr: "App Store Hukuki Linkleri",
    },
    description: {
      en: "Recommended legal URL mapping for App Store submissions.",
      tr: "App Store yayinlarinda onerilen hukuki URL eslestirmesi.",
    },
  },
];

const ENGLISH_SECTION_MARKERS = [
  /^#+\s*(english|en|ingilizce)\b/i,
  /^english\s+version\b/i,
  /^ingilizce\s+hali\b/i,
];

const TURKISH_SECTION_MARKERS = [
  /^#+\s*(turkce|türkçe|tr|turkish)\b/i,
  /^turkish\s+version\b/i,
  /^turkce\s+hali\b/i,
  /^türkçe\s+hali\b/i,
];

const ENGLISH_FALLBACK_TEXT =
  "The English version of this document will be published soon. Please review the Turkish version below in the meantime.";

const normalize = (value: string) => value.replace(/\r\n/g, "\n").trim();

const findSectionStart = (lines: string[], patterns: RegExp[]) => {
  const index = lines.findIndex((line) => patterns.some((pattern) => pattern.test(line.trim())));
  return index === -1 ? -1 : index + 1;
};

const splitBilingualContent = (rawMarkdown: string): LegalDocumentContent => {
  const clean = normalize(rawMarkdown);
  const lines = clean.split("\n");

  const englishStart = findSectionStart(lines, ENGLISH_SECTION_MARKERS);
  const turkishStart = findSectionStart(lines, TURKISH_SECTION_MARKERS);

  if (englishStart !== -1 && turkishStart !== -1) {
    if (englishStart < turkishStart) {
      return {
        en: normalize(lines.slice(englishStart, turkishStart - 1).join("\n")),
        tr: normalize(lines.slice(turkishStart).join("\n")),
      };
    }

    return {
      en: normalize(lines.slice(englishStart).join("\n")),
      tr: normalize(lines.slice(turkishStart, englishStart - 1).join("\n")),
    };
  }

  if (englishStart !== -1) {
    return {
      en: normalize(lines.slice(englishStart).join("\n")),
      tr: "",
    };
  }

  if (turkishStart !== -1) {
    return {
      en: ENGLISH_FALLBACK_TEXT,
      tr: normalize(lines.slice(turkishStart).join("\n")),
    };
  }

  return {
    en: ENGLISH_FALLBACK_TEXT,
    tr: clean,
  };
};

export const getAllLegalDocuments = (): LegalDocumentConfig[] => LEGAL_DOCUMENTS;

export const getLegalDocumentBySlug = (
  slug: string
): LegalDocumentConfig | undefined => LEGAL_DOCUMENTS.find((document) => document.slug === slug);

export const getLegalDocumentContent = async (
  slug: string
): Promise<LegalDocumentContent | null> => {
  const document = getLegalDocumentBySlug(slug);

  if (!document) {
    return null;
  }

  const filePath = path.join(LEGAL_DIR, document.fileName);
  const markdown = await fs.readFile(filePath, "utf-8");

  return splitBilingualContent(markdown);
};
