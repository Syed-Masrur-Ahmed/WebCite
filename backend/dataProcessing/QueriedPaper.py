from pyalex import Works, Authors, Sources, Institutions, Topics, Publishers, Funders
from pyalex import config
import pyalex
import networkx as nx
import math

class QueriedPaper:
    def __init__(self, doi):
        pyalex.config.email = "guo.saturn@gmail.com" 
        self.doi = doi
        self.work = None
        self.referenced = None
        self.authors = None
        self.title = None
        self.valid = False

        try:
            self.createWork(doi)
        except Exception as e:
            print(f"An error has occured in object initialization: {e}")
            self.valid = False

        if self.work:
            self.setup()
        
        if self.referenced and self.doi and self.work and self.authors and self.title:
            self.valid = True

    def createWork(self, titleOrDOI):
        try:
            self.work = Works()[titleOrDOI]
        except Exception as e:
            print(f"An error occured: {e}")
        finally:
            if not self.work:
                print("The article's Work object has not been initialized.")
    
    def getReferenced(self):
        try:
            if self.work:
                referenced = Works()[self.work["referenced_works"]]
                print("The article's referenced objects have been obtained.")
            if not self.work:
                pass
            return referenced
        except Exception as e:
            print(f"An error has occured in retrieving the reference: {e}")
            referenced = []
        finally:
            if not referenced:
                print("The article's Referenced dictionary has not been initialized.")
        
        return None
    
    def authorSetup(self):
        authorships = self.work["authorships"]
        authors = []

        for author_info in authorships:
            author_name = author_info["author"]["display_name"]
            authors.append(author_name)
        
        return authors
    
    def setup(self):
        self.referenced = self.getReferenced()
        self.title = self.work["title"]
        self.authors = self.authorSetup() 

    def getReferences(self):
        return self.referenced
    
    def __hash__(self):
        return hash(self.doi)
    
    def __eq__(self, other):
        return self.doi == other.doi

    def __str__(self):
        return self.doi

    def makeGraph(self, L):
        self.graph = nx.Graph()
        self.graph.add_node(self)
        nodeList = [self]
        print(len(nodeList))

        #mathematic definitions - see board
        l = L - 1
        n = 1
        N = 1

        while True:
            tmp = []

            for node in nodeList:
                print(node.doi)
                referenced = node.getReferenced()

                if referenced:
                    for i in range(min(len(referenced), l)):
                        N = N + 1
                        n = n + 1

                        ref = referenced[i]
                        tempNode = QueriedPaper(ref["doi"])
                    
                        if tempNode.title:
                            self.graph.add_node(node, label=self.title)
                            self.graph.add_edge(node, tempNode)

                        if tempNode.title and tempNode.valid:
                            tmp.append(tempNode)
                    
            if n == 0:
                break

            l = (L - N) / n
            print("limit is " + str(l))
            
            if l < 1:
                break
            else:
                n = 0
                l = math.floor(l)
                nodeList = tmp
            
            if N > 1000:
                print("fuck you")
                break
        
        return self.graph