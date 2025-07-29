# Dublin Rental Price Tracker and Neighbourhood Comparison

## Project Overview

This project aims to track and analyse rental listings in Dublin using data collected from Daft.ie. It involves scraping live data, cleaning and transforming it using ETL pipelines, performing exploratory data analysis, and presenting key insights in a Power BI dashboard. The project is designed to help students and professionals understand rental price dynamics and make informed housing decisions.

## Goals

- Collect rental listing data from Daft.ie (up to the current date)
- Use Apache Airflow to automate ETL processes
- Analyse rental price trends and neighbourhood-wise differences
- Visualise insights using interactive Power BI dashboards
- Optionally build predictive models for rent estimation

## Steps Involved

1. **Data Collection:** Scrape data using Playwright and save to CSV
2. **ETL Pipeline:** Clean and transform the data using Airflow DAGs
3. **Data Analysis:** Explore data in Python (Jupyter notebooks)
4. **Modelling (Optional):** Predict rent prices using regression or clustering
5. **Visualisation:** Build Power BI dashboards to showcase results
6. **Reporting:** Save summary reports of statistics and transformations

## Folder Structure

```
dublin_rent_tracker/
├── 01_data/
│ ├── raw/ # Raw scraped CSV files
│ ├── cleaned/ # Cleaned datasets ready for analysis
│ └── reports/ # Summary stats, reports
├── 02_notebooks/
│ └── eda_rent_analysis.ipynb # Exploratory data analysis
├── 03_powerbi/
│ └── dashboard.pbix # Power BI dashboard file
├── 04_etl_pipeline/
│ ├── dags/ # Airflow DAG definitions
│ └── scripts/ # Cleaning, transformation, and helper scripts
├── assets/ # Project visuals, screenshots, logos
├── requirements.txt # Project dependencies
└── readme.md # Project documentation
```

## License

This project is licensed under the MIT License. You are free to use, modify, and distribute it with attribution.

## References

- [Daft.ie](https://www.daft.ie/) - Source for rental listings
- [Apache Airflow Documentation](https://airflow.apache.org/)
- [Power BI Documentation](https://learn.microsoft.com/en-us/power-bi/)
- [Playwright for Python](https://playwright.dev/python/)

## Contact

For any questions, suggestions, or collaboration ideas:

**Nishanth Chennagiri Keerthi**  
Email: nishanthkeerthi@gmail.com  
LinkedIn: [linkedin.com/in/nishanth-keerthi](https://www.linkedin.com/in/nishanth-keerthi/)  
GitHub: [github.com/nishanth-keerthi](https://github.com/nishanth-keerthi)
Data Portfolio: [[Nishanth's Data Portfolio](https://ordinary-molybdenum-d39.notion.site/Nishanth-s-Data-Portfolio-227c3247852b80c092d1f28d2f08e48d)]