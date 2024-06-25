from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
import base64
# from flask_socketio import SocketIO, emit
app = Flask(__name__)
app.secret_key = 'your_secret_key'
# socketio = SocketIO(app, cors_allowed_origins="*")

app.static_folder = 'static'

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database = "AGLAIA"

)

@app.route('/')
def index():
    return render_template('index.html')
    
@app.route('/Login')
def login():
    return render_template('General/Login.html')


# INICIO SESIÓN

@app.route('/iniciar_sesion', methods=['POST'])
def iniciar_sesion():
    if request.method == 'POST': 
        email = request.form['email']
        contraseña = request.form['contraseña']
        
        cur = db.cursor(dictionary=True)
        cur.execute("SELECT * FROM Usuarios WHERE email = %s", (email,))
        user = cur.fetchone()

        # Debug: imprimir los valores de email y contraseña
        print(f"Email: {email}")
        print(f"Contraseña proporcionada: {contraseña}")

        if user:
            # Debug: imprimir los valores de la base de datos
            print(f"Usuario encontrado: {user}")
            if check_password_hash(user['contraseña'], contraseña):
                print("Contraseña verificada con éxito")
                # Usuario autenticado correctamente, guardar información en la sesión
                session['user_id'] = user['id_usuario']
                session['user_rol'] = user['role']
                print(session['user_rol'],session['user_id'])
                # Redirigir según el rol
                if session['user_rol'] == 'administrador':
                    print("Redirigiendo a IndexAd")
                    return redirect(url_for('IndexAd'))
                elif session['user_rol'] == 'emprendimiento':
                    print("Redirigiendo a IndexEmp")
                    return redirect(url_for('IndexEmp'))
                elif session['user_rol'] == 'patrocinador':
                    print("Redirigiendo a IndexPatro")
                    return redirect(url_for('IndexPatro'))
                else:
                    print("No es un rol")
                    return redirect(url_for('login'))
            else:
                print("Contraseña incorrecta")
                # Contraseña incorrecta
                return render_template('General/Login.html', error="Credenciales incorrectas")
        else:
            print("Usuario no encontrado")
            # Usuario no encontrado
            return render_template('General/Login.html', error="Usuario no encontrado")

# CERRAR SESIÓN
@app.route('/logout')
def cerrar_sesion():
    # session.pop('user_id',None)
    # session.pop('user_rol',None)
    session.clear()
    return url_for('login')
    
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

@app.route('/EditarPatro')
def Editar_P():
    return render_template('Patrocinador/EditarPerfil.html')
@app.route('/EditarEmp')
def Editar_E():
    return render_template('Emprendedor/EditarPerfil.html')


@app.route('/registro_usuario', methods=['POST'])
def registro_usuario():
    if request.method == 'POST':
        nombre = request.form['nombre']
        apellido = request.form['apellido']
        email = request.form['email']
        contraseña = request.form['contrasena']
        role = request.form['role']

        # Verificar que la contraseña no esté vacía
        if not contraseña:
            return "La contraseña no puede estar vacía", 400

        # Encriptar la contraseña antes de almacenarla en la base de datos
        contraseña_encriptada = generate_password_hash(str(contraseña))

        cur = db.cursor()
        cur.execute("INSERT INTO Usuarios (nombre, apellido, email, contraseña, role) VALUES (%s, %s, %s, %s, %s)",
                    (nombre, apellido, email, contraseña_encriptada, role))
        db.commit()
        cur.close()

        # Redirigir al login después del registro exitoso
        return redirect(url_for('login'))

    return render_template('Registro.html')




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


@app.route('/chati')
def chat():
    # La ruta para el archivo index.html del chat
  return render_template('chatsito.html')



@app.route('/registro_patrocinador', methods=['GET', 'POST'])
def registro_patrocinador():
    if request.method == 'POST':
        nombre = request.form['nombre-patrocinador']
        email = request.form['email']
        telefono = request.form['telefono']
        fecha_inicio = request.form['fecha-inicio']
        anos_mercado = request.form['anos-mercado']
        contraseña = request.form['password']
        contraseña_confirm = request.form['password-confirm']
        
        if contraseña != contraseña_confirm:
            return "Las contraseñas no coinciden", 400
        
        # Encriptar la contraseña antes de almacenarla
        contraseña_encriptada = generate_password_hash(contraseña)
        
        # Insertar datos en la base de datos
        cur = db.cursor()
        cur.execute("INSERT INTO Patrocinadores (nombre_empresa, email, telefono, fecha_inicio, anos_mercado, contraseña) VALUES (%s, %s, %s, %s, %s, %s)",
                    (nombre, email, telefono, fecha_inicio, anos_mercado, contraseña_encriptada))
        db.commit()
        cur.close()
        
        # Redirigir después del registro exitoso
        return redirect(url_for('IndexPatro'))  # Ajusta según tu ruta de inicio para patrocinadores
    
    return render_template('Patrocinador/RegistroPatr.html')




@app.route('/registro_emprendimiento', methods=['GET', 'POST'])
def registro_emprendimiento():
    if request.method == 'POST':
        nombre = request.form['nombre']
        descripcion = request.form['descripcion']
        categoria = request.form['categoria']
        fecha_inicio = request.form['fecha']
        miembros = request.form['miembros']
        nombre_miembros = request.form['nombre_miembros']
        logo = request.files['logo']
        email = request.form['email']
        contraseña = request.form['contrasena']
        contraseña_confirm = request.form['confirmar_contrasena']
        
        if contraseña != contraseña_confirm:
            return "Las contraseñas no coinciden", 400
        
        # Leer los datos binarios del logo y convertirlos a base64 si es necesario
        logo_data = base64.b64encode(logo.read()).decode('utf-8')
        
        # Encriptar la contraseña antes de almacenarla
        contraseña_encriptada = generate_password_hash(contraseña)
        
        # Insertar datos en la base de datos
        cur = db.cursor()
        cur.execute("INSERT INTO Emprendimientos (nombre, descripcion, categoria, fecha_inicio, miembros, nombre_miembros, logo, email, contraseña) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
                    (nombre, descripcion, categoria, fecha_inicio, miembros, nombre_miembros, logo_data, email, contraseña_encriptada))
        db.commit()
        cur.close()
        
        # Redirigir según el rol
        return redirect(url_for('IndexEmp'))  # Redirige a la página de emprendimiento
    
    return render_template('Emprendedor/RegistroEmp.html')




# @app.route('/registro_emprendimiento', methods=['GET', 'POST'])
# def registro_emprendimiento():
#     if request.method == 'POST':
#         nombre = request.form['nombre']
#         descripcion = request.form['descripcion']
#         categoria = request.form['categoria']
#         fecha_inicio = request.form['fecha']
#         miembros = request.form['miembros']
#         nombre_miembros = request.form['nombre_miembros']
#         logo = request.files['logo']
#         email = request.form['email']
#         contraseña = request.form['contrasena']
#         contraseña_confirm = request.form['confirmar_contrasena']
        
#         if contraseña != contraseña_confirm:
#             return "Las contraseñas no coinciden", 400
        
#         # Leer los datos binarios del logo y convertirlos a base64
#         logo_data = base64.b64encode(logo.read()).decode('utf-8')
        
#         contraseña_encriptada = generate_password_hash(contraseña)
        
#         cur = db.cursor()
#         cur.execute("INSERT INTO Emprendimientos (nombre, descripcion, categoria_id, fecha_inicio, miembros, nombre_miembros, logo, usuario_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
#                     (nombre, descripcion, categoria, fecha_inicio, miembros, nombre_miembros, logo_data,))
#         db.commit()
#         cur.close()
        
#         return redirect(url_for('index'))
    
#     return render_template('Emprendedor/RegistroEmp.html')


if __name__ == '__main__':
    app.add_url_rule('/', view_func=index)
    app.run(debug=True,port=5000)
