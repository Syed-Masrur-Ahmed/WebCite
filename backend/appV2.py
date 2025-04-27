from pyalex import Works, Authors, Sources, Institutions, Topics, Publishers, Funders
from pyalex import config
import pyalex
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dataProcessing.QueriedPaper import QueriedPaper

app = Flask(__name__)
CORS(app)

def alexConfig(email):
    pyalex.config.email = email
    
    config.max_retries = 0
    config.retry_backoff_factor = 0.1
    config.retry_http_codes = [429, 500, 503]

alexConfig("guo.saturn@gmail.com")

def authorSetup(work):
    authorships = work["authorships"]
    authors = []

    for author_info in authorships:
            author_name = author_info["author"]["display_name"]
            authors.append(author_name)
        
    return authors

@app.route('/')
def hello():
    return {"message": "is the backend deployment working chat"}

@app.route('/api/search', methods=['GET'])
def query():
    query = request.args.get('q', '')
    if not query:
        return jsonify({"error": "Query parameter 'q' is required"}), 400
    
    try:
        paper = QueriedPaper(query)
        references = paper.getReferenced()
        g = paper.makeGraph(50)

        nodes = []
        for node, data in g.nodes(data=True):
            nodes.append({
                "id": str(node),
                "label": node.title,
                "title": node.title,
                "authors": authorSetup(node.work),
                "doi": node.doi
            })

        edges = []
        for source, target in g.edges():
            edges.append({
                "source": str(source),
                "target": str(target)
            })

        return jsonify({
            "nodes": nodes,
            "edges": edges,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # Heroku needs dynamic port
    app.run(host='0.0.0.0', port=port, debug=True)