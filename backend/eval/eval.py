import asyncio
import json
import base64
import os
from dotenv import load_dotenv
from schemas import Item, DescriptionEvaluation, EvaluationResult


from groq import AsyncGroq
import instructor

load_dotenv()


def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

async def generate_listing(aclient, image_base64, user_title_hint):
    return await aclient.chat.completions.create(
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

async def evaluate_description(aclient, judge_prompt):
    return await aclient.chat.completions.create(
        model="llama-3.3-70b-versatile", # Groq's fast text model for the evaluation
        messages=[{"role": "user", "content": judge_prompt}],
        response_model=DescriptionEvaluation,
    )

async def main():
    with open('dataset.json', 'r') as file:
        data = json.load(file)

    raw_client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))
    aclient = instructor.from_groq(raw_client, mode=instructor.Mode.JSON)

    results = []

    for item in data:
        image_path = item["image_path"]
        expected_title = item["title"]
        expected_description = item["description"]
        expected_category = item["category"]
        expected_price = float(item["price"])
        

        base64_img = encode_image(image_path)
        
        listing = await generate_listing(aclient, base64_img, user_title_hint=None)
        # print(listing.model_dump_json(indent=2))
        category_match = listing.category == expected_category

        if expected_price > 0:
            price_difference_percentage = abs(listing.price - expected_price) / expected_price
            price_match = price_difference_percentage < 0.15
        else:
            price_match = (listing.price == 0)

        judge_prompt = f"""
        You are an expert QA evaluator for a marketplace application. 
        Compare the AI-generated product description to the Ground Truth description.
        Rate the AI description out of 5 based on how well it captures the vital details, accuracy, and avoids hallucinations.
        
        Ground Truth: "{expected_description}"
        AI Generated: "{listing.description}"
        """

        description_eval = await evaluate_description(aclient, judge_prompt)

        eval_result = EvaluationResult(
            image_path=image_path,
            original_title=expected_title,
            original_description=expected_description,
            ai_title=listing.title,
            ai_description=listing.description,
            category_match=category_match,
            price_match=price_match,
            description_eval=description_eval
        )

        results.append(eval_result.model_dump())
        print(eval_result.model_dump_json(indent=2))

        with open('evaluation_results.json', 'w') as f:
            json.dump(results, f, indent=2)
        await asyncio.sleep(10)

if __name__ == "__main__":
    asyncio.run(main())