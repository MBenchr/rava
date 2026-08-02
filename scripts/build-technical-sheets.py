import json
from pathlib import Path

from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Image,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "technical"
GEOMETRY = json.loads((ROOT / "lib" / "isandre" / "geometry.data.json").read_text())
FONT_DIR = Path("/System/Library/Fonts/Supplemental")

pdfmetrics.registerFont(TTFont("TechSans", FONT_DIR / "Arial Unicode.ttf"))
pdfmetrics.registerFont(TTFont("TechSerif", FONT_DIR / "Georgia.ttf"))

INK = colors.HexColor("#1B1917")
MUTED = colors.HexColor("#696B66")
PAPER = colors.HexColor("#F4EFE6")
LINE = colors.HexColor("#D2CBC0")

PRODUCTS = {
    "seuil-01": {
        "name": "SEUIL 01",
        "type": {"en": "Open tall cabinet", "fr": "Cabinet vertical ouvert"},
        "price": "EUR 3,000 - 3,500",
    },
    "portee-02": {
        "name": "PORTÉE 02",
        "type": {"en": "Open low cabinet", "fr": "Cabinet horizontal ouvert"},
        "price": "EUR 3,000 - 3,500",
    },
    "veille-03": {
        "name": "VEILLE 03",
        "type": {"en": "Open bedside table", "fr": "Table de chevet ouverte"},
        "price": "EUR 750 - 900",
    },
}

COPY = {
    "en": {
        "title": "Provisional technical sheet",
        "status": "Status",
        "approved": "Geometry approved from the canonical digital manifest",
        "blocked": "Final manufacturer drawing required before dimensions are published",
        "dimensions": "External dimensions",
        "pending": "Pending final manufacturer drawing",
        "construction": "Construction",
        "construction_value": "Open-backed. Designed in France. Made to order in Italy.",
        "finish": "Finishes",
        "finish_value": "Chalk, Butter, Sage, Rose Clay",
        "lead": "Indicative production",
        "lead_value": "20 working days, subject to final production release",
        "price": "Public price",
        "warning": "INTERNAL PRE-RELEASE - not a production drawing.",
    },
    "fr": {
        "title": "Fiche technique provisoire",
        "status": "Statut",
        "approved": "Géométrie approuvée depuis le manifeste numérique canonique",
        "blocked": "Plan fabricant final requis avant publication des dimensions",
        "dimensions": "Dimensions extérieures",
        "pending": "En attente du plan fabricant final",
        "construction": "Construction",
        "construction_value": "Traversante, sans fond. Préparée sur commande.",
        "finish": "Finitions",
        "finish_value": "Craie, Beurre, Sauge, Argile rose",
        "lead": "Fabrication indicative",
        "lead_value": "20 jours ouvrés, sous réserve de libération industrielle",
        "price": "Prix public",
        "warning": "INTERNE AVANT LIBÉRATION - ne constitue pas un plan de production.",
    },
}


def style(name, font, size, leading, color=INK, **kwargs):
    return ParagraphStyle(
        name,
        fontName=font,
        fontSize=size,
        leading=leading,
        textColor=color,
        **kwargs,
    )


STYLES = {
    "eyebrow": style("eyebrow", "TechSans", 7, 10, MUTED, spaceAfter=4 * mm),
    "title": style("title", "TechSerif", 28, 31, INK, spaceAfter=2 * mm),
    "subtitle": style("subtitle", "TechSans", 10, 14, MUTED, spaceAfter=7 * mm),
    "label": style("label", "TechSans", 7, 10, MUTED),
    "value": style("value", "TechSans", 9, 13, INK),
    "warning": style("warning", "TechSans", 7, 10, MUTED),
}


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.line(18 * mm, 13 * mm, 192 * mm, 13 * mm)
    canvas.setFont("TechSans", 6.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 8.5 * mm, "ISANDRE / TAQA")
    canvas.drawRightString(192 * mm, 8.5 * mm, f"{doc.page:02d}")
    canvas.restoreState()


def fitted_image(path, max_width, max_height):
    with PILImage.open(path) as source:
        width, height = source.size
    ratio = min(max_width / width, max_height / height)
    return Image(str(path), width=width * ratio, height=height * ratio)


def build(product_id, locale):
    kit = GEOMETRY["kits"][product_id]
    product = PRODUCTS[product_id]
    copy = COPY[locale]
    approved = kit["status"] == "approved"
    image = (
        ROOT
        / "public"
        / "projection-kits"
        / product_id
        / kit["version"]
        / "identity-board.png"
        if approved
        else ROOT
        / "public"
        / "isandre"
        / "media"
        / product_id
        / "c01"
        / "chalk"
        / "index.jpg"
    )
    dimensions = (
        f'{kit["dimensionsMm"]["width"]} x {kit["dimensionsMm"]["height"]} x '
        f'{kit["dimensionsMm"]["depth"]} mm'
        if approved
        else copy["pending"]
    )
    rows = [
        [copy["status"], copy["approved"] if approved else copy["blocked"]],
        [copy["dimensions"], dimensions],
        [copy["construction"], copy["construction_value"]],
        [copy["finish"], copy["finish_value"]],
        [copy["lead"], copy["lead_value"]],
        [copy["price"], product["price"]],
    ]
    table = Table(rows, colWidths=[43 * mm, 122 * mm])
    table.setStyle(
        TableStyle(
            [
                ("FONT", (0, 0), (-1, -1), "TechSans", 8),
                ("TEXTCOLOR", (0, 0), (0, -1), MUTED),
                ("TEXTCOLOR", (1, 0), (1, -1), INK),
                ("LINEABOVE", (0, 0), (-1, -1), 0.35, LINE),
                ("TOPPADDING", (0, 0), (-1, -1), 4 * mm),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4 * mm),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    output = OUT / f"{product_id}-technical-sheet-{locale}.pdf"
    doc = SimpleDocTemplate(
        str(output),
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=16 * mm,
        bottomMargin=19 * mm,
        title=f'{product["name"]} - {copy["title"]}',
        author="ISANDRE",
    )
    story = [
        Paragraph(copy["title"].upper(), STYLES["eyebrow"]),
        Paragraph(product["name"], STYLES["title"]),
        Paragraph(product["type"][locale], STYLES["subtitle"]),
        fitted_image(image, 174 * mm, 117 * mm),
        Spacer(1, 7 * mm),
        table,
        Spacer(1, 6 * mm),
        Paragraph(copy["warning"], STYLES["warning"]),
    ]
    doc.build(story, onFirstPage=footer, onLaterPages=footer)


OUT.mkdir(parents=True, exist_ok=True)
for language in ("en", "fr"):
    for product_key in PRODUCTS:
        build(product_key, language)

print(f"Built 6 provisional technical sheets in {OUT}")
