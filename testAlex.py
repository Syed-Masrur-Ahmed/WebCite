import pyalex
print(f"PyAlex version: {pyalex.__version__}")

from pyalex import Works, Authors, Sources, Institutions, Topics, Publishers, Funders

# The polite pool has much faster and more consistent response times. To get into the polite pool, you set your email:
# Configure PyAlex with your email (for polite pool usage)
pyalex.config.email = "alexander.c.koch.th@dartmouth.edu"

# By default, PyAlex will raise an error at the first failure when querying the OpenAlex API.
# You can set max_retries to a number higher than 0 to allow PyAlex to retry when an error occurs.
# retry_backoff_factor is related to the delay between two retry,
# and retry_http_codes are the HTTP error codes that should trigger a retry.
from pyalex import config
config.max_retries = 1
config.retry_backoff_factor = 0.1
config.retry_http_codes = [429, 500, 503]





def main():
    print("PyAlex Example - OpenAlex API")
    
    # Example 1: Search for a specific paper by DOI
    print("\nExample 1: Get paper by DOI")
    work = Works()["https://doi.org/10.1038/s41586-020-2649-2"]
    print(f"Title: {work['title']}")
    print(f"Publication date: {work.get('publication_date')}")
    print(f"Citation count: {work.get('cited_by_count')}")
    
    # Example 2: Search for works with a specific keyword
    # Using the correct syntax for sort method in v0.18
    print("\nExample 2: Search for works with keyword 'artificial intelligence'")
    works = Works().search("artificial intelligence").sort(cited_by_count="desc").limit(5)
    for i, work in enumerate(works, 1):
        print(f"{i}. {work['title']} - Citations: {work.get('cited_by_count')}")
    
    # Example 3: Find works citing a specific paper
    print("\nExample 3: Find papers citing a specific work")
    citing_works = Works().filter(cites=work['id']).sort(cited_by_count="desc").limit(3)
    for i, citing in enumerate(citing_works, 1):
        print(f"{i}. {citing['title']} - Citations: {citing.get('cited_by_count')}")
    
    # Example 4: Find works by a top author in a field
    print("\nExample 4: Find works by a top author in machine learning")
    # First find authors in machine learning
    ml_authors = Authors().search("machine learning").sort(works_count="desc").limit(1)
    top_author = next(ml_authors)
    print(f"Top author: {top_author.get('display_name')} - Works: {top_author.get('works_count')}")
    
    # Get their recent works
    recent_works = Works().filter(author_id=top_author['id']).sort(publication_date="desc").limit(3)
    print("Recent works:")
    for i, work in enumerate(recent_works, 1):
        print(f"{i}. {work['title']} ({work.get('publication_date', 'No date')})")

if __name__ == "__main__":
    main()