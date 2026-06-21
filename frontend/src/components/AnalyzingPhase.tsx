import { LoaderCircle } from "lucide-react";

type AnalyzingPhaseProps = {
  fileName?: string;
};

function AnalyzingPhase({ fileName }: AnalyzingPhaseProps) {
  return (
    <section className="flex w-full max-w-sm flex-col items-center gap-5 text-center">
      <div className="grid h-16 w-16 place-items-center border border-border bg-card">
        <LoaderCircle size={28} className="animate-spin text-primary" aria-hidden="true" />
      </div>
      <div>
        <h1 className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
          Analyzing image
        </h1>
        {fileName && (
          <p className="mt-2 max-w-xs truncate text-[11px] text-muted-foreground">
            {fileName}
          </p>
        )}
      </div>
    </section>
  );
}

export default AnalyzingPhase;
