from pydantic import BaseModel, Field
from typing import Literal

Category = Literal[
    "Electronics", 
    "Books", 
    "Clothing", 
    "Home", 
    "Tools", 
    "Furniture", 
    "other / miscellaneous"
]

class Item(BaseModel):
    visual_analysis: str = Field(description="Step-by-step visual analysis of the image. Identify exact materials, colors, visible damage (distinguish scratches vs cracks), and verify all parts/accessories shown.")
    title: str = Field(description="A precise, descriptive title including brand, model, and key condition attributes.")
    description: str = Field(description="A highly comprehensive visual breakdown. Must explicitly detail materials, colors, brand text, accessories, and a precise description of physical condition (e.g., differentiate between scratches, scuffs, and cracks).")
    category: Category = Field(description="Category in which the item or product falls in")
    price: float = Field(description="The estimated used market value of the item in USD.")

class DescriptionEvaluation(BaseModel):
    reasoning: str = Field(description="Step-by-step logic for the score.")
    score: int = Field(description="An integer score from 1 to 5 based on accuracy.", ge=1, le=5)

class EvaluationResult(BaseModel):
    image_path: str
    original_title: str
    original_description: str
    ai_title: str
    ai_description: str
    category_match: bool
    price_match: bool
    description_eval: DescriptionEvaluation