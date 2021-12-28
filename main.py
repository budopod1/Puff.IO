from flask import Flask
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
app.static_folder = "assets"

# Load home page
with open("files/home.js") as file:
  home_script = file.read()
with open("files/home.css") as file:
  home_style = file.read()
with open("files/home.html") as file:
  home_html = file.read()

# Load the favicon
with open("assets/puff-icon.ico", "rb") as file:
  favicon_image = file.read()

# Format the pages
home_html = home_html.format(home_script, home_style)


# Route the home page
@app.route('/')
def home():
  return home_html


# Show the icon
@app.route("/favicon.ico")
def favicon():
  return favicon_image


# Start the app
if __name__ == '__main__':
  app.run(host="0.0.0.0", port=443)
