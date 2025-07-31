from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
import os
import sys


SCRIPT_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../scripts"))
sys.path.append(SCRIPT_PATH)


from scrape_daft_detailed import search_listings
from clean_daft_data import clean_daft_data

default_args = {
    "owner": "nishanth",
    "depends_on_past": False,
    "start_date": datetime(2024, 1, 1),
    "retries": 1,
    "retry_delay": timedelta(minutes=5),
}

with DAG(
    dag_id="daft_rent_etl_pipeline",
    default_args=default_args,
    schedule_interval="@daily",  # or use None to trigger manually
    catchup=False,
    tags=["daft", "etl", "rental"],
) as dag:

    fetch_data = PythonOperator(
        task_id="fetch_daft_data",
        python_callable=lambda: search_listings(max_pages=40)
    )

    clean_data = PythonOperator(
        task_id="clean_daft_data",
        python_callable=clean_daft_data
    )

    fetch_data >> clean_data
