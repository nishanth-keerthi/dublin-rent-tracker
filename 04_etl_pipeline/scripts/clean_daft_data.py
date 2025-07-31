import pandas as pd
import os
import re

INPUT_PATH = "../../01_data/raw/daft_api_listings.csv"
OUTPUT_PATH = "../../01_data/cleaned/daft_listings_cleaned.csv"

def extract_dublin_subcode(address):
    match = re.search(r"Dublin\s*(\d{1,2})", str(address), re.IGNORECASE)
    return int(match.group(1)) if match else None

def clean_daft_data():
    df = pd.read_csv(INPUT_PATH)

    # Rename 'title' to 'address' only if 'title' exists
    if "title" in df.columns:
        df.rename(columns={"title": "address"}, inplace=True)

    # Extract dublin_subcode from 'address'
    if "address" in df.columns:
        df["dublin_subcode"] = df["address"].apply(extract_dublin_subcode)

    # Drop only those columns that are present
    drop_columns = [
        "price", "size_meters_squared", "sale_type", "publish_date",
        "latitude", "longitude", "agent_id", "agent_branch", "agent_seller_type"
    ]
    drop_columns = [col for col in drop_columns if col in df.columns]
    df.drop(columns=drop_columns, inplace=True)

    # Save cleaned data
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    df.to_csv(OUTPUT_PATH, index=False)
    print(f"Cleaned file saved to {OUTPUT_PATH}")

if __name__ == "__main__":
    clean_daft_data()
