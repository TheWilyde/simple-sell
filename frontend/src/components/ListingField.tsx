import type { ReactNode } from "react";

type ListingFieldProps = {
  icon: ReactNode;
  label: string;
  children: ReactNode;
};

function ListingField({ icon, label, children }: ListingFieldProps) {
  return (
    <div className="border-b border-border pb-5 last:border-b-0 last:pb-0">
      <div className="mb-2 flex items-center gap-2 text-primary">
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="pl-6 text-sm leading-6 text-foreground">{children}</div>
    </div>
  );
}

export default ListingField;
