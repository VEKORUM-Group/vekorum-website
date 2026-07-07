from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parents[1]


class PageAudit(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.path = path
        self.ids = []
        self.links = []
        self.images_without_alt = 0
        self.titles = 0
        self.descriptions = 0
        self.in_head = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "head":
            self.in_head = True
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])
        if tag == "img" and "alt" not in attrs:
            self.images_without_alt += 1
        if tag == "title" and self.in_head:
            self.titles += 1
        if tag == "meta" and attrs.get("name") == "description":
            self.descriptions += 1

    def handle_endtag(self, tag):
        if tag == "head":
            self.in_head = False


errors = []
pages = sorted(page for page in ROOT.rglob("*.html") if "tmp" not in page.parts)
for page in pages:
    audit = PageAudit(page)
    audit.feed(page.read_text(encoding="utf-8"))
    duplicates = {item for item in audit.ids if audit.ids.count(item) > 1}
    if duplicates:
        errors.append(f"{page.relative_to(ROOT)}: duplicate IDs {sorted(duplicates)}")
    if audit.images_without_alt:
        errors.append(f"{page.relative_to(ROOT)}: {audit.images_without_alt} image(s) missing alt")
    if audit.titles != 1:
        errors.append(f"{page.relative_to(ROOT)}: expected one title")
    for href in audit.links:
        parsed = urlsplit(href)
        if parsed.scheme or href.startswith(('#', 'mailto:', 'tel:')):
            continue
        target = (page.parent / parsed.path).resolve()
        if parsed.path.startswith('/'):
            target = ROOT / parsed.path.lstrip('/')
        if not target.exists():
            errors.append(f"{page.relative_to(ROOT)}: broken link {href}")

if errors:
    print("\n".join(errors))
    raise SystemExit(1)
print(f"PASS: audited {len(pages)} HTML pages")
