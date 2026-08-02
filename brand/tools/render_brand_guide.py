from pathlib import Path
from shutil import copy2

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "output" / "pdf" / "isandre-brand-guidelines-a4-1.pdf"
CANONICAL_OUTPUT = ROOT / "brand" / "guidelines" / "isandre-brand-guidelines-a4-1.pdf"

INK = HexColor("#1B1917")
LIMEWASH = HexColor("#F4EFE6")
PAPER = HexColor("#FCFBF7")
STONE = HexColor("#C9C0B2")
UMBER = HexColor("#6D5B4B")
COBALT = HexColor("#274C77")

W, H = A4
M = 48


def register_fonts():
    sans = Path("/System/Library/Fonts/Supplemental/Arial Unicode.ttf")
    serif = Path("/System/Library/Fonts/Supplemental/Georgia.ttf")
    if sans.exists():
        pdfmetrics.registerFont(TTFont("BrandSans", str(sans)))
    if serif.exists():
        pdfmetrics.registerFont(TTFont("BrandSerif", str(serif)))


def font(name):
    if name == "serif":
        return "BrandSerif" if "BrandSerif" in pdfmetrics.getRegisteredFontNames() else "Times-Roman"
    return "BrandSans" if "BrandSans" in pdfmetrics.getRegisteredFontNames() else "Helvetica"


def footer(c, page):
    c.setStrokeColor(STONE)
    c.setLineWidth(0.4)
    c.line(M, 28, W - M, 28)
    c.setFillColor(UMBER)
    c.setFont(font("sans"), 6.5)
    c.drawString(M, 17, "ISANDRE / ṬĀQA · IDENTITY A4.1 · PROTOTYPE")
    c.drawRightString(W - M, 17, f"{page:02d}")


def heading(c, kicker, title, subtitle=None):
    c.setFillColor(UMBER)
    c.setFont(font("sans"), 7.5)
    c.drawString(M, H - 58, kicker.upper())
    c.setFillColor(INK)
    c.setFont(font("serif"), 29)
    c.drawString(M, H - 102, title)
    if subtitle:
        c.setFillColor(UMBER)
        c.setFont(font("sans"), 9.5)
        c.drawString(M, H - 124, subtitle)


def wrap(c, text, x, y, width, size=9.5, leading=14, color=INK, max_lines=20):
    c.setFillColor(color)
    c.setFont(font("sans"), size)
    words = text.split()
    lines = []
    current = ""
    for word in words:
        trial = f"{current} {word}".strip()
        if c.stringWidth(trial, font("sans"), size) <= width:
            current = trial
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    for line in lines[:max_lines]:
        c.drawString(x, y, line)
        y -= leading
    return y


def bullets(c, items, x, y, width, size=9.2, leading=14, color=INK):
    for item in items:
        c.setFillColor(COBALT)
        c.circle(x + 2, y + 3, 1.3, fill=1, stroke=0)
        y = wrap(
            c,
            item,
            x + 12,
            y,
            width - 12,
            size=size,
            leading=leading,
            color=color,
            max_lines=4,
        ) - 6
    return y


def entaille(c, x, y, width, fill=INK):
    height = width * 1.55
    notch = width * 0.34
    notch_bottom = y + height * 0.62 - notch / 2
    p = c.beginPath()
    p.moveTo(x, y)
    p.lineTo(x + width, y)
    p.lineTo(x + width, notch_bottom)
    p.lineTo(x + width - notch, notch_bottom)
    p.lineTo(x + width - notch, notch_bottom + notch)
    p.lineTo(x + width, notch_bottom + notch)
    p.lineTo(x + width, y + height)
    p.lineTo(x, y + height)
    p.close()
    c.setFillColor(fill)
    c.drawPath(p, fill=1, stroke=0)


def page_cover(c):
    c.setFillColor(LIMEWASH)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    entaille(c, M, H - 210, 52)
    c.drawImage(
        str(ROOT / "brand" / "raster" / "isandre-wordmark-ink.png"),
        130,
        H - 128,
        width=238,
        height=43,
        mask="auto",
    )
    c.setFont(font("sans"), 10)
    c.setFillColor(UMBER)
    c.drawString(132, H - 141, "ṬĀQA · IDENTITY A4.1")
    c.setFont(font("serif"), 43)
    c.setFillColor(INK)
    c.drawString(M, 320, "A place made")
    c.drawString(M, 267, "in the material.")
    c.setFillColor(COBALT)
    c.rect(M, 205, 118, 7, fill=1, stroke=0)
    c.setFillColor(UMBER)
    c.setFont(font("sans"), 9)
    c.drawString(M, 178, "DIGITAL + PHYSICAL SYSTEM")
    c.drawString(M, 162, "ENGLISH / FRANÇAIS")
    footer(c, 1)


def page_architecture(c):
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    heading(c, "01 · Architecture", "One house. One first collection.")
    rows = [
        ("HOUSE / MAISON", "ISANDRE", "Permanent design and publishing house."),
        ("COLLECTION", "ṬĀQA", "Editorial form. TAQA in technical systems."),
        ("PRODUCTS / PRODUITS", "SEUIL 01 · PORTÉE 02 · VEILLE 03", "Fixed product identities."),
    ]
    y = H - 180
    for label, value, note in rows:
        c.setStrokeColor(STONE)
        c.line(M, y + 18, W - M, y + 18)
        c.setFillColor(UMBER)
        c.setFont(font("sans"), 7)
        c.drawString(M, y, label)
        c.setFillColor(INK)
        c.setFont(font("sans"), 15)
        c.drawString(180, y - 3, value)
        c.setFillColor(UMBER)
        c.setFont(font("sans"), 7.5)
        c.drawString(180, y - 22, note)
        y -= 92
    c.setFillColor(INK)
    c.setFont(font("serif"), 25)
    c.drawString(M, y - 18, "THE ROOM CONTINUES.")
    c.drawString(M, y - 54, "LA PIÈCE CONTINUE.")
    wrap(
        c,
        "ṬĀQA names a niche, cupboard or opening made within the thickness of a wall. "
        "The collection translates the gesture, not a decorative style.",
        M,
        y - 95,
        W - 2 * M,
        color=UMBER,
    )
    footer(c, 2)


def page_marks(c):
    c.setFillColor(INK)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(STONE)
    c.setFont(font("sans"), 7.5)
    c.drawString(M, H - 58, "02 · MARKS / SIGNES")
    c.drawImage(
        str(ROOT / "brand" / "raster" / "isandre-wordmark-paper.png"),
        M,
        H - 142,
        width=290,
        height=52,
        mask="auto",
    )
    c.setFillColor(STONE)
    c.setFont(font("sans"), 9)
    c.drawString(M, H - 157, "Custom capitals · no arch · independent from the collection")
    entaille(c, M, 330, 70, fill=LIMEWASH)
    c.setFillColor(LIMEWASH)
    c.setFont(font("serif"), 28)
    c.drawString(160, 415, "L'ENTAILLE")
    y = 385
    y = bullets(
        c,
        [
            "Overall ratio 1:1.55.",
            "One square notch measuring 0.34 x 0.34.",
            "Notch centre at 62% of sign height.",
            "No radius, perspective, second notch, shadow or repeated pattern.",
        ],
        160,
        y,
        W - 160 - M,
        color=LIMEWASH,
    )
    c.setFillColor(STONE)
    c.setFont(font("sans"), 8)
    c.drawString(M, 160, "MINIMUM WORDMARK · 90 PX SCREEN · 18 MM PRINT")
    c.drawString(M, 140, "CLEAR SPACE · 3 I HORIZONTAL · 2 I VERTICAL")
    footer(c, 3)


def page_type_colour(c):
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    heading(c, "03 · Type + colour", "Quiet structure. Product colour stays in the product.")
    c.setFillColor(INK)
    c.setFont(font("serif"), 34)
    c.drawString(M, H - 190, "Bodoni Moda")
    c.setFont(font("sans"), 21)
    c.drawString(M, H - 238, "Manrope · Interface and body")
    c.setFont(font("sans"), 10)
    c.drawString(M, H - 270, "TQ-S01-CRA · NO 000127 · TABULAR NUMERALS")
    colours = [
        ("INK", INK, "#1B1917"),
        ("LIMEWASH", LIMEWASH, "#F4EFE6"),
        ("STONE", STONE, "#C9C0B2"),
        ("UMBER", UMBER, "#6D5B4B"),
        ("PASSAGE COBALT", COBALT, "#274C77"),
    ]
    x = M
    y = H - 380
    box_w = (W - 2 * M - 4 * 8) / 5
    for name, colour, value in colours:
        c.setFillColor(colour)
        c.rect(x, y, box_w, 72, fill=1, stroke=0)
        c.setFillColor(INK)
        c.setFont(font("sans"), 5.8)
        c.drawString(x, y - 13, name)
        c.setFillColor(UMBER)
        c.drawString(x, y - 24, value)
        x += box_w + 8
    y -= 110
    wrap(
        c,
        "Product finishes: Chalk / Craie, Butter / Beurre, Sage / Sauge and "
        "Rose Clay / Argile rose. Finish colour never recolours the interface.",
        M,
        y,
        W - 2 * M,
        color=UMBER,
    )
    footer(c, 4)


def page_interface_photo(c):
    c.setFillColor(LIMEWASH)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    heading(c, "04 · Interface + image", "Images behave as openings, not decorated cards.")
    y = H - 170
    y = bullets(
        c,
        [
            "Twelve columns on desktop and four on mobile.",
            "Controls 48-52 px, control radii 0-2 px, image radii at most 16 px.",
            "No cosmetic pills, arch icons or permanent decorative effects.",
            "Motion lasts 240-400 ms and never morphs product geometry.",
            "Use one readable light source and grazing light on the thickness.",
            "Pair frontal recognition with a side or rear proof.",
            "Domestic objects require credible source, scale, material and gravity.",
        ],
        M,
        y,
        W - 2 * M,
    )
    c.setFillColor(COBALT)
    c.rect(M, 170, W - 2 * M, 96, fill=1, stroke=0)
    c.setFillColor(PAPER)
    c.setFont(font("serif"), 20)
    c.drawString(M + 22, 226, "Generated images create desire.")
    c.drawString(M + 22, 195, "Real images create proof.")
    footer(c, 5)


def page_plate(c):
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    heading(c, "05 · Origin", "La Marque d'origine")
    plate_w = 260
    plate_h = plate_w / 1.618
    x = M
    y = H - 360
    c.setFillColor(HexColor("#5C493B"))
    c.roundRect(x, y, plate_w, plate_h, 5, fill=1, stroke=0)
    entaille(c, x + 22, y + 33, 39, fill=LIMEWASH)
    c.setFillColor(LIMEWASH)
    c.setFont(font("sans"), 18)
    c.drawString(x + 91, y + 108, "ISANDRE")
    c.setFont(font("sans"), 7)
    c.drawString(x + 91, y + 78, "ṬĀQA · SEUIL 01")
    c.drawString(x + 91, y + 59, "DESIGN · MOHYI BENCHRIH")
    c.drawString(x + 91, y + 40, "NO 000127")
    c.setFillColor(INK)
    c.setFont(font("sans"), 10)
    c.drawString(350, H - 220, "42.07 x 26.00 x 1.20 MM")
    c.setFillColor(UMBER)
    c.setFont(font("sans"), 8)
    c.drawString(350, H - 243, "Dark silicon bronze")
    c.drawString(350, H - 261, "Fine horizontal brush")
    c.drawString(350, H - 279, "Matte patina · flush fit")
    y2 = 300
    y2 = bullets(
        c,
        [
            "Position on the inner right return of the lower horizontal opening.",
            "Set back 28-32 mm and invisible in a strict frontal view.",
            "FRANCE only after legally proven manufacturing origin.",
            "NFC remains hidden and requires ferrite, RF and five-phone testing.",
            "This layout remains PROTOTYPE until print, engraving and physical gates pass.",
        ],
        M,
        y2,
        W - 2 * M,
    )
    footer(c, 6)


def page_evidence(c):
    c.setFillColor(LIMEWASH)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    heading(c, "06 · Evidence", "Authentication without theatre.")
    y = H - 175
    y = bullets(
        c,
        [
            "Unique serial number repeated discreetly in the furniture body.",
            "Persistent product passport: model, finish, batch and actual production site.",
            "Quality checks, care, repairs and optional ownership transfer.",
            "No visible QR code, mandatory app, NFT language or absolute security claim.",
            "Primary packaging: Limewash or natural board, Ink mark, one Cobalt rule.",
            "No product photograph on the primary carton.",
        ],
        M,
        y,
        W - 2 * M,
    )
    c.setFillColor(INK)
    c.rect(M, 140, W - 2 * M, 145, fill=1, stroke=0)
    c.setFillColor(LIMEWASH)
    c.setFont(font("sans"), 8)
    c.drawString(M + 22, 250, "OWNER EXPERIENCE")
    c.setFont(font("serif"), 20)
    c.drawString(M + 22, 210, "ISANDRE ORIGINAL / NO 000127")
    c.setFillColor(STONE)
    c.setFont(font("sans"), 8)
    c.drawString(M + 22, 180, "Provenance · care · quality · repair · transfer")
    footer(c, 7)


def page_prohibitions(c):
    c.setFillColor(INK)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(STONE)
    c.setFont(font("sans"), 7.5)
    c.drawString(M, H - 58, "07 · NON-NEGOTIABLES / INTERDITS")
    c.setFillColor(LIMEWASH)
    c.setFont(font("serif"), 31)
    c.drawString(M, H - 105, "Consistency is the identity.")
    y = H - 160
    y = bullets(
        c,
        [
            "Never use TAKA. Never merge ISANDRE and TAQA into one house name.",
            "Never add an arch, fake Arabic alphabet or generic Moroccan motif.",
            "Never repeat L'ENTAILLE or use it with gradients, shadows or photographs.",
            "Never claim French manufacture, popularity, scarcity, press or provenance without proof.",
            "Never fabricate workshops, artisans, owners or manufacturing evidence.",
            "Never alter product geometry to improve an image composition.",
            "Never release the bronze plate before 1:1, engraving, fixation, abrasion and NFC tests.",
        ],
        M,
        y,
        W - 2 * M,
        size=9.5,
        leading=15,
        color=LIMEWASH,
    )
    c.setFillColor(COBALT)
    c.rect(M, 120, 160, 8, fill=1, stroke=0)
    c.setFillColor(LIMEWASH)
    c.setFont(font("sans"), 8)
    c.drawString(M, 92, "THE ROOM CONTINUES. / LA PIÈCE CONTINUE.")
    footer(c, 8)


def render():
    register_fonts()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
    c.setTitle("ISANDRE / ṬĀQA - Identity A4.1")
    c.setAuthor("ISANDRE")
    c.setSubject("Digital and physical identity guidelines")
    pages = [
        page_cover,
        page_architecture,
        page_marks,
        page_type_colour,
        page_interface_photo,
        page_plate,
        page_evidence,
        page_prohibitions,
    ]
    for page in pages:
        page(c)
        c.showPage()
    c.save()
    CANONICAL_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    copy2(OUTPUT, CANONICAL_OUTPUT)
    print(f"Generated {OUTPUT}")
    print(f"Versioned {CANONICAL_OUTPUT}")


if __name__ == "__main__":
    render()
