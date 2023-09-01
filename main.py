import os
import dotenv
import cohere
from flask import Flask, request, jsonify
import pinecone
from supabase import create_client, Client

dotenv.load_dotenv()

app = Flask(__name__)

# Cohere, Pinecone, and Supabase initialization
co = cohere.Client(os.getenv('COHERE_API_KEY'))
pinecone.init(
    api_key=os.getenv('PINECONE_API_KEY'),
    environment='us-west1-gcp-free'
)
index = pinecone.Index('casearch')
supabase: Client = create_client(os.environ.get(
    "SUPABASE_URL"), os.environ.get("SUPABASE_KEY"))


@app.route('/search', methods=['POST'])
def search():
    query = request.json.get('query')

    # Check if query is a string and not empty
    if query is None or not isinstance(query, str) or not query:
        return jsonify({'error': 'Invalid query'}), 400

    # Perform the vector search
    query_emb = co.embed(texts=[query], model="embed-english-v2.0").embeddings
    query_response = index.query(top_k=100, vector=query_emb)
    ids = [int(match["id"]) for match in query_response["matches"]]

    # Get the top 100 results from the Supabase
    response = supabase.table('case_data').select("*").in_('id', ids).execute()
    results = response.data

    return jsonify(results), 200


@app.route('/similar', methods=['POST'])
def similar():
    doc_id = request.json.get('id')

    # Check if query is a string and not empty
    if doc_id is None or not isinstance(doc_id, int):
        return jsonify({'error': 'Invalid ID'}), 400

    # Perform the vector search
    query_response = index.query(top_k=100, id=str(doc_id))
    ids = [int(match["id"]) for match in query_response["matches"]
           if int(match["id"]) != doc_id]

    # Get the top 100 results from the Supabase
    response = supabase.table('case_data').select("*").in_('id', ids).execute()
    results = response.data

    return jsonify(results), 200


if __name__ == '__main__':
    app.run(debug=True)
