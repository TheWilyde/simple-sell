export const analyzeItem = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    
    try {
        const response = await fetch("http://localhost:8000/api/v1/analyze-item", {
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