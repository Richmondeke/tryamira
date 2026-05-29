import re

with open('preview.html', 'r') as f:
    c = f.read()

# Remove Amira text
old_html = """          <div class="footerBrandName">
            <img src="https://framerusercontent.com/assets/Wo30Sktse9esY3HXGesSUG8i0o.png" alt="Amira Logo" class="footerLogoImg" />
            Amira
          </div>"""
new_html = """          <div class="footerBrandName">
            <img src="https://framerusercontent.com/assets/Wo30Sktse9esY3HXGesSUG8i0o.png" alt="Amira Logo" class="footerLogoImg" />
          </div>"""
c = c.replace(old_html, new_html)

# Increase logo size and fix aspect ratio
old_css = """    .footerLogoImg {
      width: 26px;
      height: 26px;
      border-radius: 6px;
    }"""
new_css = """    .footerLogoImg {
      width: auto;
      height: 42px;
      border-radius: 6px;
    }"""
c = c.replace(old_css, new_css)

with open('preview.html', 'w') as f:
    f.write(c)

print("Updated preview.html successfully.")
