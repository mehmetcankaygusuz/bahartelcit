# Bahar Tel Çit logo üreticisi.
# İşaret (b + bıçaklar) orijinal logodan izlendi: mark.path. Yazı tipi: Poppins SemiBold (OFL),
# `npm pack @fontsource/poppins@5.1.0` ile alınıp FONT_DIR'e açılır. Yazı SVG yoluna çevrilir, sitede font yüklenmez.
# Kullanım: python3 logo.py <FONT_DIR> <ÇIKTI_KLASÖRÜ>
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

FONT_DIR, OUT = sys.argv[1], sys.argv[2]
fonts = [TTFont(f'{FONT_DIR}/poppins-latin-600-normal.woff'), TTFont(f'{FONT_DIR}/poppins-latin-ext-600-normal.woff')]
import re
_parts = re.findall(r'M[^M]*', open(__file__.rsplit('/', 1)[0] + '/mark.path').read())
MARK, HOLE = ''.join(_parts[:3]), _parts[3]  # 4. parça "b" harfinin iç boşluğu, maske ile oyulur

def mark_g(color, transform):
    return (f'<defs><mask id="bm" maskUnits="userSpaceOnUse" x="0" y="0" width="2000" height="2000">'
            f'<rect width="2000" height="2000" fill="#fff"/><path fill="#000" d="{HOLE}"/></mask></defs>'
            f'<g transform="{transform}"><path fill="{color}" mask="url(#bm)" d="{MARK}"/></g>')
mx0, my0, mx1, my1 = map(int, open(__file__.rsplit('/', 1)[0] + '/mark.bbox').read().split())
MW, MH = mx1 - mx0, my1 - my0

GREEN, INK, LIGHT, PALE = '#1f6b3a', '#18231c', '#ffffff', '#8fd6a7'

def text_path(s, x, baseline, size):
    """Metni SVG path'e çevirir, (path_d, genişlik) döner."""
    out, cx = [], x
    for ch in s:
        f = next(f for f in fonts if ord(ch) in f.getBestCmap())
        gs = f.getGlyphSet(); name = f.getBestCmap()[ord(ch)]
        k = size / f['head'].unitsPerEm
        pen = SVGPathPen(gs)
        gs[name].draw(TransformPen(pen, (k, 0, 0, -k, cx, baseline)))
        out.append(pen.getCommands())
        cx += gs[name].width * k
    return ''.join(out), cx - x

def cap_height():
    f = fonts[0]; gs = f.getGlyphSet(); bp = BoundsPen(gs); gs['H'].draw(bp)
    return bp.bounds[3] / f['head'].unitsPerEm

CAP = cap_height()

def logo(mark_color, top_color, bottom_color, h=MH):
    # Orijinal orana göre: büyük harf yüksekliği ≈ işaret yüksekliğinin %36'sı, alt satırın tabanı işaretin tabanıyla hizalı
    cap = h * 0.36; size = cap / CAP; pitch = h * 0.43; gap = h * 0.16
    s = h / MH; mw = MW * s
    x = mw + gap
    b2 = h - h * 0.005; b1 = b2 - pitch
    p1, w1 = text_path('BAHAR', x, b1, size)
    p2, w2 = text_path('TEL ÇİT', x, b2, size)
    W = x + max(w1, w2) + 2
    H = h + cap * 0.28  # Ç çengeli için alt pay
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.0f} {H:.0f}" role="img" aria-label="Bahar Tel Çit">'
           + mark_g(mark_color, f'scale({s:.5f}) translate({-mx0} {-my0})') +
           f'<path fill="{top_color}" d="{p1}"/><path fill="{bottom_color}" d="{p2}"/></svg>')
    return svg, W, H

def icon(bg, fg, size=512, radius=96):
    pad = size * 0.14; s = (size - 2 * pad) / MH; w = MW * s
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}">'
            + (f'<rect width="{size}" height="{size}" rx="{radius}" fill="{bg}"/>' if bg else '')
            + mark_g(fg, f'translate({(size - w) / 2:.1f} {pad:.1f}) scale({s:.5f}) translate({-mx0} {-my0})') + '</svg>')

for name, args in {'logo.svg': (GREEN, INK, GREEN), 'logo-acik.svg': (PALE, LIGHT, PALE)}.items():
    svg, W, H = logo(*args)
    open(f'{OUT}/{name}', 'w').write(svg)
    print(name, round(W), H)
open(f'{OUT}/isaret.svg', 'w').write(icon(None, GREEN))
open(f'{OUT}/favicon.svg', 'w').write(icon(GREEN, '#ffffff', 64, 12))
open(f'{OUT}/ikon-512.svg', 'w').write(icon(GREEN, '#ffffff', 512, 96))
