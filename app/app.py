
from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import mysql.connector
from werkzeug.security import generate_password_hash, check_password_hash
import base64
from functools import wraps
from datetime import datetime
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

#---------------------------------------------------------------#
@app.route('/iniciar_sesion', methods=['POST'])
def iniciar_sesion():
    if request.method == 'POST': 
        email = request.form.get('email')
        contraseña = request.form.get('contraseña')

        # Consulta a la base de datos para verificar el usuario
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
                
                # Verificar si el usuario es premium y establecer la sesión correspondiente
                if user['premium']:
                    session['premium_user'] = True
                else:
                    session['premium_user'] = False
                
                print(f"Usuario {user['id_usuario']} autenticado como {user['role']}")

                # Redirigir según el rol
                if session['user_rol'] == 'administrador':
                    print("Redirigiendo a IndexAd")
                    return redirect(url_for('IndexAd'))
                elif session['user_rol'] == 'emprendimiento':
                    print("Redirigiendo a IndexEmp")
                    id = session['user_id'] 
                    cur.execute("SELECT ReLleno FROM Emprendimientos WHERE usuario_id = %s", (id,))
                    form = cur.fetchone()
                    if form :
                        cur.execute("SELECT Aprobado FROM Emprendimientos WHERE usuario_id = %s", (id,))
                        form2 = cur.fetchone()
                        if form2:
                             return redirect(url_for('IndexEmp'))
                        else:
                            return render_template('Emprendedor/Espera.html')
                    else:
                        return redirect(url_for('registro_emprendimiento'))



                   
                elif session['user_rol'] == 'patrocinador':
                    print("Redirigiendo a IndexPatro")
                    id = session['user_id'] 
                    cur.execute("SELECT ReLleno FROM Patrocinadores WHERE usuario_id = %s", (id,))
                    form = cur.fetchone()
                    if form:
                        return redirect(url_for('IndexPatro'))
                    else:
                        return redirect(url_for('registro_patrocinador'))



                   
                else:
                    print("Rol desconocido")
                    return redirect(url_for('login'))
            else:
                print("Contraseña incorrecta")
                # Contraseña incorrecta
                return render_template('General/Login.html', error="Credenciales incorrectas")
        else:
            print("Usuario no encontrado")
            # Usuario no encontrado
            return render_template('General/Login.html', error="Usuario no encontrado")

#---------------------------------------------------------------#

# CERRAR SESIÓN
@app.route('/logout')
def cerrar_sesion():
    # session.pop('user_id',None)
    # session.pop('user_rol',None)
    session.clear()
    return redirect(url_for('login'))
    
@app.route('/form')
def form():
    return render_template('Emprendedor/Formulario.html')

@app.route('/AP')
def AprobarP():
    #if 'user_id' in session and session['user_rol'] == 'administrador':
    #    print("Estado de la sesión:", session) 
    return render_template('Administrador/AprobarP.html')
    
    #else:
    #    print("Condición de sesión no cumplida. user_id en sesión:", 'user_id' in session)
    #    print("Condición de sesión no cumplida. user_rol en sesión:", session.get('user_rol'))

    #return render_template('General/Error.html')

@app.route('/Editor')
def editor():
    if 'user_id' in session and session['user_rol'] in ['patrocinador', 'emprendimiento']:
        print("Estado de la sesión:", session)
        return render_template('Emprendedor/Editor.html')
    else:
        return redirect(url_for('login'))  # Redirige a la página de inicio de sesión si no cumple con las condiciones


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

#Edición de perfiles-------------------------------------------
@app.route('/EditarPatro', methods=['GET', 'POST'])
def Editar_P():
    if 'user_id' in session and session['user_rol'] == 'patrocinador':
        print("Estado de la sesión:", session)
        cursor = db.cursor() 

        if request.method == 'POST':
            Empresa = request.form.get("Nombre")
            Contacto = request.form.get("contacto")
            Telefono = request.form.get("telefono")
            Feregistro = request.form.get("registro")
            Feinicio = request.form.get("feinicio")
            anos = request.form.get("Años")
            logo = request.files['logo']
            foto = logo.read()

            if logo:
                cursor.execute(
                    """UPDATE Patrocinadores SET 
                        nombre_empresa = %s, 
                        persona_contacto = %s, 
                        telefono = %s, 
                        fecha_registro = %s, 
                        fecha_inicio = %s, 
                        anos_mercado = %s, 
                        logo = %s 
                    WHERE usuario_id = %s""",
                    (Empresa, Contacto, Telefono, Feregistro, Feinicio, anos, foto, session['user_id'])
                )
                 
            else:
                cursor.execute(
                    """UPDATE Patrocinadores SET 
                        nombre_empresa = %s, 
                        persona_contacto = %s, 
                        telefono = %s, 
                        fecha_registro = %s, 
                        fecha_inicio = %s, 
                        anos_mercado = %s 
                    WHERE usuario_id = %s""",
                    (Empresa, Contacto, Telefono, Feregistro, Feinicio, anos, session['user_id'])
                )
               
            db.commit()
            return redirect(url_for('Editar_P'))
        
        else:
            
            id = session['user_id']
            cursor.execute(
                """SELECT 
                    p.nombre_empresa, 
                    p.persona_contacto, 
                    p.telefono, 
                    p.fecha_registro, 
                    p.fecha_inicio, 
                    p.anos_mercado, 
                    p.logo, 
                    u.nombre, 
                    u.apellido, 
                    u.email  
                FROM Patrocinadores AS p 
                INNER JOIN Usuarios AS u 
                ON u.id_usuario = p.usuario_id 
                WHERE p.usuario_id = %s""",
                (id,)
            )
            data = cursor.fetchone()
            print(data[6])
            if data is not None:
                
                imagen = None
                if len(data) > 6 and data[6] is not None:
                    imagen = base64.b64encode(data[6]).decode('utf-8')

                return render_template("Patrocinador/EditarPerfil.html", usuario=data, logo=imagen)
            
            return render_template("Patrocinador/EditarPerfil.html")
        
    else:
        print("Condición de sesión no cumplida. user_id en sesión:", 'user_id' in session)
        print("Condición de sesión no cumplida. user_rol en sesión:", session.get('user_rol'))

        return render_template('General/Error.html')


@app.route('/Error')
def Errores():
    return render_template('General/Error.html')

@app.route('/EditarEmp') 
def Editar_E():
    if 'user_id' in session and session['user_rol'] == 'emprendimiento':
        print("Estado de la sesión:", session)
        cursor = db.cursor() 

        if request.method == 'POST':
            Empresa = request.form.get("Nombre")
            Contacto = request.form.get("Descripcion")
            Feinicio = request.form.get("feinicio")
            Nummiembros = request.form.get("miembros")
            nombres = request.form.get("nombre_miembros")
            logo = request.files['logo']
            foto = logo.read()

            if logo:
                cursor.execute(
                    """UPDATE Emprendimientos SET
                    nombre = %s, 
                    descripcion = %s , 
                    fecha_inicio = %s, 
                    miembros = %s, 
                    nombre_miembros = %s, 
                    logo = %s where usuario_id = %s""",
                    (Empresa, Contacto, Numiembros, Feinicio, nombres, foto, session['user_id'])
                )
                 
            else:
                cursor.execute(
                   """UPDATE Emprendimientos SET
                    nombre = %s, 
                    descripcion = %s , 
                    fecha_inicio = %s, 
                    miembros = %s, 
                    nombre_miembros = %s
                    where usuario_id = %s""",
                    (Empresa, Contacto, Numiembros, Feinicio, nombres, session['user_id'])
                )
               
            db.commit()
            return redirect(url_for('Editar_P'))
        
        else:
            
            id = session['user_id']
            cursor.execute(
                """SELECT 
                    e.nombre AS nombre_emprendimiento,
                    e.descripcion,
                    e.fecha_inicio AS fecha_inicio_emprendimiento,
                    e.miembros,
                    e.nombre_miembros,
                    e.logo,
                    u.nombre,
                    u.apellido,
                    u.email
                    FROM Emprendimientos AS e
                    INNER JOIN Usuarios AS u ON u.id_usuario = e.usuario_id
                    WHERE e.usuario_id = %s""",
                (id,)
            )
            data = cursor.fetchone()
            print(data[5])
            if data is not None:
                
                imagen = None
                if len(data) > 6 and data[5] is not None:
                    imagen = base64.b64encode(data[5]).decode('utf-8')

                return render_template("Emprendedor/EditarPerfil.html", usuario=data, logo=imagen)
   
            return render_template("Emprendedor/EditarPerfil.html")
        
        
    else:
        print("Condición de sesión no cumplida. user_id en sesión:", 'user_id' in session)
        print("Condición de sesión no cumplida. user_rol en sesión:", session.get('user_rol'))

        return render_template('General/Error.html')
    








@app.route('/EditarAd') 
def Editar_A():
    return render_template('Administrador/EditarPerfil.html')

#------------------------------------------------------------#
@app.route('/usuarios')
def lista_usuarios():
    cur = db.cursor(dictionary=True)
    cur.execute("SELECT * FROM Usuarios")
    usuarios = cur.fetchall()
    cur.close()
    return render_template('Administrador/lista_usuarios.html', usuarios=usuarios)

#---------------------------------------------------------------#

@app.route('/editar_usuario/<int:user_id>', methods=['GET', 'POST'])
def editar_usuario(user_id):
    cur = db.cursor(dictionary=True)
    if request.method == 'POST':
        nombre = request.form['nombre']
        apellido = request.form['apellido']
        email = request.form['email']
        role = request.form['role']
        
        cur.execute("UPDATE Usuarios SET nombre=%s, apellido=%s, email=%s, role=%s WHERE id_usuario=%s",
                    (nombre, apellido, email, role, user_id))
        db.commit()
        return redirect(url_for('lista_usuarios'))

        # Reordenar los IDs
    for index, user in enumerate(usuarios):
        new_id = index + 1
        cur.execute("UPDATE Usuarios SET id_usuario = %s WHERE id_usuario = %s", (new_id, user['id_usuario']))
    

    else:
        cur.execute("SELECT * FROM Usuarios WHERE id_usuario = %s", (user_id,))
        user = cur.fetchone()
        cur.close()
        return render_template('Administrador/editar_usuario.html', user=user)

#---------------------------------------------------------------#

@app.route('/eliminar_usuario/<int:user_id>')
def eliminar_usuario(user_id):
    cur = db.cursor()
    cur.execute("DELETE FROM Usuarios WHERE id_usuario = %s", (user_id,))
    db.commit()
    cur.close()
    return redirect(url_for('lista_usuarios'))

#---------------------------------------------------------------#

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

#---------------------------------------------------------------#


@app.route("/autocomplete")
def autocomplete():
    query = request.args.get("q", "")
    results = [item for item in suggestions_data if query.lower() in item.lower()]
    return jsonify(results)

@app.route('/aprobar_anuncio/<int:anuncio_id>')
def aprobar_anuncio(anuncio_id):
    #if 'user_id' in session and session['user_rol'] == 'patrocinador':
       #print("Estado de la sesión:", session)

    cur = db.cursor()
    cur.execute("UPDATE Anuncios SET aprobado = TRUE WHERE id_anuncio = %s", (anuncio_id,))
    db.commit()
    cur.close()
    return redirect(url_for('AprobarP'))

    #else:
      #  print("Condición de sesión no cumplida. user_id en sesión:", 'user_id' in session)
       # print("Condición de sesión no cumplida. user_rol en sesión:", session.get('user_rol'))

    #return render_template('General/Error.html')

#---------------------------------------------------------------#

# Asegúrate de tener las rutas IndexAd, IndexEmp e IndexPatro configuradas
@app.route('/IndexAd')
def IndexAd():
    return render_template('Administrador/IndexAd.html')

#---------------------------------------------------------------#

@app.route('/IndexEmp')
def IndexEmp():
    if 'user_id' in session and session['user_rol'] == 'emprendimiento':
        print("Estado de la sesión:", session)
        return render_template('Emprendedor/IndexEmp.html')
    else:
        print("Condición de sesión no cumplida. user_id en sesión:", 'user_id' in session)
        print("Condición de sesión no cumplida. user_rol en sesión:", session.get('user_rol'))

        return render_template('General/Error.html')
    
#---------------------------------------------------------------#

@app.route('/IndexPatro')
def IndexPatro():
    if 'user_id' in session and session['user_rol'] == 'patrocinador':
        print("Estado de la sesión:", session)
        return render_template('Patrocinador/IndexPatro.html')
    else:
        print("Condición de sesión no cumplida. user_id en sesión:", 'user_id' in session)
        print("Condición de sesión no cumplida. user_rol en sesión:", session.get('user_rol'))

        return render_template('General/Error.html')
    
#---------------------------------------------------------------#

@app.route('/Bot')
def Chat_bot():
     return render_template('General/chatbot.html')

#---------------------------------------------------------------#

@app.route('/chati')
def chat():
    # La ruta para el archivo index.html del chat
  return render_template('chatsito.html')

#---------------------------------------------------------------#

@app.route('/registro_patrocinador', methods=['GET', 'POST'])
def registro_patrocinador():
    if 'user_id' in session and session['user_rol'] == 'patrocinador':
        print("Estado de la sesión:", session)

        if request.method == 'POST':
            nombre = request.form['nombre_empresa']
            persona_contacto = request.form['persona_contacto']
            telefono = request.form['telefono']
            fecha_inicio = request.form['fecha_inicio']
            anos_mercado = request.form['anos_mercado']
        
            logo = request.files['logo']
            foto = base64.b64encode(logo.read()).decode('utf-8')
        
            usuario_id = session['user_id']
            fecha_registro = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

            ReLleno = True
            
            cursor = db.cursor()
            cursor.execute("INSERT INTO Patrocinadores (nombre_empresa, persona_contacto, telefono, fecha_registro, fecha_inicio, anos_mercado, logo, usuario_id, ReLleno) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
                        (nombre, persona_contacto, telefono, fecha_registro, fecha_inicio, anos_mercado, foto, usuario_id, ReLleno))
            db.commit()
            
                
            return redirect(url_for('IndexPatro'))
        else:
        
            return render_template('Patrocinador/RegistroPatr.html')
    else:
        print("Condición de sesión no cumplida. user_id en sesión:", 'user_id' in session)
        print("Condición de sesión no cumplida. user_rol en sesión:", session.get('user_rol'))

    return render_template('General/Error.html')
#---------------------------------------------------------------#

@app.route('/registro_emprendimiento', methods=['GET', 'POST'])
def registro_emprendimiento():
    if 'user_id' in session and session['user_rol'] == 'emprendimiento':
        print("Estado de la sesión:", session)
        cur = db.cursor()
        if request.method == 'POST':
            nombre = request.form['nombre']
            descripcion = request.form['descripcion']
            categoria = request.form['categoria']
            fecha_inicio = request.form['fecha']
            miembros = request.form['miembros']
            nombre_miembros = request.form['nombre_miembros']
            logo = request.files['logo']
            foto = logo.read()
           

            id = session['user_id']
            ReLleno = True
            
            
            cur.execute("INSERT INTO Emprendimientos (nombre, descripcion, categoria_id, usuario_id, fecha_inicio, miembros, nombre_miembros, logo, ReLleno) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
                        (nombre, descripcion, categoria ,id, fecha_inicio, miembros, nombre_miembros, foto, ReLleno))
            db.commit()
            cur.execute("SELECT Aprobado FROM Emprendimientos WHERE usuario_id = %s", (id,))
            form2 = cur.fetchone()
            if form2:
                return redirect(url_for('IndexEmp'))
            else:
                return render_template('Emprendedor/Espera.html')
           
           
        else:   
            return render_template('Emprendedor/RegistroEmp.html')

    else:
        print("Condición de sesión no cumplida. user_id en sesión:", 'user_id' in session)
        print("Condición de sesión no cumplida. user_rol en sesión:", session.get('user_rol'))

    return render_template('General/Error.html')
    

#---------------------------------------------------------------#


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

#---------------------------------------------------------------#
@app.route('/procesar_compra', methods=['POST'])
def procesar_compra():
    user_id = request.form.get('user_id')
    
    # Imprimir el ID del usuario para verificar que se recibe correctamente
    print(f"User ID: {user_id}")

    try:
        # Conexión y actualización en la base de datos
        cur = db.cursor()
        cur.execute("UPDATE Usuarios SET premium = %s WHERE id_usuario = %s", (1, user_id))  # Utilizar 1 en lugar de True
        db.commit()
        cur.close()

        # Verificar que la actualización fue exitosa
        cur = db.cursor(dictionary=True)
        cur.execute("SELECT premium FROM Usuarios WHERE id_usuario = %s", (user_id,))
        user = cur.fetchone()
        cur.close()

        if user['premium'] == 1:
            print("Usuario actualizado a premium correctamente")

        # Actualizar la sesión para reflejar el nuevo estado premium
        session['premium_user'] = True

        # Redirigir al usuario a la página de éxito o a su perfil
        return redirect(url_for('perfil'))  # Asegúrate de tener una ruta llamada 'perfil'

    except Exception as e:
        print(f"Error al actualizar el usuario: {e}")
        return redirect(url_for('login'))  # Redirigir a la página de inicio de sesión en caso de error


@app.route('/check_premium')
def check_premium():
    if session.get('premium_user'):
        return {'premium': True}
    else:
        return {'premium': False}

def premium_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('premium_user'):
            return redirect(url_for('Premium'))  # Redirige a la página de compra premium si no tiene acceso
        return f(*args, **kwargs)
    return decorated_function


@app.route('/perfil')
def perfil():
    if 'user_id' in session and session['user_rol'] == 'patrocinador,emprendimiento':
        cur = db.cursor(dictionary=True)
        cur.execute("SELECT * FROM Usuarios WHERE id_usuario = %s", (session['user_id'],))
        user = cur.fetchone()
        cur.close()
        if user:
            return render_template('Emprendimiento/IndexEmp.html', user=user)
        else:
            return "Usuario no encontrado"
    else:
        return redirect(url_for('login'))


if __name__ == '__main__':
    app.add_url_rule('/', view_func=index)
    app.run(debug=True,port=5000)
