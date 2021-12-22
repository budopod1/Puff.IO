from flask import Flask

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'

# Load home page
with open("files/home.js") as file:
  home_script = file.read()
with open("files/home.css") as file:
  home_style = file.read()
with open("files/home.html") as file:
  home_html = file.read()

# Load about page
with open("files/about.html") as file:
  about_html = file.read()
with open("files/about.css") as file:
  about_style = file.read()

# Fromat the pages
home_html = home_html.format(home_script, home_style)
about_html = about_html.format(about_style)


# Route the home page
@app.route('/')
def index():
  return home_html


# Route the about page
@app.route("/about")
def about():
  return about_html


# Route all the assets
@app.route('/assets/<path>')
def files(path):
  with open("assets/" + path, "rb") as file:
    return file.read()


# Start the app
if __name__ == '__main__':
  app.run(host="0.0.0.0", port=443)
