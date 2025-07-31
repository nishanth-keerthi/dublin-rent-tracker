import pandas as pd
import joblib
import os

# Load both datasets
featured_df = pd.read_excel("01_data/cleaned/daft_listings_featured.xlsx")
eda_df = pd.read_excel("01_data/cleaned/daft_listings_post_eda.xlsx")


if len(featured_df) != len(eda_df):
    raise ValueError("Row count mismatch: cannot align daft_link by row index.")

# Add daft_link by row position
featured_df['daft_link'] = eda_df['daft_link'].values

# Drop rows with blank or missing subcode
featured_df = featured_df[featured_df['dublin_subcode'].notna()] 
featured_df = featured_df[featured_df['dublin_subcode'].astype(str).str.strip() != ""]

# Load trained model
model = joblib.load("05_models/random_forest_rent_model.joblib")

# Prepare features
excluded_cols = ["monthly_price", "daft_link"]
feature_cols = [col for col in featured_df.columns if col not in excluded_cols]
X = featured_df[feature_cols]

# Predict rent
featured_df['predicted_rent'] = model.predict(X)

# Clean/convert data
featured_df = featured_df.fillna("")  # JS doesn't handle NaNs

# Save to JSON inside /docs/data/
os.makedirs("docs/data", exist_ok=True)
featured_df.reset_index(drop=True).to_json("docs/data/listings.json", orient="records")

print("listings.json exported to docs/data/ with daft_link included.")
