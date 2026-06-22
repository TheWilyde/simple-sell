import { useState } from "react";
import Navbar from "./components/Navbar";
import IdlePhase from "./components/IdlePhase";
import AnalyzingPhase from "./components/AnalyzingPhase";
import ResultPhase from "./components/ResultPhase";
import type { Listing, Phase } from "./types/listing";
import analyzeItem from "./lib/analyzeItem";

function App() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const [groqApiKey, setGroqApiKey] = useState("");
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  async function handleImageSelected(file: File) {
    const trimmedApiKey = groqApiKey.trim();

    if (!trimmedApiKey) {
      setApiKeyError("Enter your Groq API key before uploading.");
      return;
    }

    setApiKeyError(null);
    setSelectedFile(file);
    setImageUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      return URL.createObjectURL(file);
    });
    setListing(null);
    try {
      setPhase("analyzing");
      const listing = await analyzeItem(file, trimmedApiKey);
      setListing(listing)
      setPhase("result");
    } catch(e) {
      console.error("Process failed", e);
      setApiKeyError(e instanceof Error ? e.message : "Analysis failed.");
      setSelectedFile(null);
      setImageUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl);
        }

        return null;
      });
      setPhase("idle");
    }
  }

  function resetFlow() {
    setPhase("idle");
    setSelectedFile(null);
    setListing(null);
    setImageUrl((currentUrl) => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }

      return null;
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-14">
        {phase === "idle" && (
          <IdlePhase
            groqApiKey={groqApiKey}
            apiKeyError={apiKeyError}
            onGroqApiKeyChange={(value) => {
              setGroqApiKey(value);
              if (apiKeyError) {
                setApiKeyError(null);
              }
            }}
            onImageSelected={handleImageSelected}
          />
        )}
        {phase === "analyzing" && <AnalyzingPhase fileName={selectedFile?.name} />}
        {phase === "result" && listing && imageUrl && (
          <ResultPhase
            imageUrl={imageUrl}
            listing={listing}
            fileName={selectedFile?.name}
            onReset={resetFlow}
          />
        )}
      </main>
    </div>
  );
}

export default App;
