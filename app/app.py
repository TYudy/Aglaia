from flask import Flask, render_template
import mysql.connector
app = Flask(__name__)

db = mysql.connector.connect(
    host = "localhost",
    user = "root",
    password="",
    database = "AGLAIA"

)
db.close()




@app.route('/')
def index():
    return render_template ('index.html')




@app.route('/AP')
def AprobarP():
    return render_template ('Administrador/AprobarP.html')


if __name__ == '__main__':

    app.add_url_rule('/', view_func=index)
    app.run(debug=True,port=5000)