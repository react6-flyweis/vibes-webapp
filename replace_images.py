#!/usr/bin/env python3
import re

# Read the file content
with open('server/simple-storage.ts', 'r') as f:
    content = f.read()

# Map of event types to appropriate Unsplash images
image_replacements = [
    ("https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=240&fit=crop&auto=format", "tech conference"),  # Tech Conference 
    ("https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400&h=240&fit=crop&auto=format", "garden party"),   # Garden Wedding
    ("https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=240&fit=crop&auto=format", "pool party"),     # Pool party
    ("https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=240&fit=crop&auto=format", "concert"),        # Concert/Music
    ("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=240&fit=crop&auto=format", "beach party"),    # Beach/Sunset
    ("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=240&fit=crop&auto=format", "food festival"),  # Food/Cooking
    ("https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=240&fit=crop&auto=format", "nightclub"),      # Nightclub/Rave
    ("https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=240&fit=crop&auto=format", "workshop"),       # Workshop/Class
    ("https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=240&fit=crop&auto=format", "networking"),     # Networking
    ("https://images.unsplash.com/photo-1510511459019-5dda7724fd87?w=400&h=240&fit=crop&auto=format", "charity"),        # Charity
]

# Replace placeholder images systematically
placeholder_pattern = r'image: "/api/placeholder/400/240",'
matches = list(re.finditer(placeholder_pattern, content))

print(f"Found {len(matches)} placeholder images to replace")

# Replace each placeholder with appropriate images
for i, match in enumerate(matches):
    replacement_image = image_replacements[i % len(image_replacements)][0]
    new_content = content[:match.start()] + f'image: "{replacement_image}",' + content[match.end():]
    content = new_content
    # Update match positions for subsequent replacements
    if i < len(matches) - 1:
        offset = len(f'image: "{replacement_image}",') - len('image: "/api/placeholder/400/240",')
        for j in range(i + 1, len(matches)):
            matches[j] = type(matches[j])(matches[j].pattern, matches[j].string, matches[j].pos + offset, matches[j].endpos + offset)

# Write the updated content back
with open('server/simple-storage.ts', 'w') as f:
    f.write(content)

print("Successfully replaced all placeholder images with real Unsplash images!")