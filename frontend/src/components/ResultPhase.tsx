import { DollarSign, FileText, Grid3X3, RefreshCw, Tag } from "lucide-react";
import ListingField from "./ListingField";
import type { Listing } from "../types/listing";

type ResultPhaseProps = {
  imageUrl: string;
  listing: Listing;
  fileName?: string;
  onReset: () => void;
};

function ResultPhase({ imageUrl, listing, fileName, onReset }: ResultPhaseProps) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(listing.price);

  return (
    <section className="w-full max-w-5xl">
      <div className="grid overflow-hidden border border-border bg-card md:grid-cols-[0.9fr_1.1fr]">
        <div className="flex min-h-80 flex-col border-b border-border bg-secondary/40 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Uploaded image
            </span>
          </div>
          <div className="flex flex-1 items-center justify-center p-5">
            <img
              src={imageUrl}
              alt={fileName ? `Uploaded item ${fileName}` : "Uploaded item"}
              className="max-h-115 w-full object-contain"
            />
          </div>
        </div>

        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                Listing generated
              </p>
              <h1 className="text-2xl font-semibold leading-tight text-foreground">
                {listing.title}
              </h1>
            </div>
            <button
              type="button"
              onClick={onReset}
              className="flex shrink-0 items-center gap-2 border border-border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <RefreshCw size={13} aria-hidden="true" />
              New
            </button>
          </div>

          <div className="grid gap-5">
            <ListingField icon={<FileText size={14} aria-hidden="true" />} label="Description">
              {listing.description}
            </ListingField>
            <div className="grid gap-5 sm:grid-cols-2">
              <ListingField icon={<Grid3X3 size={14} aria-hidden="true" />} label="Category">
                {listing.category}
              </ListingField>
              <ListingField icon={<DollarSign size={14} aria-hidden="true" />} label="Estimated value">
                {formattedPrice}
              </ListingField>
            </div>
            <ListingField icon={<Tag size={14} aria-hidden="true" />} label="Title">
              {listing.title}
            </ListingField>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ResultPhase;
