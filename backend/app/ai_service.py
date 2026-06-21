import base64
import os
from dotenv import load_dotenv
from groq import AsyncGroq
import instructor
from schemas import Item

load_dotenv()

raw_client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))
groq_client = instructor.from_groq(raw_client, mode=instructor.Mode.JSON)

def encode_image(image_file):
    #with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file).decode('utf-8')


async def generate_listing(groq_client, image, user_title_hint=None):
    image_base64 = encode_image(image)
    return await groq_client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
            {
                "role": "system",
                "content": "You are an expert e-commerce appraiser and copywriter. Your job is to extract highly specific details from images to create buyer-facing, visually accurate marketplace listings. You focus ONLY on the primary product for sale, ignoring all staging, backgrounds, and props."
            },
            {
                "role": "user", 
                "content": [
                    {
                        "type": "text", 
                        "text": f"""Analyze this image and generate a highly detailed, professional marketplace listing.

USER PROVIDED HINT: {user_title_hint if user_title_hint else "None provided."}

CRITICAL INSTRUCTIONS:

1. Isolate the Item (NO PROPS): 
   - Focus exclusively on the primary object intended for sale. 
   - Completely ignore background elements, staging props (like bowls or books on a table), decorations, or human models wearing the clothing.

2. Title & Branding (Prioritize Text): 
   - Look closely for visible logos, text, or serial numbers on the item to extract exact brand and model names for the title.
   - Use the 'USER PROVIDED HINT' to guide your brand and model identification.
   - Distinguish between the actual manufacturer's brand and third-party stickers (e.g., a Patagonia sticker on a water bottle does not make it a Patagonia bottle).

3. Buyer-Facing Description: 
   - Detail the materials, colors, and specific physical features of the primary item only.
   - DO NOT mention the background, camera angle, or the fact that this is an image.

4. Objective Condition Reporting:
   - Only describe VISIBLE wear and tear (e.g., scratches, scuffs). 
   - Do not use absolute terms like "pristine" or "flawless." Describe the condition naturally based on what you see, without appending canned robotic phrases.

5. Fair Market Pricing & Category:
   - Estimate a realistic, used-market price in USD based on the item's apparent condition and brand value. Provide just the float value.
   - Choose exactly one Category from the allowed list.
"""
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_base64}"
                        }
                    }
                ]
            }
        ],
        response_model=Item,
    )