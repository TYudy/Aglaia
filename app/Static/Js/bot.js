const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

function sendMessage() {
  const userMessage = userInput.value.trim();
  if (userMessage !== '') {
    displayMessage('user', userMessage);
    userInput.value = '';
    setTimeout(() => {
      const botResponse = getBotResponse(userMessage);
      displayMessage('bot', botResponse);
    }, 500); // Simula un tiempo de respuesta del bot
  }
}

function displayMessage(sender, message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add(`${sender}-message`);
  messageElement.textContent = message;
  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function getBotResponse(userMessage) {
  const lowercaseMessage = userMessage.toLowerCase();

  // Saludos
  if (lowercaseMessage.includes('hola')) {
    return '¡Hola! ¿En qué puedo ayudarte?';
  } else if (lowercaseMessage.includes('gracias')) {
    return '¡De nada! Estoy aquí para ayudarte.';
  } else if (lowercaseMessage.includes('adiós')) {
    return '¡Hasta luego! Que tengas un buen día.';
  } else if (lowercaseMessage.includes('buenos días')) {
    return '¡Buenos días! ¿Cómo estás?';
  } else if (lowercaseMessage.includes('buenas tardes')) {
    return '¡Buenas tardes! ¿En qué puedo asistirte?';
  } else if (lowercaseMessage.includes('buenas noches')) {
    return '¡Buenas noches! Espero que hayas tenido un buen día.';
  } else if (lowercaseMessage.includes('qué tal')) {
    return '¡Hola! Todo bien por aquí, ¿y tú?';
  } else if (lowercaseMessage.includes('cómo estás')) {
    return 'Estoy bien, gracias por preguntar. ¿En qué puedo ayudarte?';
  } else if (lowercaseMessage.includes('qué haces')) {
    return 'Estoy aquí para ayudarte con tus preguntas.';

  // Preguntas sobre el chatbot
  } else if (lowercaseMessage.includes('nombre')) {
    return 'Mi nombre es AglaBot. Soy un chatbot creado para ayudarte.';
  } else if (lowercaseMessage.includes('Que puedes hacer')) {
    return 'Soy un chatbot creado para responder preguntas y ayudarte con diferentes tareas.';
  } else if (lowercaseMessage.includes('funcionas')) {
    return 'Funciono mediante procesamiento de lenguaje natural y lógica programada.';
  } else if (lowercaseMessage.includes('creador')) {
    return 'Fui creado por un equipo de desarrolladores de inteligencia artificial.';
  } else if (lowercaseMessage.includes('propósito')) {
    return 'Mi propósito es asistir a los usuarios respondiendo sus preguntas y proporcionando información útil.';
  } else if (lowercaseMessage.includes('inteligencia artificial')) {
    return 'Sí, estoy basado en tecnología de inteligencia artificial.';
  } else if (lowercaseMessage.includes('entrenado')) {
    return 'Estoy entrenado con una amplia variedad de datos para responder tus preguntas.';

  // Preguntas sobre el clima
  } else if (lowercaseMessage.includes('Que es Aglaia')) {
    return 'Estaremos dispuestos a brindarte la mejor experiencia Crea tus anuncios con AGLAIA ADS Diseña, publica y distribuye anuncios personalizados para impulsar tu pequeño emprendimiento de manera fácil y económica. Nuestra plataforma ofrece plantillas prediseñadas que puedes personalizar con tu logo, colores y mensajes únicos. Con herramientas de edición intuitivas y previsualización en tiempo real, verás exactamente cómo quedará tu anuncio antes de publicarlo. Además, podrás distribuir tus anuncios a través de redes sociales, correo electrónico y medios locales, segmentando tu audiencia según ubicación, edad e intereses. Los análisis detallados del rendimiento te permitirán ajustar y mejorar tus campañas publicitarias para obtener los mejores resultados..';
  } else if (lowercaseMessage.includes('tiempo')) {
    return 'Lo siento, no tengo acceso a la información del tiempo en este momento.';
  } else if (lowercaseMessage.includes('lluvia')) {
    return 'No puedo prever el clima, pero puedo buscar información para ti si lo deseas.';
  } else if (lowercaseMessage.includes('temperatura')) {
    return 'No tengo datos sobre la temperatura actual, pero puedo ayudarte a buscarlo en línea.';
  } else if (lowercaseMessage.includes('sol')) {
    return 'No puedo decirte si hará sol, pero puedo buscar la información para ti.';
  } else if (lowercaseMessage.includes('nieve')) {
    return 'No tengo información sobre la nieve en este momento.';

  // Preguntas sobre noticias
  } else if (lowercaseMessage.includes('noticias')) {
    return 'Aquí tienes algunas noticias recientes: [insertar noticias relevantes]';
  } else if (lowercaseMessage.includes('últimas noticias')) {
    return 'Las últimas noticias son: [insertar noticias recientes]';
  } else if (lowercaseMessage.includes('noticia importante')) {
    return 'Una noticia importante reciente es: [insertar noticia importante]';
  } else if (lowercaseMessage.includes('actualidad')) {
    return 'Aquí tienes información de actualidad: [insertar noticias actuales]';
  } else if (lowercaseMessage.includes('titulares')) {
    return 'Estos son los titulares de hoy: [insertar titulares]';
  } else if (lowercaseMessage.includes('periódico')) {
    return 'Puedes encontrar las noticias más recientes en cualquier sitio de noticias confiable.';

  // Preguntas sobre deportes
  } else if (lowercaseMessage.includes('deportes')) {
    return 'Estos son los últimos resultados deportivos: [insertar resultados deportivos]';
  } else if (lowercaseMessage.includes('fútbol')) {
    return 'Los últimos resultados de fútbol son: [insertar resultados de fútbol]';
  } else if (lowercaseMessage.includes('baloncesto')) {
    return 'Aquí están los resultados recientes de baloncesto: [insertar resultados de baloncesto]';
  } else if (lowercaseMessage.includes('tenis')) {
    return 'Las últimas noticias de tenis son: [insertar noticias de tenis]';
  } else if (lowercaseMessage.includes('resultados deportivos')) {
    return 'Estos son los resultados más recientes en deportes: [insertar resultados]';
  } else if (lowercaseMessage.includes('partido de hoy')) {
    return 'Aquí tienes información sobre el partido de hoy: [insertar información del partido]';
  } else if (lowercaseMessage.includes('jugadores destacados')) {
    return 'Estos son algunos jugadores destacados: [insertar nombres de jugadores]';

  // Preguntas sobre entretenimiento
  } else if (lowercaseMessage.includes('películas') || lowercaseMessage.includes('series')) {
    return 'Algunas recomendaciones de entretenimiento: [insertar recomendaciones de películas y series]';
  } else if (lowercaseMessage.includes('cine')) {
    return 'Las películas más recientes en el cine son: [insertar lista de películas]';
  } else if (lowercaseMessage.includes('televisión')) {
    return 'Estos son algunos programas de televisión recomendados: [insertar recomendaciones de televisión]';
  } else if (lowercaseMessage.includes('música')) {
    return 'Aquí tienes algunas recomendaciones musicales: [insertar recomendaciones de música]';
  } else if (lowercaseMessage.includes('libros')) {
    return 'Te recomiendo estos libros: [insertar recomendaciones de libros]';
  } else if (lowercaseMessage.includes('teatro')) {
    return 'Aquí tienes algunas recomendaciones de teatro: [insertar recomendaciones de teatro]';
  } else if (lowercaseMessage.includes('arte')) {
    return 'Puedes disfrutar de estas exposiciones de arte: [insertar exposiciones]';

  // Preguntas generales
  } else if (lowercaseMessage.endsWith('?')) {
    return 'Disculpa, no puedo responder a esa pregunta. Todavía estoy aprendiendo.';
  } else if (lowercaseMessage.includes('cómo estás')) {
    return 'Estoy bien, gracias por preguntar. ¿En qué puedo ayudarte?';
  } else if (lowercaseMessage.includes('quién eres')) {
    return 'Soy un chatbot creado para asistirte con tus preguntas.';
  } else if (lowercaseMessage.includes('puedes ayudarme')) {
    return 'Claro, estoy aquí para ayudarte. ¿Qué necesitas saber?';
  } else if (lowercaseMessage.includes('dónde estás')) {
    return 'Estoy aquí mismo, en la pantalla de tu dispositivo.';

  // Si no se reconoce el mensaje
   } else {
    return 'Disculpa, no entendí tu mensaje. Puedes reformularlo, por favor.';
  }
}