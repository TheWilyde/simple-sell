import instructor
import asyncio
from dotenv import load_dotenv
from pydantic import BaseModel, Field

load_dotenv()
# Define your output structure
class Item(BaseModel):
    title: str = Field(description="The name of the item or product")
    description: str = Field(description="The description of the item or product")
    category: str = Field(description="Category in which the item or product falls in")
    price: float = Field(description="The price of the item or product")



async def main():
    aclient = instructor.from_provider("google/gemini-2.5-flash", async_client=True)
    image = instructor.Image.from_path("test.webp")
    model = await aclient.chat.completions.create(
        model="gemini-2.5-flash",
        messages=[
            {
                "role": "user", 
                "content": [
                    "Analyze this image and generate a marketplace listing.",
                    image
                ]
            }
        ],
        autodetect_images=True,
        response_model=Item,
        max_retries=3,
        strict=True,
    )
    print(model)

if __name__ == "__main__":
    asyncio.run(main())
