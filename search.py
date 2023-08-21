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
    offset = request.args.get('offset', default=0, type=int)

    # Check if query is a string and not empty
    if not isinstance(query, str) or not query:
        return jsonify({'error': 'Invalid query'}), 400

    # Perform the vector search
    query_emb = co.embed(texts=[query], model="embed-english-v2.0").embeddings
    doc_ids_all = index.knn_query(query_emb, k=offset + 10)[0][0]
    doc_ids = doc_ids_all[offset:offset + 10]

    # Get the top 10 results from the parquet file
    results = [df.loc[doc_id, ['author_name', 'category', 'per_curiam',
                               'case_name', 'date_filed', 'text', 'absolute_url']].to_json() for doc_id in doc_ids]

    # Get the API route for the next 10 results
    next_results_route = f"/search?query={query}&offset={offset + 10}"

    return jsonify({'results': results, 'next': next_results_route})


if __name__ == '__main__':
    app.run(debug=True)
