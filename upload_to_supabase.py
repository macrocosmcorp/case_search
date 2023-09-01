import os
import pandas as pd
from supabase import create_client, Client
import dotenv

dotenv.load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# Load the parquet file
df = pd.read_parquet('embeddings/scotus_opinions.parquet')
print(len(df))

data = []

for i, row in df.iterrows():
    author_name = row['author_name']
    category = row['category']
    per_curiam = row['per_curiam']
    case_name = row['case_name']
    date_filed = row['date_filed']
    text = row['text']
    absolute_url = row['absolute_url']

    if len(text) > 500:
        text = text[:500]

    data.append({"id": i, "author_name": author_name, "category": category, "per_curiam": per_curiam,
                "case_name": case_name, "date_filed": date_filed, "text": text, "absolute_url": absolute_url})

    if i % 100 == 0 and i > 0:
        _, _ = supabase.table('case_data').insert(data).execute()
        data = []

_, _ = supabase.table('case_data').insert(data).execute()
