import ImageDropzone from "./ImageDropzone";
import ApiKeyInput from "./ApiKeyInput";

type IdlePhaseProps = {
  groqApiKey: string;
  apiKeyError?: string | null;
  onGroqApiKeyChange: (value: string) => void;
  onImageSelected: (file: File) => void;
};

function IdlePhase({
  groqApiKey,
  apiKeyError,
  onGroqApiKeyChange,
  onImageSelected,
}: IdlePhaseProps) {

  return (
    <section className="flex w-full max-w-xl flex-col gap-8">
      <div>
        <h1 className="mb-4 text-4xl font-bold leading-[1.02] tracking-normal text-foreground sm:text-5xl">
          Drop an image.
          <br />
          <span className="text-primary">Get a listing.</span>
        </h1>
        <p className="max-w-lg text-sm leading-6 text-muted-foreground">
          Upload any product photo and receive a generated title, description,
          category, and price.
          
        </p>
      </div>

      <ApiKeyInput
        value={groqApiKey}
        error={apiKeyError}
        onChange={onGroqApiKeyChange}
      />

      <ImageDropzone onImageSelected={onImageSelected} />
    </section>
  );
}

export default IdlePhase;
