import os
import dotenv
import cohere
from flask import Flask, request, jsonify
import hnswlib
import pandas as pd

app = Flask(__name__)

# Cohere initialization
dotenv.load_dotenv()
co = cohere.Client(os.getenv('COHERE_API_KEY'))

# Load the parquet file
df = pd.read_parquet('embeddings/scotus_opinions.parquet')
doc_embs = df['embedding'].tolist()

# Load the hnswlib index
index = hnswlib.Index(space='ip', dim=4096)
index.init_index(max_elements=len(doc_embs), ef_construction=512, M=64)
index.add_items(doc_embs, list(range(len(doc_embs))))


@app.route('/search', methods=['POST'])
def search():
    query = request.json.get('query')

    # Check if query is a string and not empty
    if query is None or not isinstance(query, str) or not query:
        return jsonify({'error': 'Invalid query'}), 400

    # Perform the vector search
    query_emb = co.embed(texts=[query], model="embed-english-v2.0").embeddings
    doc_ids = index.knn_query(query_emb, k=100)[0][0]

    # Get the top 100 results from the parquet file
    result_keys = ['author_name', 'category', 'per_curiam',
                   'case_name', 'date_filed', 'text', 'absolute_url']
    results = [
        {**df.loc[doc_id, result_keys].to_dict(), 'id': int(doc_id)}
        for doc_id in doc_ids
    ]

    return jsonify(results), 200


@app.route('/similar', methods=['POST'])
def similar():
    doc_id = request.json.get('id')

    # Check if query is a string and not empty
    if doc_id is None or not isinstance(doc_id, int):
        return jsonify({'error': 'Invalid ID'}), 400

    # Perform the vector search
    doc_emb = df.loc[doc_id, 'embedding']
    doc_ids = index.knn_query(doc_emb, k=100)[0][0]

    # Get the top 100 results from the parquet file
    result_keys = ['author_name', 'category', 'per_curiam',
                   'case_name', 'date_filed', 'text', 'absolute_url']
    results = [
        {**df.loc[d_id, result_keys].to_dict(), 'id': int(d_id)}
        for d_id in doc_ids if int(d_id) != doc_id
    ]

    return jsonify(results), 200


if __name__ == '__main__':
    app.run(debug=True)
