from langchain_openai import OpenAI
from pathlib import Path
from dotenv import load_dotenv
import os

env_path = Path(__file__).resolve().parent.parent / ".env"

print("Looking for:", env_path)
print("Exists:", env_path.exists())

load_dotenv(env_path)

print("API key found:", os.getenv("OPENAI_API_KEY") is not None)

llm = OpenAI(model="gpt-3.5-turbo-instruct")

result = llm.invoke("What is the capital of France?")

print(result)