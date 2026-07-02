from pathlib import Path

from app.ai.chatbot.knowledge_base.pdf_loader import extract_text_from_pdf
from app.ai.chatbot.services.text_splitter import split_text


BASE_DIR = Path(__file__).resolve().parents[4]

PDF_PATH = BASE_DIR / "frontend" / "assets" / "docs" / "company-profile.pdf"


print("Reading PDF...")
print(PDF_PATH)

text = extract_text_from_pdf(str(PDF_PATH))

print("\n===== FIRST 1000 CHARACTERS =====\n")
print(text[:1000])

chunks = split_text(text)

print("\n===== CHUNK INFORMATION =====")
print(f"Total chunks: {len(chunks)}")
print(f"First chunk length: {len(chunks[0])}")