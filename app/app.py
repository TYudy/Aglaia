from flask import Flask, render_template, request, jsonify, redirect, url_for
import mysql.connector

app = Flask(__name__)

db = mysql.connector.connect(
    host = "localhost",
    user = "root",
    password="",
    database = "AGLAIA"

)

suggestions_data = ["Python", "Flask", "JavaScript", "HTML", "CSS", "React", "Vue.js", "Django", "Node.js"]

@app.route('/')
def index():
    return render_template ('index.html')


@app.route('/Login')
def login():
    return render_template ('General/Login.html')

@app.route('/form')
def form():
    return render_template('Emprendedor/Formulario.html')

@app.route('/AP')
def AprobarP():
    return render_template ('Administrador/AprobarP.html')

@app.route('/Editor')
def editor():
    return render_template('Emprendedor/Editor.html')

@app.route('/Premium')
def premium():
    return render_template('General/versionPremium.html')

@app.route('/Plantillas')
def plantillas():
    return render_template('Emprendedor/Plantillas.html')
@app.route('/Pago')
def pago():
    return render_template('General/pago.html')
@app.route('/regtemp')
def regtemporal():
    return render_template('General/registro.html')






@app.route('/registro_usuario', methods=['GET', 'POST'])
def registro_usuario():
    if request.method == 'POST':
        nombre = request.form['nombre']
        apellido = request.form['apellido']
        email = request.form['email']
        contraseña = request.form['contraseña']
      
        cur = db.cursor()
        cur.execute("INSERT INTO Usuarios (nombre, apellido, email, contrasena) VALUES (%s, %s, %s, %s)", (nombre, apellido, email, contraseña))
        db.commit()
        cur.close()
        return redirect(url_for('index'))
    return render_template('Registro.html')


@app.route('/iniciar_sesion', methods=['POST'])
def iniciar_sesion():
    if request.method == 'POST':
        email = request.form['email']
        contraseña = request.form['contraseña']
        cur = db.cursor()
       
        result = cur.execute("SELECT * FROM Usuarios WHERE email = %s AND contraseña = %s", (email, contraseña))
        if result > 0:
            
            return redirect(url_for('index'))
        else:
          
            return redirect(url_for('error_inicio_sesion'))
    # return render_template('Login.html')


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
