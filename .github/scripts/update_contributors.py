import os
import re
import json
import requests

# Configuration
REPO_OWNER = os.environ.get("GITHUB_REPOSITORY", "").split("/")[0]
REPO_NAME = os.environ.get("GITHUB_REPOSITORY", "").split("/")[1] if "/" in os.environ.get("GITHUB_REPOSITORY", "") else ""
README_PATH = "README.md"
TOKEN = os.environ.get("GITHUB_TOKEN")
MAX_CONTRIBUTORS = 20  # Limit number of contributors to display

# Define the markers in README where contributors section should be placed
START_MARKER = "<!-- CONTRIBUTORS-START -->"
END_MARKER = "<!-- CONTRIBUTORS-END -->"

def get_contributors():
    """Fetch contributors from GitHub API"""
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contributors"
    headers = {"Authorization": f"token {TOKEN}"} if TOKEN else {}
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        contributors = response.json()
        
        # Limit to max contributors
        return contributors[:MAX_CONTRIBUTORS]
    except Exception as e:
        print(f"Error fetching contributors: {e}")
        return []

def generate_contributors_section(contributors):
    """Generate HTML for contributors section"""
    if not contributors:
        return f"{START_MARKER}\nNo contributors found.\n{END_MARKER}"
    
    html = f"{START_MARKER}\n"
    html += "## Contributors\n\n"
    html += "<table>\n  <tr>\n"
    
    # Add each contributor
    for i, contributor in enumerate(contributors):
        if i > 0 and i % 6 == 0:  # 6 contributors per row
            html += "  </tr>\n  <tr>\n"
            
        username = contributor["login"]
        avatar_url = contributor["avatar_url"]
        profile_url = contributor["html_url"]
        contributions = contributor["contributions"]
        
        html += f"""    <td align="center">
      <a href="{profile_url}">
        <img src="{avatar_url}" width="64" height="64" alt="{username}"><br />
        <sub><b>{username}</b></sub>
      </a><br />
      <sub>{contributions} commits</sub>
    </td>\n"""
    
    html += "  </tr>\n</table>\n"
    html += f"{END_MARKER}"
    
    return html

def update_readme():
    """Update README.md with contributors section"""
    try:
        # Read the current README
        with open(README_PATH, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Get contributors
        contributors = get_contributors()
        contributors_section = generate_contributors_section(contributors)
        
        # Check if the README already has the markers
        if START_MARKER in content and END_MARKER in content:
            # Replace existing section
            updated_content = re.sub(
                f"{START_MARKER}.*?{END_MARKER}",
                contributors_section,
                content,
                flags=re.DOTALL
            )
        else:
            # Append to the end of README
            updated_content = content + "\n\n" + contributors_section
        
        # Write updated README
        with open(README_PATH, "w", encoding="utf-8") as f:
            f.write(updated_content)
            
        print(f"Successfully updated README with {len(contributors)} contributors")
        
    except Exception as e:
        print(f"Error updating README: {e}")

if __name__ == "__main__":
    update_readme()