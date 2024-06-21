from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import mysql.connector
app = Flask(__name__)
app.secret_key = 'your_secret_key'

app.static_folder = 'static'

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database = "AGLAIA"

)
db.close()




@app.route('/')
def index():
    return render_template('index.html')

@app.route('/Login')
def login():
    return render_template('General/Login.html')

@app.route('/form')
def form():
    return render_template('Emprendedor/Formulario.html')

@app.route('/AP')
def AprobarP():
    return render_template('Administrador/AprobarP.html')

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


@app.route('/RegisPatro')
def registropatro():
    return render_template('Patrocinador/RegistroPatr.html')

@app.route('/RegisEmpre')
def registroempre():
    return render_template('Emprendedor/Registro.html')

@app.route('/Interaccion')
def interaccion():
    return render_template('General/interaccion.html')

@app.route('/registro_usuario', methods=['POST', 'GET'])
def registro_usuario():
    if request.method == 'POST':
        nombre = request.form['nombre']
        apellido = request.form['apellido']
        email = request.form['email']
        contraseña = request.form['contrasena']
        role = request.form['role']

        # Encriptar la contraseña antes de almacenarla en la base de datos
        contraseña_encriptada = generate_password_hash(contraseña)

        cur = db.cursor()
        cur.execute("INSERT INTO Usuarios (nombre, apellido, email, contraseña, role) VALUES (%s, %s, %s, %s, %s)",
                    (nombre, apellido, email, contraseña_encriptada, role))
        db.commit()
        cur.close()
        return redirect(url_for('index'))
    return render_template('Registro.html')

@app.route('/iniciar_sesion', methods=['POST'])
def iniciar_sesion():
    if request.method == 'POST':
        email = request.form['email']
        contraseña = request.form['contraseña']
        cur = db.cursor(dictionary=True)  # Fetch results as dictionaries

        # Verifica las credenciales del usuario en la base de datos
        cur.execute("SELECT * FROM Usuarios WHERE email = %s", (email,))
        user = cur.fetchone()

        if user and check_password_hash(user['contraseña'], contraseña):
            # Usuario autenticado correctamente, guardar información en la sesión
            session['user_id'] = user['id_usuario']
            session['user_role'] = user['role']

            print(f"Usuario {user['email']} autenticado con rol {user['role']}")  # Depuración

            # Redirigir según el rol
            if user['role'] == 'administrador':
                return redirect(url_for('IndexAd'))
            elif user['role'] == 'emprendimiento':
                return redirect(url_for('IndexEmp'))
            elif user['role'] == 'patrocinador':
                return redirect(url_for('IndexPatro'))
            else:
                return "Rol de usuario no reconocido"
        else:
            # Credenciales incorrectas, redirigir al error_inicio_sesion o mostrar un mensaje de error
            return redirect(url_for('error_inicio_sesion'))

            @app.route('/error_inicio_sesion')
            def error_inicio_sesion():
                return render_template('Login.html')

@app.route("/autocomplete")
def autocomplete():
    query = request.args.get("q", "")
    results = [item for item in suggestions_data if query.lower() in item.lower()]
    return jsonify(results)

@app.route('/aprobar_anuncio/<int:anuncio_id>')
def aprobar_anuncio(anuncio_id):
    cur = db.cursor()
    cur.execute("UPDATE Anuncios SET aprobado = TRUE WHERE id_anuncio = %s", (anuncio_id,))
    db.commit()
    cur.close()
    return redirect(url_for('AprobarP'))

# Asegúrate de tener las rutas IndexAd, IndexEmp e IndexPatro configuradas
@app.route('/IndexAd')
def IndexAd():
    return render_template('Administrador/IndexAd.html')

@app.route('/IndexEmp')
def IndexEmp():
    return render_template('Emprendedor/IndexEmp.html')

@app.route('/IndexPatro')
def IndexPatro():
    return render_template('Patrocinador/IndexPatro.html')


@app.route('/Bot')
def Chat_bot():
     return render_template('General/chatbot.html')


  
if __name__ == '__main__':
    app.add_url_rule('/', view_func=index)
    app.run(debug=True,port=5000)