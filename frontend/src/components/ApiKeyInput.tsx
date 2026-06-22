import { Eye, EyeOff, KeyRound } from "lucide-react";
import { useState } from "react";

type ApiKeyInputProps = {
  value: string;
  error?: string | null;
  onChange: (value: string) => void;
};

function ApiKeyInput({ value, error, onChange }: ApiKeyInputProps) {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="groq-api-key"
        className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground"
      >
        Groq API key
      </label>
      <div className="flex items-center border border-border bg-card focus-within:border-primary">
        <span className="px-4 text-muted-foreground" aria-hidden="true">
          <KeyRound size={18} strokeWidth={1.7} />
        </span>
        <input
          id="groq-api-key"
          type={showKey ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="gsk_..."
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent px-0 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="button"
          onClick={() => setShowKey((current) => !current)}
          className="px-4 py-3 text-muted-foreground transition-colors hover:text-foreground"
          aria-label={showKey ? "Hide API key" : "Show API key"}
        >
          {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <p className="text-[11px] font-medium text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default ApiKeyInput;
