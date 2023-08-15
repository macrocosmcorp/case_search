import pandas as pd

# Load data from pickle file
df = pd.read_pickle('embeddings/ill_opinions.pkl')

print(len(df))

# Save data to a parquet file
df.to_parquet('embeddings/ill_opinions.parquet')
