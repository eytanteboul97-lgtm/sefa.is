import Image from "next/image";
import { cn } from "@/lib/utils";
import { shimmerDataUrl } from "@/lib/blur-placeholder";

export function TicketCard({
  image,
  name,
  category,
  rating,
  reviews,
  status,
  className,
}: {
  image: string;
  name: string;
  category: string;
  rating: number;
  reviews: number;
  status: string;
  className?: string;
}) {
  return (
    <div className={cn("ticket tilt-card shadow-glass transition-transform duration-500 hover:-translate-y-2 hover:shadow-glass-lg", className)}>
      <div className="relative h-48 w-full">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(min-width: 1024px) 260px, (min-width: 640px) 44vw, 90vw"
          placeholder="blur"
          blurDataURL={shimmerDataUrl(600, 400)}
          className="object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-3 py-1 font-mono text-[11px] text-paper backdrop-blur">
          {status}
        </span>
      </div>

      <span className="ticket-notch ticket-notch--left" />
      <span className="ticket-notch ticket-notch--right" />

      <div className="px-5 pb-5 pt-8">
        <h3 className="font-display text-lg font-semibold">{name}</h3>
        <p className="mt-0.5 text-sm text-ink/55">{category}</p>
        <div className="mt-3 flex items-center justify-between font-mono text-xs text-ink/60">
          <span>★ {rating.toFixed(1)} ({reviews})</span>
        </div>
      </div>
    </div>
  );
}
