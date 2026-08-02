from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
from PIL import Image as PILImage


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf"
MEDIA = ROOT / "public" / "isandre" / "media"
INK = colors.HexColor("#121311")
MUTED = colors.HexColor("#696B66")
PAPER = colors.HexColor("#F3F1EB")
LINE = colors.HexColor("#D8D6CE")

FONT_DIR = Path("/System/Library/Fonts/Supplemental")
pdfmetrics.registerFont(TTFont("LaunchSans", FONT_DIR / "Arial Unicode.ttf"))
pdfmetrics.registerFont(TTFont("LaunchSerif", FONT_DIR / "Georgia.ttf"))


def asset(product: str, role: str, finish: str) -> Path:
    path = MEDIA / product / role / finish / "index.jpg"
    if not path.exists():
        raise FileNotFoundError(path)
    return path


IMAGES = {
    "seuil-hero": asset("seuil-01", "d01", "chalk"),
    "seuil-life": asset("seuil-01", "d02", "chalk"),
    "seuil-front": asset("seuil-01", "c01", "chalk"),
    "seuil-back": asset("seuil-01", "p02", "chalk"),
    "portee-hero": asset("portee-02", "d01", "sage"),
    "portee-life": asset("portee-02", "d02", "chalk"),
    "portee-front": asset("portee-02", "c01", "sage"),
    "portee-back": asset("portee-02", "p02", "chalk"),
    "veille-hero": asset("veille-03", "d01", "butter"),
    "veille-night": asset("veille-03", "d03", "rose-clay"),
    "veille-front": asset("veille-03", "c01", "butter"),
}


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        "LaunchKicker",
        fontName="LaunchSans",
        fontSize=7.5,
        leading=10,
        textColor=MUTED,
        spaceAfter=7 * mm,
        uppercase=True,
    )
)
styles.add(
    ParagraphStyle(
        "LaunchTitle",
        fontName="LaunchSerif",
        fontSize=29,
        leading=32,
        textColor=INK,
        spaceAfter=7 * mm,
    )
)
styles.add(
    ParagraphStyle(
        "LaunchHeading",
        fontName="LaunchSerif",
        fontSize=20,
        leading=24,
        textColor=INK,
        spaceBefore=5 * mm,
        spaceAfter=3 * mm,
    )
)
styles.add(
    ParagraphStyle(
        "LaunchBody",
        fontName="LaunchSans",
        fontSize=9.2,
        leading=14,
        textColor=MUTED,
        alignment=TA_LEFT,
        spaceAfter=3 * mm,
    )
)
styles.add(
    ParagraphStyle(
        "LaunchCaption",
        fontName="LaunchSans",
        fontSize=7,
        leading=9,
        textColor=MUTED,
        spaceBefore=2 * mm,
        spaceAfter=5 * mm,
    )
)


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.line(18 * mm, 13 * mm, 192 * mm, 13 * mm)
    canvas.setFont("LaunchSans", 6.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 8.5 * mm, "ISANDRE / ṬĀQA · INTERNAL PRE-RELEASE")
    canvas.drawRightString(192 * mm, 8.5 * mm, f"{doc.page:02d}")
    canvas.restoreState()


def fitted_image(path: Path, max_width: float, max_height: float):
    with PILImage.open(path) as source:
        width, height = source.size
    ratio = min(max_width / width, max_height / height)
    return Image(str(path), width=width * ratio, height=height * ratio)


def hero(path: Path, caption: str):
    image = fitted_image(path, 174 * mm, 151 * mm)
    return [
        image,
        Paragraph(caption, styles["LaunchCaption"]),
    ]


def page(kicker: str, title: str, body: str, image: str | None = None):
    blocks = [
        Paragraph(kicker.upper(), styles["LaunchKicker"]),
        Paragraph(title, styles["LaunchTitle"]),
    ]
    if image:
        blocks.extend(hero(IMAGES[image], f"{kicker} · digital campaign study"))
    for paragraph in body.split("\n\n"):
        blocks.append(Paragraph(paragraph, styles["LaunchBody"]))
    blocks.append(PageBreak())
    return blocks


def price_table():
    data = [
        ["Piece", "Chalk", "Butter", "Sage", "Rose Clay"],
        ["SEUIL 01", "€3,000", "€3,200", "€3,300", "€3,500"],
        ["PORTÉE 02", "€3,000", "€3,200", "€3,300", "€3,500"],
        ["VEILLE 03", "€750", "€800", "€850", "€900"],
    ]
    table = Table(data, colWidths=[42 * mm, 27 * mm, 27 * mm, 27 * mm, 30 * mm])
    table.setStyle(
        TableStyle(
            [
                ("FONT", (0, 0), (-1, -1), "LaunchSans", 8),
                ("TEXTCOLOR", (0, 0), (-1, -1), INK),
                ("BACKGROUND", (0, 0), (-1, 0), PAPER),
                ("GRID", (0, 0), (-1, -1), 0.35, LINE),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    return table


def build_pdf(filename: str, title: str, story):
    doc = SimpleDocTemplate(
        str(OUT / filename),
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=19 * mm,
        title=title,
        author="ISANDRE",
        subject="Internal pre-release launch master",
    )
    doc.build(story, onFirstPage=footer, onLaterPages=footer)


def build_press():
    story = []
    story += page(
        "Press kit",
        "Furniture that lets the room continue.",
        "ISANDRE presents ṬĀQA: three open forms for everyday life.\n\nThis working dossier separates campaign imagery from physical evidence. Workshop, material and owner photography remain TO BE SUPPLIED.",
        "seuil-hero",
    )
    story += page(
        "The idea",
        "The empty space comes first.",
        "The objects we keep deserve a place. The furniture that holds them should not end the view. ṬĀQA is drawn around the empty space so light, movement and conversation remain visible.",
        "seuil-life",
    )
    story += page(
        "SEUIL 01",
        "A threshold made visible.",
        "Tall open cabinet. 102 × 184 × 42 cm. Eight canonical openings. Chalk €3,000; Butter €3,200; Sage €3,300; Rose Clay €3,500.",
        "seuil-front",
    )
    story += page(
        "PORTÉE 02",
        "A horizon within the room.",
        "Low open cabinet. 184 × 102 × 42 cm. Eight canonical openings. Chalk €3,000; Butter €3,200; Sage €3,300; Rose Clay €3,500.",
        "portee-hero",
    )
    story += page(
        "VEILLE 03",
        "Last at night. First in the morning.",
        "A small open architecture for private rituals. Chalk €750; Butter €800; Sage €850; Rose Clay €900. Final dimensions remain TO BE SUPPLIED.",
        "veille-hero",
    )
    story += page(
        "House",
        "ISANDRE",
        "ISANDRE is an independent French design house. Its first collection, ṬĀQA, explores furniture as an open architecture for everyday life and is made to order in Italy.\n\nSupplier identity, workshop photography and material composition are published only after factual approval.",
        "seuil-back",
    )
    story += page(
        "Contact",
        "Press and interviews",
        "studio@isandre.com\n\nRelease date, cleared domain, factual people biographies, workshop photography and public installation: TO BE SUPPLIED.",
    )
    build_pdf("isandre-press-kit-working.pdf", "ISANDRE / ṬĀQA — Press kit", story)


def build_trade():
    story = []
    slides = [
        ("Trade dossier", "Open forms for architecture and interiors.", "Specification master. Commercial terms subject to approval.", "seuil-hero"),
        ("The spatial problem", "Most storage ends the view.", "ṬĀQA gives objects a place while light, movement and conversation continue.", "seuil-life"),
        ("One family", "Three domestic scales.", "SEUIL marks a passage. PORTÉE draws a horizon. VEILLE stays close to the bed.", None),
        ("SEUIL 01", "A threshold made visible.", "102 × 184 × 42 cm. Open-backed. Eight openings. From €3,000.", "seuil-front"),
        ("PORTÉE 02", "A horizon within the room.", "184 × 102 × 42 cm. Open-backed. Eight openings. From €3,000.", "portee-front"),
        ("VEILLE 03", "A quiet place for what stays close.", "From €750. Final dimensions and engineering release: TO BE SUPPLIED.", "veille-front"),
        ("Finishes", "Chalk. Butter. Sage. Rose Clay.", "Digital finish studies remain subject to approved physical samples.", None),
        ("Proof", "See through the object.", "Front, rear and profile views explain the open back, depth and visual continuity.", "portee-back"),
        ("Specification", "Verified files only.", "Material, load, anchoring, emissions, care, CAD/BIM and installation data: TO BE SUPPLIED.", None),
        ("Delivery", "Plan the path before the piece.", "Indicative production: 20 working days. Freight, duties and taxes are destination-specific.", "portee-life"),
        ("Service", "One contact from sample to installation.", "Technical files, samples, quantity review, access check and post-installation support.", None),
        ("Contact", "Begin a project.", "studio@isandre.com\n\nCleared domain, legal entity and final trade terms: TO BE SUPPLIED.", None),
    ]
    for kicker, title, body, image in slides:
        story += page(kicker, title, body, image)
    build_pdf("isandre-trade-deck-working.pdf", "ISANDRE / ṬĀQA — Trade deck", story)


def build_lookbook():
    story = []
    sequence = [
        ("ISANDRE / ṬĀQA", "THE ROOM CONTINUES.", "Lookbook / digital campaign study", "seuil-hero"),
        ("SEUIL 01", "A threshold made visible.", "A boundary that never becomes a wall.", "seuil-life"),
        ("Open back", "Light keeps moving.", "The view continues through eight canonical openings.", "seuil-back"),
        ("PORTÉE 02", "A horizon within the room.", "A low line that keeps both sides together.", "portee-hero"),
        ("Two sides", "One uninterrupted view.", "Dining and living remain connected.", "portee-life"),
        ("VEILLE 03", "Last at night. First in the morning.", "A quiet place for what stays close.", "veille-hero"),
        ("Blue hour", "The objects stay close.", "Book, water and first light.", "veille-night"),
        ("Service", "Made to order.", "Indicative production: 20 working days before transport. Delivery, duties and taxes are calculated for the destination.", None),
        ("ISANDRE / ṬĀQA", "Furniture that lets the room continue.", "studio@isandre.com", "seuil-hero"),
    ]
    for kicker, title, body, image in sequence:
        story += page(kicker, title, body, image)
    build_pdf("isandre-lookbook-working.pdf", "ISANDRE / ṬĀQA — Lookbook", story)


def build_catalogue():
    story = []
    story += page(
        "Catalogue",
        "Three open forms.",
        "ṬĀQA starts with the empty space. Objects are held; light, movement and sightlines continue.",
        "seuil-hero",
    )
    story += page(
        "SEUIL 01",
        "A threshold made visible.",
        "102 × 184 × 42 cm. Open-backed. Eight canonical openings.",
        "seuil-front",
    )
    story += page(
        "PORTÉE 02",
        "A horizon within the room.",
        "184 × 102 × 42 cm. Open-backed. Eight canonical openings.",
        "portee-front",
    )
    story += page(
        "VEILLE 03",
        "Last at night. First in the morning.",
        "Final production dimensions: TO BE SUPPLIED.",
        "veille-front",
    )
    story.extend(
        [
            Paragraph("PUBLIC PRICE LIST", styles["LaunchKicker"]),
            Paragraph("Four finishes.", styles["LaunchTitle"]),
            price_table(),
            Spacer(1, 8 * mm),
            Paragraph(
                "Prices exclude destination-specific delivery, duties and taxes. "
                "Digital finish studies remain subject to approved physical samples.",
                styles["LaunchBody"],
            ),
            PageBreak(),
        ]
    )
    story += page(
        "Production",
        "Evidence before claims.",
        "Made to order. Indicative production: 20 working days before transport.\n\nFinal material, weight, load, care, origin and workshop: TO BE SUPPLIED after industrial validation.",
        "portee-back",
    )
    story += page(
        "Contact",
        "Bring the room into view.",
        "studio@isandre.com\n\nCleared website and legal entity: TO BE SUPPLIED.",
        "seuil-hero",
    )
    build_pdf("isandre-catalogue-working.pdf", "ISANDRE / ṬĀQA — Catalogue", story)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    build_press()
    build_trade()
    build_lookbook()
    build_catalogue()
    print(f"Built 4 launch working PDFs in {OUT}")


if __name__ == "__main__":
    main()
