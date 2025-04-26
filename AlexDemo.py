from QueriedPaper import QueriedPaper

#tests
queriedTest = QueriedPaper("https://doi.org/10.2979/jfemistudreli.34.1.06")

print(queriedTest.title)
print(queriedTest.authors)
referenced = queriedTest.referenced

for work in referenced:
    print(work["title"])


