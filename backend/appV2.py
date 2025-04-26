import pyalex
from pyalex import Works, Authors, Sources, Institutions, Topics, Publishers, Funders
from flask import Flask, jsonify, request
from flask_cors import CORS
from QueriedPaper import QueriedPaper
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)

def alexConfig(email):
    pyalex.config.email = email
    
    config.max_retries = 0
    config.retry_backoff_factor = 0.1
    config.retry_http_codes = [429, 500, 503]

alexConfig("guo.saturn@gmail.com")

app = Flask(__name__)
CORS(app)

def authorSetup(work):
    authorships = work["authorships"]
    authors = []

    for author_info in authorships:
            author_name = author_info["author"]["display_name"]
            authors.append(author_name)
        
    return authors

@app.route('/api/search', methods=['GET'])
def query():
    query = request.args.get('q', '')
    if not query:
        return jsonify({"error": "Query parameter 'q' is required"}), 400
    
    try:
        paper = QueriedPaper(query)
        references = paper.getReferenced()

        papers = []
        for reference in references:
            papers.append({
                "title": reference["title"],
                "authors": authorSetup(reference),
                "doi": reference["doi"],
            })

        return jsonify(papers)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)