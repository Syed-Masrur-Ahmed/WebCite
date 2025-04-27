from pyalex import Works, Authors, Sources, Institutions, Topics, Publishers, Funders
from pyalex import config
import pyalex
from dataProcessing.QueriedPaper import QueriedPaper
import networkx as nx
import matplotlib.pyplot as plt

def authorSetup(work):
    authorships = work["authorships"]
    authors = []

    for author_info in authorships:
            author_name = author_info["author"]["display_name"]
            authors.append(author_name)
        
    return authors

paper = QueriedPaper("https://doi.org/10.1145/3381751")
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

print(nodes)
print("\n", edges)



