import { generateAffiliateLink } from "@/lib/affiliate";

interface AffiliateButtonProps {
  brand: string;
  model: string;
}

export default function AffiliateButton({ brand, model }: AffiliateButtonProps) {
  const href = generateAffiliateLink(brand, model);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="inline-flex items-center justify-center gap-2 bg-green-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      Comprar
    </a>
  );
}
