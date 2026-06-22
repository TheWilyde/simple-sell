const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const analyzeItem = async (file: File, groqApiKey: string) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("groq_api_key", groqApiKey)
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/analyze-item`, {
            method: "POST",
            body: formData,
        });

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.detail || "Failed to analyze image");
        }

        const data = await response.json();

        return data.listing;
    } catch(error){
        console.error("Error analyzing item:", error);
        throw error;
    }
}

export default analyzeItem
