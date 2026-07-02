import faiss
import pickle
import numpy as np
from pathlib import Path

from app.ai.chatbot.knowledge_base.markdown_loader import load_markdown
from app.ai.chatbot.services.text_splitter import split_text
from app.ai.chatbot.services.embedding_service import create_embeddings


BASE_DIR = Path(__file__).resolve().parents[5]

KNOWLEDGE_FILE = (
    BASE_DIR
    / "backend"
    / "app"
    / "ai"
    / "chatbot"
    / "knowledge_base"
    / "company_knowledge.md"
)


text = load_markdown(str(KNOWLEDGE_FILE))

chunks = split_text(text)

embeddings = create_embeddings(chunks)

embeddings = np.array(
    embeddings,
    dtype="float32"
)

dimension = embeddings.shape[1]

index = faiss.IndexFlatL2(dimension)

index.add(embeddings)

faiss.write_index(
    index,
    "app/ai/chatbot/vector_store/company.index"
)

with open(
    "app/ai/chatbot/vector_store/chunks.pkl",
    "wb"
) as f:

    pickle.dump(chunks, f)

print("\nSUCCESS")
print(f"Chunks: {len(chunks)}")
print(f"Embedding Dimension: {dimension}")