import os
import glob

base_dir = "/Users/mac/.gemini/antigravity/scratch/tryamira/src/app/dashboard"
files = glob.glob(f"{base_dir}/**/*.tsx", recursive=True)

# Also do layout
layout_file = "/Users/mac/.gemini/antigravity/scratch/tryamira/src/app/layout.tsx"
if os.path.exists(layout_file):
    files.append(layout_file)
    
sidebar_file = "/Users/mac/.gemini/antigravity/scratch/tryamira/src/components/layout/Sidebar.tsx"
if os.path.exists(sidebar_file):
    files.append(sidebar_file)

navbar_file = "/Users/mac/.gemini/antigravity/scratch/tryamira/src/components/layout/Navbar.tsx"
if os.path.exists(navbar_file):
    files.append(navbar_file)

# Add Modal and Toast
ui_dir = "/Users/mac/.gemini/antigravity/scratch/tryamira/src/components/ui"
files.extend(glob.glob(f"{ui_dir}/*.tsx"))

replacements = {
    "fontSize: '32px'": "fontSize: '24px'",
    "fontSize: '24px'": "fontSize: '20px'",
    "fontSize: '18px'": "fontSize: '16px'",
    "fontSize: '16px'": "fontSize: '14px'",
    "fontSize: '14px'": "fontSize: '13px'",
    "fontSize: '13px'": "fontSize: '12px'",
    "padding: '2rem'": "padding: '1.5rem'",
    "padding: '1.5rem'": "padding: '1.25rem'",
    "marginBottom: '2rem'": "marginBottom: '1.5rem'",
    "marginBottom: '1.5rem'": "marginBottom: '1rem'",
}

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    modified = content
    for old, new in replacements.items():
        modified = modified.replace(old, new)
        
    if modified != content:
        with open(file_path, 'w') as f:
            f.write(modified)
            
print("Successfully scaled down all font sizes and paddings in dashboard.")
