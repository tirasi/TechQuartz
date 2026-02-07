import requests
from bs4 import BeautifulSoup
import json
import os
import time
import ssl
import urllib3

# ================== SAFETY ==================
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
ssl._create_default_https_context = ssl._create_unverified_context
# ============================================

# -------- PATH CONFIG (IMPORTANT) --------
PROJECT_ROOT = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../../")
)

LINKS_FILE = os.path.join(PROJECT_ROOT, "links.txt")
DATA_DIR = os.path.join(PROJECT_ROOT, "data")
OUTPUT_FILE = os.path.join(DATA_DIR, "scraped_data.json")
# ------------------------------------------

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}

TIMEOUT = 10
DELAY = 2


def clean_text(text: str) -> str:
    return " ".join(text.split())


def scrape_url(url: str) -> str:
    try:
        response = requests.get(
            url,
            headers=HEADERS,
            timeout=TIMEOUT,
            verify=False
        )
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        for tag in soup(["script", "style", "noscript", "header", "footer"]):
            tag.decompose()

        return clean_text(soup.get_text(separator=" "))

    except Exception as e:
        print(f"❌ Failed: {url} → {e}")
        return ""


def main():
    print("📁 Project root:", PROJECT_ROOT)
    print("📄 links.txt:", LINKS_FILE)
    print("📦 data folder:", DATA_DIR)

    if not os.path.exists(LINKS_FILE):
        print("❌ links.txt not found in project root")
        return

    # Ensure data folder exists
    os.makedirs(DATA_DIR, exist_ok=True)

    results = []

    with open(LINKS_FILE, "r", encoding="utf-8") as f:
        lines = [line.strip() for line in f if line.strip()]

    for line in lines:
        if "|" not in line:
            print(f"⚠️ Skipping invalid line: {line}")
            continue

        category, url = line.split("|", 1)
        category = category.strip().upper()
        url = url.strip()

        print(f"\n🔎 Scraping: {url}")
        content = scrape_url(url)

        if content:
            results.append({
                "category": category,
                "url": url,
                "content": content
            })
            print(f"✅ Saved {len(content)} characters")
        else:
            print("⚠️ Empty content")

        time.sleep(DELAY)

    # SAVE STRICTLY INSIDE data/
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\n🎉 DONE")
    print(f"📁 File saved ONLY at → {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
