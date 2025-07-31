from daftlistings import Daft, Location, SearchType
import pandas as pd
import os
import re
from tqdm import tqdm

OUTPUT_PATH = "../../01_data/raw/daft_api_listings.csv"

def extract_number(text):
    if not text:
        return None
    m = re.search(r"\d+", str(text))
    return int(m.group()) if m else None

def search_listings(max_pages=40):
    daft = Daft()
    daft.set_location(Location.DUBLIN)
    daft.set_search_type(SearchType.RESIDENTIAL_RENT)

    listings = daft.search(max_pages=max_pages)
    print(f"Search complete. Found {len(listings)} listings.")
    data = []

    for listing in tqdm(listings, desc="Processing"):
        r = listing._result
        seller = r.get("seller", {})
        ber = r.get("ber", {})
        media = r.get("media", {})
        point = r.get("point", {})

        data.append({
            "id": r.get("id"),
            "address": r.get("title"),
            "bedrooms": extract_number(r.get("numBedrooms")),
            "bathrooms": extract_number(r.get("numBathrooms")),
            "monthly_price": listing.monthly_price,
            "ber": ber.get("rating"),
            "category": r.get("category"),
            "daft_link": listing.daft_link,
            "agent_name": seller.get("name"),
            "has_video": media.get("hasVideo"),
            "has_virtual_tour": media.get("hasVirtualTour"),
            "total_images": media.get("totalImages"),
        })

    df = pd.DataFrame(data)
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    df.to_csv(OUTPUT_PATH, index=False)
    print(f"Saved {len(df)} listings to {OUTPUT_PATH}")
    return df

if __name__ == "__main__":
    search_listings(max_pages=40)
