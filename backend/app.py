from pyalex import PyAlex, Works
from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Configure PyAlex before creating the PyAlex instance
PyAlex.config.email = "guo.saturn@gmail.com"  # for faster queries
PyAlex.config.max_retries = 0
PyAlex.config.retry_backoff_factor = 0.1
PyAlex.config.retry_http_codes = [429, 500, 503]  # retry settings

palex = PyAlex()

@app.route('/')
def hello():
    return {"message": "is the backend deployment working chat"}

@app.route('/api/search', methods=['GET'])
def search_papers():
    query = request.args.get('q', '')
    if not query:
        return jsonify({"error": "Query parameter 'q' is required"}), 400

    try:
        results = Works(query=query, limit=10)

        papers = []
        for paper in results:
            papers.append({
                "id": paper.id,  # might be paper_id depending on PyAlex version
                "title": paper.title,
                "year": paper.year,
                "authors": [{"author_id": a.author_id, "name": a.name} for a in paper.authors],
                "citation_count": paper.citation_count,
                "reference_count": paper.reference_count
            })

        return jsonify(papers)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Heroku needs dynamic port
    app.run(host='0.0.0.0', port=port, debug=True)