import os
import re

repo_dir = r"C:\Users\tejas\OneDrive\Desktop\TRutiL_Studio"
tools_dir = os.path.join(repo_dir, "tools")

# Step 1: Rename hub.html to index.html
renamed_count = 0
for root, dirs, files in os.walk(tools_dir):
    for f in files:
        if f == "hub.html":
            old_path = os.path.join(root, f)
            new_path = os.path.join(root, "index.html")
            os.rename(old_path, new_path)
            renamed_count += 1
            print(f"Renamed: {old_path} -> {new_path}")

print(f"Total files renamed: {renamed_count}")

# Step 2: Replace occurrences of hub.html in all files
updated_count = 0
for root, dirs, files in os.walk(repo_dir):
    # Skip .git directory
    if ".git" in root:
        continue
        
    for f in files:
        if f.endswith(".html") or f.endswith(".js") or f.endswith(".json"):
            filepath = os.path.join(root, f)
            try:
                with open(filepath, 'r', encoding='utf-8') as file:
                    content = file.read()
                
                # We specifically look for hub.html and replace it with index.html
                # Be careful not to replace hub.css!
                new_content = content.replace("hub.html", "index.html")
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as file:
                        file.write(new_content)
                    updated_count += 1
            except Exception as e:
                print(f"Error processing {filepath}: {e}")

print(f"Total files updated with new links: {updated_count}")
