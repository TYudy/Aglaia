from flask import Flask, render_template, request, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash
import mysql.connector
import os
import subprocess
from flask_socketio import SocketIO, emit


app = Flask(__name__)
app.secret_key = 'your_secret_key'
socketio = SocketIO(app, cors_allowed_origins="*")
usuarios = [] 

app.static_folder = 'static'

def get_db_connection():
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="AGLAIA"
    )
    return db   

def get_db_connection():
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="AGLAIA"
    )
    return db

@app.route('/')
def index():
    return render_template('index.html')

# Ruta para mostrar el formulario de inicio de sesión y procesar los datos
@app.route('/Login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        contraseña = request.form['contraseña']

        db = get_db_connection()
        cursor = db.cursor(dictionary=True)

        # Verificar las credenciales del usuario en la base de datos
        cursor.execute("SELECT * FROM Usuarios WHERE email = %s", (email,))
        user = cursor.fetchone()

        if user and check_password_hash(user['contraseña'], contraseña):
            # Usuario autenticado correctamente, guardar información en la sesión
            session['user_id'] = user['id_usuario']
            session['user_role'] = user['role']

            # Redirigir según el rol del usuario
            if user['role'] == 'patrocinador':
                cursor.close()
                db.close()
                return redirect(url_for('IndexPatro'))
            elif user['role'] == 'emprendimiento':
                cursor.close()
                db.close()
                return redirect(url_for('IndexEmp'))
            else:
                cursor.close()
                db.close()
                return "Rol de usuario no reconocido"

        # Credenciales incorrectas
        flash('Credenciales incorrectas', 'error')
        cursor.close()
        db.close()
        return redirect(url_for('login'))

    # Método GET: Mostrar el formulario de inicio de sesión
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


@app.route('/RegistroPatro', methods=['GET', 'POST'])
def registro_patrocinador():
    if request.method == 'POST':
        nombre_empresa = request.form['nombre_empresa']
        persona_contacto = request.form['persona_contacto']
        correo = request.form['correo']
        telefono = request.form['telefono']
        contraseña = request.form['contraseña']

        # Encripta la contraseña antes de almacenarla en la base de datos
        contraseña_encriptada = generate_password_hash(contraseña)

        db = get_db_connection()
        cursor = db.cursor()

        try:
            # Insertar en la tabla Usuarios
            cursor.execute("INSERT INTO Usuarios (nombre, apellido, email, contraseña, role) VALUES (%s, '', %s, %s, 'patrocinador')",
                           (nombre_empresa, correo, contraseña_encriptada))
            # Insertar en la tabla Patrocinadores
            cursor.execute("INSERT INTO Patrocinadores (nombre_empresa, persona_contacto, email_Patro, telefono, fecha_registro, usuario_id) VALUES (%s, %s, %s, %s, CURDATE(), %s)",
                           (nombre_empresa, persona_contacto, correo, telefono, cursor.lastrowid))
            db.commit()
            flash('Patrocinador registrado correctamente', 'success')
            return redirect(url_for('login'))  # Redirige al inicio de sesión después de registrar

        except mysql.connector.Error as err:
            print(f"Error al registrar patrocinador: {err}")
            flash('Error al registrar patrocinador', 'error')   
            db.rollback()
        finally:
            cursor.close()
            db.close()
    return render_template('Patrocinador/RegistroPatro.html')


@app.route('/RegistroEmpre', methods=['GET', 'POST'])
def registroempre():
    if request.method == 'POST':
        nombre = request.form['nombre']
        descripcion = request.form['descripcion']
        categoria_id = request.form['categoria']
        contraseña = request.form['contrasena']  # Asegúrate de usar el nombre correcto del campo de contraseña

        # Encripta la contraseña antes de almacenarla en la base de datos
        contraseña_encriptada = generate_password_hash(contraseña)

        # Simula obtener el ID de usuario de la sesión actual
        usuario_id = 1  # Debes obtener el usuario_id de la sesión actual correctamente

        db = get_db_connection()
        cursor = db.cursor()

        try:
            # Insertar en la tabla Emprendimientos
            cursor.execute("INSERT INTO Emprendimientos (nombre, descripcion, categoria_id, usuario_id) "
                           "VALUES (%s, %s, %s, %s)",
                           (nombre, descripcion, categoria_id, usuario_id))
            db.commit()

            # Insertar en la tabla Usuarios (si es necesario)
            # Aquí debes ajustar según tu lógica de cómo registras los usuarios

            flash('Emprendimiento registrado correctamente', 'success')
            return redirect(url_for('login'))  # Redirige al inicio de sesión después de registrar

        except mysql.connector.Error as err:
            print(f"Error al registrar emprendimiento: {err}")
            flash('Error al registrar emprendimiento', 'error')
            db.rollback()
        finally:
            cursor.close()
            db.close()

    # Método GET: Mostrar el formulario de registro de emprendimiento
    return render_template('Emprendedor/RegistroEmp.html')

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

@app.route('/aprobar_anuncio')
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

@app.route('/chat')
def chat():
    # La ruta para el archivo index.html del chat
  return render_template('chatsito.html')

@socketio.on('nuevo usuario')
def handle_nuevo_usuario(nick, callback):
    if nick not in usuarios:
        usuarios.append(nick)
        emit('usernames', usuarios, broadcast=True)
        callback(True)
        emit('redirigir', url_for('chat'), to=request.sid)  # Redirige al usuario al chat
    else:
        callback(False)

@socketio.on('disconnect')
def handle_disconnect():
    for user in usuarios:
        if user['sid'] == request.sid:
            usuarios.remove(user)
            emit('usernames', usuarios, broadcast=True)
            break

if __name__ == '__main__':
    socketio.run(app, debug=True)



