from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_mysqldb import MySQL

app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'usuario_mysql'
app.config['MYSQL_PASSWORD'] = 'contraseña_mysql'
app.config['MYSQL_DB'] = 'AGLAIA'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
mysql = MySQL(app)

suggestions_data = ["Python", "Flask", "JavaScript", "HTML", "CSS", "React", "Vue.js", "Django", "Node.js"]


@app.route('/')
def index():
    return render_template('inicio_sesion.html')


@app.route('/registro_usuario', methods=['GET', 'POST'])
def registro_usuario():
    if request.method == 'POST':
        nombre = request.form['nombre']
        apellido = request.form['apellido']
        email = request.form['email']
        contraseña = request.form['contraseña']
      
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO Usuarios (nombre, apellido, email, contraseña) VALUES (%s, %s, %s, %s)", (nombre, apellido, email, contraseña))
        mysql.connection.commit()
        cur.close()
        return redirect(url_for('index'))
    return render_template('registro_usuario.html')


@app.route('/iniciar_sesion', methods=['POST'])
def iniciar_sesion():
    if request.method == 'POST':
        email = request.form['email']
        contraseña = request.form['contraseña']
       
        cur = mysql.connection.cursor()
        result = cur.execute("SELECT * FROM Usuarios WHERE email = %s AND contraseña = %s", (email, contraseña))
        if result > 0:
            
            return redirect(url_for('index'))
        else:
          
            return redirect(url_for('error_inicio_sesion'))
    return render_template('inicio_sesion.html')


@app.route('/error_inicio_sesion')
def error_inicio_sesion():
    return render_template('error_inicio_sesion.html')

@app.route("/autocomplete")
def autocomplete():
    query = request.args.get("q", "")
    results = [item for item in suggestions_data if query.lower() in item.lower()]
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
=======