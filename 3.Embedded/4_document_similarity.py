from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
load_dotenv()
embeddings=OpenAIEmbeddings(model='text-embedding-3-large',dimensions=3000)
document=[
"Virat Kohli — Famous for aggressive batting, consistency, and chasing big targets.",
"Rohit Sharma — Famous for elegant batting, huge sixes, and explosive opening.",
"Jasprit Bumrah — Famous for deadly yorkers, unusual action, and accuracy.",
"Ravindra Jadeja — Famous for all-round ability, sharp fielding, and powerful hitting.",
"AB de Villiers — Famous for 360-degree batting and incredible shot-making."
]
query='tell me about Ravindra Jadeja';

doc_embeddings=embeddings.embed_documents(document)
query_embedding=embeddings.embed_query(query)

scores=cosine_similarity([query_embedding],doc_embeddings)[0]

index,scores =sorted(list(enumerate(scores)), key=lambda x: x[1])[-1]

print(query)
print("Most similar document:",document[index])

