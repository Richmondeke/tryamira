import re

# 1. preview.html
with open('preview.html', 'r') as f:
    c = f.read()

c = c.replace("font-family: 'Paytone One', sans-serif;", "font-family: 'Poppins', sans-serif;\n      font-weight: 600;")
c = c.replace('<span class="navLogoText">Amira</span>', '')
c = c.replace('<span class="footerLogoText">Amira</span>', '')
c = re.sub(r'\.navLogoImg\s*\{\s*width:\s*32px;\s*height:\s*32px;\s*border-radius:\s*8px;\s*\}', '.navLogoImg { width: auto; height: 32px; }', c)
c = re.sub(r'\.footerLogoImg\s*\{\s*width:\s*32px;\s*height:\s*32px;\s*border-radius:\s*8px;\s*\}', '.footerLogoImg { width: auto; height: 32px; }', c)
# also remove weight: 400 from .navLogoText and .footerLogoText if any, actually not needed since we deleted the span.
with open('preview.html', 'w') as f:
    f.write(c)

# 2. page.module.css
with open('src/app/page.module.css', 'r') as f:
    c = f.read()

c = c.replace("font-family: var(--font-paytone), sans-serif;", "font-family: var(--font-poppins), sans-serif;\n  font-weight: 600;")
# remove any explicit font-weight: 400; associated with those so it doesn't override the 600
c = c.replace("  font-weight: 400;\n", "")

c = re.sub(r'\.navLogoImg\s*\{\s*width:\s*32px;\s*height:\s*32px;\s*border-radius:\s*8px;\s*\}', '.navLogoImg {\n  width: auto;\n  height: 32px;\n}', c)
c = re.sub(r'\.footerLogoImg\s*\{\s*width:\s*26px;\s*height:\s*26px;\s*border-radius:\s*6px;\s*\}', '.footerLogoImg {\n  width: auto;\n  height: 26px;\n}', c)
with open('src/app/page.module.css', 'w') as f:
    f.write(c)

# 3. page.tsx
with open('src/app/page.tsx', 'r') as f:
    c = f.read()

c = c.replace('<span className={styles.navLogoText}>Amira</span>', '')
c = re.sub(r'<img\s+src="https://framerusercontent\.com/assets/Wo30Sktse9esY3HXGesSUG8i0o\.png"\s+alt="Amira Logo"\s+className=\{styles\.footerLogoImg\}\s+/>\s+Amira', 
           r'<img \n                src="https://framerusercontent.com/assets/Wo30Sktse9esY3HXGesSUG8i0o.png" \n                alt="Amira Logo" \n                className={styles.footerLogoImg} \n              />', c)
with open('src/app/page.tsx', 'w') as f:
    f.write(c)

print("Fixes applied successfully.")
