
# Dublin Rental Price Tracker and Neighbourhood Comparison

## Project Overview

This project tracks and analyzes rental listings in Dublin using data collected from Daft.ie. It uses the `daftlistings` Python package to fetch structured data, Apache Airflow for ETL automation, and Python for cleaning, transformation, and analysis. The goal is to understand rental price dynamics, highlight neighborhood-level trends, and provide rent prediction tools for students and professionals seeking housing in Dublin.

## Goals

- Collect structured rental listing data using `daftlistings`
- Use Apache Airflow to automate ETL workflows
- Analyze rental price trends and neighborhood-wise variations
- Build and evaluate predictive models for rent estimation
- Develop a responsive frontend for user interaction and listing ranking

## Steps Involved

1. **Data Collection:** Use `daftlistings` to fetch data from Daft.ie and store in CSV format  
2. **ETL Pipeline:** Clean, transform, and generate featured datasets using Apache Airflow DAGs  
3. **Exploratory Analysis:** Explore trends using Jupyter Notebooks  
4. **Modeling:** Use LightGBM to predict rent and analyze feature importance  
5. **Frontend Development:** Build an interactive frontend using HTML/CSS/JS with GitHub Pages  
6. **(Optional in future)** Dashboarding with Power BI for stakeholder-friendly reporting

## Folder Structure

```
dublin_rent_tracker/
├── 01_data/
│   ├── raw/
│   ├── cleaned/
│   └── reports/
├── 02_notebooks/
│   └── eda_rent_analysis.ipynb
├── 03_powerbi/  # Reserved for future use
├── 04_etl_pipeline/
│   ├── dags/
│   └── scripts/
├── assets/
├── requirements.txt
└── readme.md
```

## How to Run the Project (Real-Time)

1. **Set up virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

2. **Configure Apache Airflow:**
   - Initialize Airflow DB:
     ```bash
     airflow db init
     ```
   - Start scheduler and webserver:
     ```bash
     airflow scheduler
     airflow webserver --port 8080
     ```
   - Access Airflow UI at [http://localhost:8080](http://localhost:8080)

3. **Trigger the DAG:**
   - Use the Airflow UI or CLI to run the ETL pipeline which:
     - Uses `daftlistings` to scrape data
     - Cleans, transforms, and saves featured datasets to `01_data/cleaned/`

4. **Explore the data:**
   - Open and run `eda_rent_analysis.ipynb` for data exploration

5. **Build the frontend:**
   - Launch `index.html`, `subcode_compare.html`, `price_estimate.html`, and `ranked_listings.html` from `/docs/`
   - Ensure `listings.json` is placed inside `/docs/data/`

6. **(Optional)** Extend with modeling or dashboarding using your tools of choice

## Future Enhancements

- Publish an interactive Power BI dashboard for non-technical users
- Embed district-wise choropleth rent maps
- Deploy automated retraining using real-time Daft.ie updates
- Add a rent fairness score to listings (“Above/Below Market”)
- Expand coverage to other Irish cities like Cork, Galway, Limerick

## Dependencies

- [`daftlistings`](https://github.com/anthony-reilly/daftlistings) – Python wrapper for accessing Daft.ie rental listings
- Apache Airflow
- Pandas, NumPy, LightGBM, Matplotlib, Seaborn
- HTML, CSS, JavaScript (for frontend)

## License

This project is licensed under the MIT License. You are free to use, modify, and distribute it with attribution.

## References

- [Daft.ie](https://www.daft.ie/) – Source for rental listings  
- [daftlistings GitHub](https://github.com/anthony-reilly/daftlistings)  
- [Apache Airflow Documentation](https://airflow.apache.org/)  

## Contact

**Nishanth Chennagiri Keerthi**  
Email: nishanthkeerthi@gmail.com  
LinkedIn: [linkedin.com/in/nishanth-keerthi](https://www.linkedin.com/in/nishanth-keerthi/)  
GitHub: [github.com/nishanth-keerthi](https://github.com/nishanth-keerthi)  
Data Portfolio: [Nishanth's Data Portfolio](https://ordinary-molybdenum-d39.notion.site/Nishanth-s-Data-Portfolio-227c3247852b80c092d1f28d2f08e48d)
