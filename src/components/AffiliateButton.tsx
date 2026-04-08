import { generateAffiliateLink, hasProspinLink } from "@/lib/affiliate";

interface AffiliateButtonProps {
  slug: string;
  brand: string;
  model: string;
}

export default function AffiliateButton({ slug, brand, model }: AffiliateButtonProps) {
  const href = generateAffiliateLink(slug, brand, model);
  const isProSpin = hasProspinLink(slug);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded uppercase tracking-wide hover:bg-primary-hover transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {isProSpin ? "Comprar na Pro Spin" : "Buscar nas lojas"}
    </a>
  );
}
