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

# Fromat the pages
home_html = home_html.format(home_script, home_style)


# Route the home page
@app.route('/')
def index():
  return home_html


# Show the icon
@app.route("/favicon.ico")
def favicon():
  with open("assets/puff-icon.ico", "rb") as file:
    return file.read()


# Start the app
if __name__ == '__main__':
  app.run(host="0.0.0.0", port=443)
