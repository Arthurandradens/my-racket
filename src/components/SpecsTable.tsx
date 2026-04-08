import type { Racket } from "@/lib/types";

interface SpecsTableProps {
  racket: Racket;
}

export default function SpecsTable({ racket }: SpecsTableProps) {
  const rows: { label: string; value: string | number | null }[] = [
    { label: "Peso", value: racket.weight !== null ? `${racket.weight} g` : null },
    { label: "Cabeca", value: racket.head_size ? `${racket.head_size} in²` : null },
    { label: "Rigidez (RA)", value: racket.ra ?? null },
    { label: "Balanco", value: racket.balance_mm !== null ? `${racket.balance_mm} mm` : null },
    { label: "Swingweight", value: racket.swingweight !== null ? racket.swingweight : null },
    { label: "Padrao de corda", value: racket.string_pattern ?? null },
  ];

  return (
    <table className="w-full text-sm border-collapse">
      <tbody>
        {rows.map(({ label, value }) => (
          <tr key={label} className="border-b border-surface last:border-0">
            <td className="py-2 pr-4 text-text-muted font-medium w-1/2">{label}</td>
            <td className="py-2 text-text">{value !== null && value !== undefined ? value : "—"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
