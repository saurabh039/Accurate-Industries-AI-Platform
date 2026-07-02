from pathlib import Path
from pypdf import PdfReader


def extract_text_from_pdf(pdf_path: str) -> str:
    pdf_file = Path(pdf_path)

    if not pdf_file.exists():
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    reader = PdfReader(pdf_file)

    text = []

    for page_number, page in enumerate(reader.pages, start=1):
        try:
            page_text = page.extract_text()

            if page_text:
                text.append(page_text)

        except Exception as e:
            print(f"Error on page {page_number}: {e}")

    return "\n".join(text)