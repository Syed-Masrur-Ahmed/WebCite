from pyalex import Works, Authors, Sources, Institutions, Topics, Publishers, Funders
from pyalex import config
import pyalex
from dataProcessing.QueriedPaper import QueriedPaper

def authorSetup(work):
    authorships = work["authorships"]
    authors = []

    for author_info in authorships:
            author_name = author_info["author"]["display_name"]
            authors.append(author_name)
        
    return authors

paper = QueriedPaper("https://doi.org/10.1103/PhysRevLett.89.011301")
references = paper.getReferenced()

papers = []
for reference in references:
    papers.append({
        "title": reference["title"],
        "authors": authorSetup(reference),
        "doi": reference["doi"],
    })

print(papers)
