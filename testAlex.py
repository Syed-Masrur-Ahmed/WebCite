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


# Get a single Work, Author, Source, Institution, Concept, Topic, Publisher or Funder from OpenAlex by the OpenAlex ID, or by DOI or ROR.
Works()["W2741809807"]
# same as
Works()["https://doi.org/10.7717/peerj.4375"]
print(Works()["W2741809807"]["title"])
#print(Works()["W2741809807"].keys())


## from the keys, the important ones are:
print(Works()["W2741809807"]["doi"])  # DOI of the work
print(Works()["W2741809807"]["id"])  # OpenAlex ID of the work
print(Works()["W2741809807"]["cited_by_count"])  # Number of citations
print(Works()["W2741809807"]["publication_date"])  # Publication date of the work
type_crossref = Works()["W2741809807"]["type_crossref"]  # Type of the work according to CrossRef
authorships = Works()["W2741809807"]["authorships"]  # List of authorship objects
cited_by_count = Works()["W2741809807"]["cited_by_count"]  # Number of citations
authorships = [authorship["author"]["display_name"] for authorship in authorships]  # List of author names
print(f"Type (CrossRef): {type_crossref}")
print(f"Authorships: {authorships}")
print(f"Cited by count: {cited_by_count}")

# print("Available keys:")
# for key in Works()["W2741809807"].keys():
#     print(f"- {key}")

#print(Authors()["W2741809807"].keys())
# The result is a Work object, which is very similar to a dictionary. Find the available fields with .keys().
# For example, get the open access status:

Works()["W2741809807"]["open_access"]
{'is_oa': True, 'oa_status': 'gold', 'oa_url': 'https://doi.org/10.7717/peerj.4375'}
# The previous works also for Authors, Sources, Institutions, Concepts and Topics

Authors()["A5027479191"]
Authors()["https://orcid.org/0000-0002-4297-0502"]  # same


# Get a random Work, Author, Source, Institution, Concept, Topic, Publisher or Funder.
Works().random()
random_author = Authors().random()
print(f"Random Author: {random_author['display_name']} (ID: {random_author['id']})")
print("random_author keys: \n", random_author.keys())
# random_author keys: 
# dict_keys(['id', 'orcid', 'display_name', 'display_name_alternatives', 'works_count',
# 'cited_by_count', 'summary_stats', 'ids', 'affiliations', 'last_known_institutions',
# 'topics', 'topic_share', 'x_concepts', 'counts_by_year', 'works_api_url',
# 'updated_date', 'created_date'])

Sources().random()
Institutions().random()
Topics().random()
Publishers().random()
Funders().random()

random_topics = Topics().random()
print("random_topics keys: \n", random_topics.keys())
print(f"Random Topic: {random_topics['display_name']} (ID: {random_topics['id']})")
# dict_keys(['id', 'display_name', 'description', 'keywords', 'ids', 'subfield', 'field',
# 'domain', 'siblings', 'works_count', 'cited_by_count', 'updated_date', 'created_date'])


random_source = Sources().random()
print("random_source keys: \n", random_source.keys())
print(f"Random Source: {random_source['display_name']} (ID: {random_source['id']})")