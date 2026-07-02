from pathlib import Path


def load_markdown(file_path: str) -> str:

    md_file = Path(file_path)

    if not md_file.exists():
        raise FileNotFoundError(
            f"Markdown file not found: {file_path}"
        )

    return md_file.read_text(
        encoding="utf-8"
    )