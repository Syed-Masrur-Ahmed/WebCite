from pyalex import Works, Authors, Sources, Institutions, Topics, Publishers, Funders
from pyalex import config
import pyalex

class QueriedPaper:
    def __init__(self, doi):
        pyalex.config.email = "guo.saturn@gmail.com" 
        self.doi = doi
        self.work = None
        self.referenced = None
        self.authors = None
        self.title = None
        self.valid = True

        try:
            self.createWork(doi)
        except Exception as e:
            print(f"An error has occured in object initialization: {e}")

        if self.work:
            self.setup()

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
        except Exception as e:
            print(f"An error has occured: {e}")
        finally:
            if not referenced:
                print("The article's Referenced dictionary has not been initialized.")
        
        return referenced
    
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