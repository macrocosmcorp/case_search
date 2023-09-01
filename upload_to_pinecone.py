import os
import pandas as pd
import pinecone
import dotenv

dotenv.load_dotenv()

pinecone.init(
    api_key=os.getenv('PINECONE_API_KEY'),
    environment='us-west1-gcp-free'
)

index = pinecone.Index('casearch')

# Load the parquet file
df = pd.read_parquet('embeddings/scotus_opinions.parquet')
print(len(df))

vectors = []

for i, row in df.iterrows():
    vectors.append({"id": str(i), "values": row['embedding'].tolist()})
    if i % 100 == 0 and i > 0:
        print(i)
        upsert_response = index.upsert(
            vectors=vectors,
        )
        print(upsert_response)
        vectors = []

upsert_response = index.upsert(
    vectors=vectors,
)
print(upsert_response)
