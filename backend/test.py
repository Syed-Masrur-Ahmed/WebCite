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

paper = QueriedPaper("https://doi.org/10.1016/j.jclepro.2024.140823")
references = paper.getReferenced()
print(references)

papers = []
for reference in references:
    papers.append({
        "title": reference["title"],
        "authors": authorSetup(reference),
        "doi": reference["doi"],
    })

g = paper.makeGraph(100)

pos = nx.spring_layout(g)
labels = {node: node.title for node in g.nodes()}

# First draw nodes and edges (but no labels yet)
nx.draw_networkx_nodes(g, pos, node_size=500)
nx.draw_networkx_edges(g, pos)

# Then draw the labels, customizing
nx.draw_networkx_labels(
    g, pos,
    labels=labels,
    font_size=8,
    verticalalignment='top',
    horizontalalignment='center'
)

plt.tight_layout()
plt.show()


