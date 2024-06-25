var API_KEY = 'PIXABAY_API';
var GOOGLE_FONTS_API_KEY = 'GOOGLE_FONTS_API_KEY';

// for legacy browsers
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
var oldsrc, oldobj;
var oldtimelinepos;
var speed = 1;
var page = 1;
var checkstatus = false;
let db = new Localbase('db');
var wip = false;
var paused = true;
var currenttime = 0;
var timelinetime = 5;
const offset_left = 20;
var duration = 30000;
var keyframes = [];
var p_keyframes = [];
var props = [
  'left',
  'top',
  'scaleX',
  'scaleY',
  'width',
  'height',
  'angle',
  'opacity',
  'fill',
  'strokeWidth',
  'stroke',
  'shadow.color',
  'shadow.opacity',
  'shadow.offsetX',
  'shadow.offsetY',
  'shadow.blur',
  'charSpacing',
  'lineHeight',
];
var objects = [];
var o_slider, o_letter_slider, o_line_slider;
var colormode = 'fill';
var spaceDown = false;
var selectedkeyframe;
var undo = [];
var undoarr = [];
var redo = [];
var groups = [];
var redoarr = [];
var state;
var statearr = [];
var recording = false;
var canvasrecord;
var clipboard;
var focus = false;
var editingpanel = false;
var files = [];
var re = /(?:\.([^.]+))?$/;
var filelist = [];
var timeout;
var spacehold = false;
var spacerelease = false;
var tempselection;
var line_h, line_v;
var tempgroup = [];
var editinggroup = false;
var tempgroupid;
var fontPicker;
var fonts = [];
var seeking = false;
var setting = false;
var handtool = false;
var canvasx = 0;
var canvasy = 0;
var overCanvas = false;
var draggingPanel = false;
var cropping = false;
var cropobj;
var cropscalex;
var cropscaley;
var croptop;
var cropleft;
var layer_count = 1;
var lockmovement = false;
var shiftx = 0;
var shifty = 0;
var editinglayer = false;
var editingproject = false;
var shiftkeys = [];
var shiftdown = false;
var cliptype = 'object';
var chromaslider, noiseslider, blurslider;
var isChrome =
  window.chrome && Object.values(window.chrome).length !== 0;
var eyeDropper;
if (isChrome) {
  eyeDropper = new EyeDropper();
}
var presets = [
  {
    name: 'Tiro de regate',
    id: 'dribbble',
    width: 1600,
    height: 1200,
  },
  { name: 'Publicación de Facebook', id: 'facebook', width: 1280, height: 720 },
  {
    name: 'Anuncio de Facebook',
    id: 'facebook-ad',
    width: 1080,
    height: 1080,
  },
  { name: 'Video de YouTube', id: 'youtube', width: 1920, height: 1080 },
  {
    name: 'Vídeo de Instagram',
    id: 'instagram-id',
    width: 1080,
    height: 1920,
  },
  {
    name: 'Historias de Instagram',
    id: 'instagram-stories',
    width: 1080,
    height: 1920,
  },
  { name: 'Vídeo de Twitter', id: 'twitter', width: 1280, height: 720 },
  { name: 'Anuncio de Snapchat', id: 'snapchat', width: 1080, height: 1920 },
  {
    name: 'Vídeo de LinkedIn',
    id: 'linkedin',
    width: 1920,
    height: 1080,
  },
  {
    name: 'Miniatura de búsqueda de productos',
    id: 'product-hunt',
    width: 600,
    height: 600,
  },
  {
    name: 'Anuncio de Pinterest',
    id: 'pinterest',
    width: 1080,
    height: 1920,
  },
];
var activepreset = 'custom';
var uploaded_images = [];
var uploaded_videos = [];
var uploading = false;
var background_audio = false;
var temp_audio = false;
var background_key;
var sliders = [];
var hovertime = 0;
var animatedtext = [];

// Get list of fonts
$.ajax({
  url:
    'https://www.googleapis.com/webfonts/v1/webfonts?key=' +
    GOOGLE_FONTS_API_KEY +
    '&sort=alpha',
  type: 'GET',
  dataType: 'json', // added data type
  success: function (response) {
    response.items.forEach(function (item) {
      fonts.push(item.family);
    });
  },
});

// Panel variants
const canvas_panel =
  '<div id="canvas-properties" class="panel-section"><p class="property-title">Configuración del lienzo</p><table><tr><th class="name-col">Predeter</th><th class="value-col"><select id="preset"></select></th></tr><tr><th class="name-col">Tamaño</th><th class="value-col"><div id="canvas-w" class="property-input" data-label="W"><input type="number" min=1 value=1000></div><div id="canvas-h" class="property-input" data-label="H"><input type="number" value=1000 min=1></div></th></tr><tr><th class="name-col">Color</th><th class="value-col"><div id="canvas-color" class="object-color"><div id="color-side" class="color-picker"></div><input value="#FFFFFF" disabled="disabled"></div><div id="canvas-color-opacity" class="property-input" data-label="%"><input type="number" value=100></div></th></tr><tr><th class="name-col">Duración</th><th class="value-col" id="duration-cell"><div id="canvas-duration" class="property-input" data-label="s"><input type="number" value=15.00></div></th></tr></table></div>';
const object_panel =
  '<div id="layout-properties" class="panel-section"><p class="property-title">Layout</p><table><tr><th class="name-col">Posición</th><th class="value-col"><div id="object-x" class="property-input" data-label="X"><input type="number" value=1000></div><div id="object-y" class="property-input" data-label="Y"><input value=1000 type="number"></div></th></tr><tr><th class="name-col">Tamaño</th><th class="value-col"><div id="object-w" class="property-input" data-label="W"><input type="number" min=1 value=1000></div><div id="object-h" class="property-input" data-label="H"><input type="number" value=1000 min=1></div></th></tr><tr><th class="name-col">Rotation</th><th class="value-col" id="duration-cell"><div id="object-r" class="property-input" data-label="&#176;"><input type="number" min=0 max=360 value=0></div></th></tr></table></div>';
const back_panel =
  '<hr><div id="back-properties" class="panel-section"><p class="property-title">Layer</p><table><tr><th class="name-col">Opacity</th><th class="value-col"><div id="select-opacity"></div><div id="object-o" class="property-input" data-label="%"><input type="number" value=100></div></th></tr><tr><th class="name-col">Mask</th><th class="value-col"><select id="masks"><option value="none">None</option></select></th></tr></table></div>';
const image_panel =
  '<hr><div id="back-properties" class="panel-section"><p class="property-title">Layer</p><table><tr><th class="name-col">Opacity</th><th class="value-col"><div id="select-opacity"></div><div id="object-o" class="property-input" data-label="%"><input type="number" value=100></div></th></tr><tr><th class="name-col">Mask</th><th class="value-col"><select id="masks"><option value="none">None</option></select></th></tr></table></div>';
const selection_panel =
  '<hr><div id="back-properties" class="panel-section"><p class="property-title">Layer</p><table><tr><th class="name-col">Opacity</th><th class="value-col"><div id="select-opacity"></div><div id="object-o" class="property-input" data-label="%"><input type="number" value=100></div></th></tr><tr><th class="name-col">Group</th><th class="value-col"><div id="group-objects">Group selection</div></th></tr></table></div>';
const group_panel =
  '<hr><div id="back-properties" class="panel-section"><p class="property-title">Layer</p><table><tr><th class="name-col">Opacity</th><th class="value-col"><div id="select-opacity"></div><div id="object-o" class="property-input" data-label="%"><input type="number" value=100></div></th></tr><tr><th class="name-col">Mask</th><th class="value-col"><select id="masks"><option value="none">None</option></select></th></tr><tr><th class="name-col">Group</th><th class="value-col"><div id="ungroup-objects">Ungroup selection</div></th></tr></table></div>';
const other_panel =
  '<hr><div id="back-properties" class="panel-section"><p class="property-title">Layer</p><table><tr><th class="name-col">Opacity</th><th class="value-col"><div id="select-opacity"></div><div id="object-o" class="property-input" data-label="%"><input type="number" value=100></div></th></tr><tr><th class="name-col">Mask</th><th class="value-col"><select id="masks"><option value="none">None</option></select></th></tr></table></div>';
const shape_panel =
  '<hr><div id="back-properties" class="panel-section"><p class="property-title">Rectangle</p><table><tr><th class="name-col">Color</th><th class="value-col"><div id="object-color-fill" class="object-color"><div id="color-fill-side" class="color-picker"></div><input value="#FFFFFF" disabled="disabled"></div><div id="object-color-fill-opacity" class="property-input" data-label="%"><input type="number" value=100></div></th></tr><tr><th class="name-col">Radius</th><th class="value-col" id="duration-cell"><div id="object-corners" class="property-input" data-label="px"><input type="number" value=0 min=0></div></th></tr></table></div>';
const path_panel =
  '<hr><div id="back-properties" class="panel-section"><p class="property-title">Shape</p><table><tr><th class="name-col">Color</th><th class="value-col"><div id="object-color-fill" class="object-color"><div id="color-fill-side" class="color-picker"></div><input value="#FFFFFF" disabled="disabled"></div><div id="object-color-fill-opacity" class="property-input" data-label="%"><input type="number" value=100></div></th></tr></table></div>';
const text_panel =
  '<hr><div id="back-properties" class="panel-section"><p class="property-title">Texto</p><table><tr><th class="name-col">Font</th><th class="value-col"><select id="font-picker"></select></th></tr><tr><th class="name-col">Align</th><th class="value-col"><div class="align-text" id="align-text-left"><img src="../../static/img/Editor/align-text-left.svg"></div><div class="align-text" id="align-text-center"><img src="../../static/img/Editor/align-text-center.svg"></div><div class="align-text" id="align-text-right"><img src="../../static/img/Editor/align-text-right.svg"></div><div class="align-text" id="align-text-justify"><img src="../../static/img/Editor/align-text-justify.svg"></div></th></tr><tr><th class="name-col">Format</th><th class="value-col"><div class="format-text" id="format-bold"><img src="../../static/img/Editor/bold.svg"></div><div class="format-text" id="format-italic"><img src="../../static/img/Editor/italic.svg"></div><div class="format-text" id="format-underline"><img src="../../static/img/Editor/underline.svg"></div><div class="format-text" id="format-strike"><img src="../../static/img/Editor/strike.svg"></div></th></tr><tr><th class="name-col">Color</th><th class="value-col"><div id="object-color-fill" class="object-color"><div id="color-fill-side" class="color-picker"></div><input value="#FFFFFF" disabled="disabled"></div><div id="object-color-fill-opacity" class="property-input" data-label="%"><input type="number" value=100></div></th></tr><tr><th class="name-col">Letter</th><th class="value-col"><div id="select-letter"></div><div id="text-h" class="property-input" data-label="%"><input type="number" value=1></div></th></tr><tr><th class="name-col">Line</th><th class="value-col"><div id="select-line"></div><div id="text-v" class="property-input" data-label="%"><input type="number" value=1></div></th></tr></table></div>';
const stroke_panel =
  '<hr><div id="back-properties" class="panel-section"><p class="property-title">Stroke</p><table><tr><th class="name-col">Type</th><th class="value-col left-col"><div class="line-join" id="miter"><img src="../../static/img/Editor/miter.svg"></div><div class="line-join" id="bevel"><img src="../../static/img/Editor/bevel.svg"></div><div class="line-join" id="round"><img src="../../static/img/Editor/round.svg"></div><div class="line-join" id="small-dash"><img src="../../static/img/Editor/dash2.svg"></div></th></tr><tr><th class="name-col">Color</th><th class="value-col"><div id="object-color-stroke" class="object-color"><div id="color-stroke-side" class="color-picker"></div><input value="#FFFFFF" disabled="disabled"></div><div id="object-color-stroke-opacity" class="property-input" data-label="%"><input type="number" value=100></div></th></tr><tr><th class="name-col">Width</th><th class="value-col" id="duration-cell"><div id="object-stroke" class="property-input" data-label="px"><input type="number" min=0 value=0></div></th></tr></table></div>';
const shadow_panel =
  '<hr><div id="back-properties" class="panel-section"><p class="property-title">Shadow</p><table><tr><th class="name-col">Offset</th><th class="value-col"><div id="object-shadow-x" class="property-input" data-label="X"><input type="number" value=0></div><div id="object-shadow-y" class="property-input" data-label="Y"><input value=0 type="number"></div></th></tr><tr><th class="name-col">Color</th><th class="value-col"><div id="object-color-shadow" class="object-color"><div id="color-shadow-side" class="color-picker"></div><input value="#FFFFFF" disabled="disabled"></div><div id="object-color-shadow-opacity" class="property-input" data-label="%"><input type="number" value=100></div></th></tr><tr><th class="name-col">Blur</th><th class="value-col" id="duration-cell"><div id="object-blur" class="property-input" data-label="px"><input type="number" value=0 min=0></div></th></tr></table></div>';
const image_more_panel =
  '<hr><div id="back-properties" class="panel-section"><p class="property-title">Image</p><div id="image-buttons"><div id="filters-button"><img src="../../static/img/Editor/filters.svg"> Edit filters</div><div id="crop-image"><img src= "../../static/img/Editor/crop-icon.svg">Crop image</div></div></div></hr>';
const video_more_panel =
  '<hr><div id="back-properties" class="panel-section"><p class="property-title">Video</p><div id="image-buttons"><div id="filters-button" class="filters-video"><img src="../../static/img/Editor/filters.svg"> Edit filters</div></div></div></hr>';
const animated_text_panel =
  '<hr><div id="back-properties" class="panel-section"><p class="property-title">Texto</p><table><tr><th class="name-col">Content</th><th class="value-col" id="duration-cell"><div id="animated-text" class="property-input" data-label=""><input id="animatedinput" type="text" value="text"><div id="animatedset">Set</div></div></th></tr><tr><th class="name-col">Font</th><th class="value-col"><select id="font-picker"></select></th></tr><tr><th class="name-col">Color</th><th class="value-col"><div id="text-color" class="object-color"><div id="color-text-side" class="color-picker"></div><input value="#FFFFFF" disabled="disabled"></div><div id="color-text-opacity" class="property-input" data-label="%"><input type="number" value=100></div></th></tr></table></div>';
const start_animation_panel =
  '<hr><div id="back-properties" class="panel-section"><p class="property-title">Start animation</p><table><tr><th class="name-col">Preset</th><th class="value-col"><select id="preset-picker"></select></th></tr><tr><th class="name-col">Easing</th><th class="value-col"><select id="easing-picker"><option value="linear">Linear</option><option value="easeInQuad">Ease in</option><option value="easeOutQuad">Ease out</option><option value="easeinOutQuad">Ease in-out</option><option value="easeOutInQuad">Ease out-in</option><option value="easeInBounce">Ease in bounce</option><option value="easeOutBounce">Ease out bounce</option><option value="easeinOutBounce">Ease in-out bounce</option><option value="easeOutInBouce">Ease out-in bounce</option><option value="easeOutInBouce">Ease out-in bounce</option><option value="easeInSine">Ease in sine</option><option value="easeOutSine">Ease out sine</option><option value="easeinOutSine">Ease in-out sine</option><option value="easeOutInSine">Ease out-in sine</option><option value="easeOutInSine">Ease out-in sine</option><option value="easeInCubic">Ease in cubic</option><option value="easeOutCubic">Ease out cubic</option><option value="easeinOutCubic">Ease in-out cubic</option><option value="easeOutInCubic">Ease out-in cubic</option><option value="easeOutInCubic">Ease out-in cubic</option></select></th></tr><tr><th class="name-col">Order</th><th class="value-col"><div id="order-toggle"><div id="order-backward" class="order-toggle-item">Backward</div><div id="order-forward" class="order-toggle-item order-toggle-item-active">Forward</div></div></th></tr><tr><th class="name-col">Order</th><th class="value-col"><div id="order-toggle"><div id="type-letters" class="order-toggle-item-2">Letters</div><div id="type-words" class="order-toggle-item-2 order-toggle-item-active-2">Words</div></div></th></tr><tr><th class="name-col">Duration</th><th class="value-col" id="duration-cell"><div id="animated-text-duration" class="property-input" data-label="s"><input id="durationinput" type="number" value="0"></div></th></tr></table></div>';
const audio_panel =
  '<div id="layout-properties" class="panel-section"><p class="property-title">Audio</p><table><tr><th class="name-col">Volume</th><th class="value-col" id="duration-cell"><div id="object-volume" class="property-input" data-label="%"><input type="number" value=0></div></th></tr></table></div>';

// Browser variants
const shape_browser =
  '<div id="search-fixed"><p class="property-title">Objetos</p><img id="collapse" src="../../static/img/Editor/collapse.svg"><div id="browser-search"><input placeholder="Buscar..."><img src="../../static/img/Editor/search.svg" id="search-icon"><img src="../../static/img/Editor/delete.svg" id="delete-search"><div id="search-button">Ir</div></div></div><div id="shapes-cont"><p class="row-title">Formas</p><div class="gallery-row" id="shapes-row"></div><p class="row-title">Emojis</p><div class="gallery-row" id="emojis-row"></div></div>';
const image_browser =
  '<div id="search-fixed"><p class="property-title">Imágenes</p><img id="collapse" src="../../static/img/Editor/collapse.svg"><div id="browser-search"><input placeholder="Buscar..."><a href="https://pixabay.com" target="_blank" id="pixabay"><img src="../../static/img/Editor/pixabay.svg"></a><img src="../../static/img/Editor/search.svg" id="search-icon"><img src="../../static/img/Editor/delete.svg" id="delete-search"><div id="search-button">Ir</div></div></div><div id="shapes-cont"><div id="landing"><div id="landing-text">Explora millones de imágenes de alta calidad de Pixabay. Utilice la barra de búsqueda de arriba o elija entre las categorías populares a continuación.</div><div id="categories"></div></div><div id="images-grid"></div></div>';
const text_browser =
  '<div id="search-fixed"><p class="property-title">Texto</p><img id="collapse" src="../../static/img/Editor/collapse.svg"><div id="browser-search"><input placeholder="Buscar..."><img src="../../static/img/Editor/search.svg" id="search-icon"><img src="../../static/img/Editor/delete.svg" id="delete-search"><div id="search-button">Ir</div></div></div><div id="shapes-cont"><p class="row-title">Texto Básico</p><div id="heading-text" data-font="Inter" class="add-text noselect">Agregar encabezado</div><div id="subheading-text" data-font="Inter" class="add-text noselect">Añadir un subtítulo</div><div id="body-text" data-font="Inter" class="add-text noselect">Agregar texto al cuerpo</div></div>';
const video_browser =
  '<div id="search-fixed"><p class="property-title">Videos</p><img id="collapse" src="../../static/img/Editor/collapse.svg"><div id="browser-search"><input placeholder="Buscar..."><a href="https://pixabay.com" target="_blank" id="pixabay"><img src="../../static/img/Editor/pixabay.svg"></a><img src="../assets/search.svg" id="search-icon"><img src="../../static/img/Editor/search.svg" id="delete-search"><div id="search-button">Ir</div></div></div><div id="shapes-cont"><div id="landing"><div id="landing-text">Explora millones de imágenes de alta calidad de Pixabay. Utilice la barra de búsqueda de arriba o elija entre las categorías populares a continuación.</div><div id="categories"></div></div><div id="images-grid"></div></div>';
const upload_browser =
  '<div id="search-fixed"><p class="property-title">Subidas</p><div id="upload-button"><img src="../../static/img/Editor/upload.svg"> Subir medios</div><img id="collapse" src="../../static/img/Editor/collapse.svg"><div id="upload-tabs"><div id="images-tab" class="upload-tab upload-tab-active">Imágenes</div><div id="videos-tab" class="upload-tab">Videos</div></div></div><div id="images-grid"></div>';
const audio_browser =
  '<div id="search-fixed" class="audio-browser"><p class="property-title">Audio</p><div id="audio-upload-button"><img src="../../static/img/Editor/upload.svg"> Subir audio</div><img id="collapse" src="../../static/img/Editor/collapse.svg"></div><div id="audio-list-parent"><div id="landing-text" class="audio-landing-text">Audio proporcionado por Pixabay. Explora millones de activos de Pixabay por <a href="https://pixabay.com/music/" target="_blank">haciendo clic aquí.</a></div><div id="audio-list"></div></div>';

// Text animation list
var text_animation_list = [
  { name: 'fade in', label: 'Fade in', src: '../../static/img/Editor/fade-in.svg' },
  {
    name: 'typewriter',
    label: 'Typewriter',
    src: '../../static/img/Editor/typewriter.svg',
  },
  {
    name: 'slide top',
    label: 'Slide top',
    src: '../../static/img/Editor/slide-top.svg',
  },
  {
    name: 'slide bottom',
    label: 'Slide bottom',
    src: '../../static/img/Editor/slide-bottom.svg',
  },
  {
    name: 'slide left', 
    label: 'Slide left',
    src: '../../static/img/Editor/slide-left.svg',
  },
  {
    name: 'slide right',
    label: 'Slide right',
    src: '../../static/img/Editor/slide-right.svg',
  },
  { name: 'scale', label: 'Scale', src: '../../static/img/Editor/scale.svg' },
  { name: 'shrink', label: 'Shrink', src: '../../static/img/Editor/shrink.svg' },
];

// Shapes list
var shape_grid_items = [
  '../../static/img/Editor/shapes/rectangle.svg',
  '../../static/img/Editor/shapes/circle.svg',
  '../../static/img/Editor/shapes/triangle.svg',
  '../../static/img/Editor/shapes/polygon.svg',
  '../../static/img/Editor/shapes/star.svg',
  '../../static/img/Editor/shapes/thingy.svg',,
  '../../static/img/Editor/shapes/heart.svg',
  '../../static/img/Editor/shapes/arrow.svg',
];
var emoji_items = [
'../../static/img/Editor/twemojis/bomb-emoji.png',
'../../static/img/Editor/twemojis/cat-face-emoji.png',
'../../static/img/Editor/twemojis/clap-emoji.png',
'../../static/img/Editor/twemojis/clock-emoji.png',
'../../static/img/Editor/twemojis/construction-emoji.png',
'../../static/img/Editor/twemojis/crying-emoji.png',
'../../static/img/Editor/twemojis/dog-face-emoji.png',
'../../static/img/Editor/twemojis/eyes-emoji.png',
'../../static/img/Editor/twemojis/fire-emoji.png',
'../../static/img/Editor/twemojis/gem-emoji.png',
'../../static/img/Editor/twemojis/ghost-emoji.png',
'../../static/img/Editor/twemojis/gift-emoji.png',
'../../static/img/Editor/twemojis/graph-emoji.png',
'../../static/img/Editor/twemojis/heart-eyes-emoji.png',
'../../static/img/Editor/twemojis/heart-kiss-emoji.png',
'../../static/img/Editor/twemojis/hundred-100-points-emoji.png',
'../../static/img/Editor/twemojis/laughing-emoji.png',
'../../static/img/Editor/twemojis/mindblown-emoji.png',
'../../static/img/Editor/twemojis/money-emoji.png',
'../../static/img/Editor/twemojis/moon-emoji.png',
'../../static/img/Editor/twemojis/nail-polish-emoji.png',
'../../static/img/Editor/twemojis/party-popper-emoji.png',
'../../static/img/Editor/twemojis/pencil-emoji.png',
'../../static/img/Editor/twemojis/pizza-emoji.png',
'../../static/img/Editor/twemojis/plane-emoji.png',
'../../static/img/Editor/twemojis/pleading-face-emoji.png',
'../../static/img/Editor/twemojis/point-emoji.png',
'../../static/img/Editor/twemojis/praying-hands-emoji.png',
'../../static/img/Editor/twemojis/raising-hands-emoji.png',
'../../static/img/Editor/twemojis/rocket-emoji.png',
'../../static/img/Editor/twemojis/rose-emoji.png',
'../../static/img/Editor/twemojis/skull-emoji.png',
'../../static/img/Editor/twemojis/smiling-emoji.png',
'../../static/img/Editor/twemojis/sparkles-emoji.png',
'../../static/img/Editor/twemojis/star-emoji.png',
'../../static/img/Editor/twemojis/sun-emoji.png',
'../../static/img/Editor/twemojis/sunglasses-cool-emoji.png',
'../../static/img/Editor/twemojis/surprised-emoji.png',
'../../static/img/Editor/twemojis/target-emoji.png',
'../../static/img/Editor/twemojis/thinking-face-emoji.png',
'../../static/img/Editor/twemojis/thought-balloon-emoji.png',
'../../static/img/Editor/twemojis/thumbs-up-emoji.png',
'../../static/img/Editor/twemojis/tongue-emoji.png',
'../../static/img/Editor/twemojis/trophy-emoji.png',
'../../static/img/Editor/twemojis/tulip-emoji.png',
'../../static/img/Editor/twemojis/wave-emoji.png',
'../../static/img/Editor/twemojis/winking-face-emoji.png',
'../../static/img/Editor/twemojis/wip-emoji.png'

];

// Image list
var image_grid_items = [
  'https://images.unsplash.com/photo-1609153259378-a8b23c766aec?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1866&q=80',
  'https://images.unsplash.com/photo-1614435082296-ef0cbdb16b70?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=934&q=80',
  'https://images.unsplash.com/photo-1614432254115-7e756705e910?ixid=MXwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60',
  'https://images.unsplash.com/photo-1614423234685-544477464e15?ixid=MXwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60',
  'https://images.unsplash.com/photo-1614357235247-99fabbee67f9?ixid=MXwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxNHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60',
  'https://images.unsplash.com/photo-1614373371549-c7d2e4885f17?ixid=MXwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxOXx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=60',
];
var image_categories = [
  { name: 'Fondo', image: '../../static/img/Editor/background.png'},
  { name: 'Fondo de pantalla', image: '../../static/img/Editor/wallpaper.png' },
  { name: 'Naturaleza', image: '../../static/img/Editor/nature.png' },
  { name: 'Verano', image: '../../static/img/Editor/summer.png'},
  { name: 'Playa', image: '../../static/img/Editor/beach.png'},
  { name: 'Espacio', image: '../../static/img/Editor/space.png'},
  { name: 'Oficina', image: '../../static/img/Editor/office.png' },
  { name: 'Comida', image: '../../static/img/Editor/food.png' },
];

// Video list
var video_categories = [
  { name: 'Lluvia', image: '../../static/img/Editor/rain.png' },
  { name: 'Carros', image: '../../static/img/Editor/cars.png' },
  { name: 'Meditación', image: '../../static/img/Editor/meditation.png' },
  { name: 'Bosque', image: '../../static/img/Editor/forest.png' },
  { name: 'Animales', image: '../../static/img/Editor/animals.png' },
  { name: 'Calle', image: '../../static/img/Editor/street.png' },
  { name: 'Viaje', image: '../../static/img/Editor/travel.png' },
  { name: 'Trabajo', image: '../../static/img/Editor/work.png'},
];

// Audio list
var audio_items = [
  {
    name: 'Lofi Study',
    desc: 'FASSounds',
    duration: '2:27',
    thumb: '../../static/img/Editor/audio/lofi-thumb.png',
    src: '../../static/img/Editor/audio/lofi.mp3',
    link: 'https://pixabay.com/users/fassounds-3433550/',
  },
  {
    name: 'Stomping Rock (Four Shots)',
    desc: 'AlexGrohl',
    duration: '1:59',
    thumb: '../../static/img/Editor/audio/stomping-rock-thumb.png',
    src: '../../static/img/Editor/audio/stomping-rock.mp3',
    link: 'https://pixabay.com/users/alexgrohl-25289918/',
  },
  {
    name: 'Everything Feels New',
    desc: 'EvgenyBardyuzha',
    duration: '1:06',
    thumb: '../../static/img/Editor/audio/everything-feels-new-thumb.png',
    src: '../../static/img/Editor/audio/everything-feels-new.mp3',
    link: 'https://pixabay.com/users/evgenybardyuzha-25235210/',
  },
  {
    name: 'Both of Us',
    desc: 'madiRFAN',
    duration: '2:48',
    thumb: '../../static/img/Editor/audio/both-of-us-thumb.png',
    src: '../../static/img/Editor/audio/both-of-us.mp3',
    link: 'https://pixabay.com/users/madirfan-50411/',
  },
  {
    name: 'The Podcast Intro',
    desc: 'Music Unlimited',
    duration: '1:51',
    thumb: '../../static/img/Editor/audio/the-podcast-intro-thumb.png',
    src: '../../static/img/Editor/audio/the-podcast-intro.mp3',
    link: 'https://pixabay.com/users/music_unlimited-27600023/',
  },
  {
    name: 'Epic Cinematic Trailer',
    desc: 'PavelYudin',
    duration: '2:27',
    thumb: '../../static/img/Editor/audio/epic-cinematic-trailer-thumb.png',
    src: '../../static/img/Editor/audio/epic-cinematic-trailer.mp3',
    link: 'https://pixabay.com/users/pavelyudin-27739282/',
  },
  {
    name: 'Inspirational Background',
    desc: 'AudioCoffee',
    duration: '2:19',
    thumb: '../../static/img/Editor/audio/inspirational-background-thumb.png',
    src: '../../static/img/Editor/audio/inspirational-background.mp3',
    link: 'https://pixabay.com/users/audiocoffee-27005420/',
  },
  {
    name: 'Tropical Summer Music',
    desc: 'Music Unlimited',
    duration: '2:35',
    thumb: '../../static/img/Editor/audio/tropical-summer-music-thumb.png',
    src: '../../static/img/Editor/audio/tropical-summer-music.mp3',
    link: 'https://pixabay.com/users/music_unlimited-27600023/',
  },
];

// Text list
var text_items = {
  sansserif: [
    { name: 'Roboto', fontname: 'Roboto' },
    { name: 'Montserrat', fontname: 'Montserrat' },
    { name: 'Poppins', fontname: 'Poppins' },
  ],
  serif: [
    { name: 'Playfair Display', fontname: 'Playfair Display' },
    { name: 'Merriweather', fontname: 'Merriweather' },
    { name: 'IBM Plex Serif', fontname: 'IBM Plex Serif' },
  ],
  monospace: [
    { name: 'Roboto Mono', fontname: 'Roboto Mono' },
    { name: 'Inconsolata', fontname: 'Inconsolata' },
    { name: 'Source Code Pro', fontname: 'Source Code Pro' },
  ],
  handwriting: [
    { name: 'Dancing Script', fontname: 'Dancing Script' },
    { name: 'Pacifico', fontname: 'Pacifico' },
    { name: 'Indie Flower', fontname: 'Indie Flower' },
  ],
  display: [
    { name: 'Lobster', fontname: 'Lobster' },
    { name: 'Bebas Neue', fontname: 'Bebas Neue' },
    { name: 'Titan One', fontname: 'Titan One' },
  ],
};

WebFont.load({
  google: {
    families: ['Syne'],
  },
  active: () => {},
});

var webglBackend;
try {
  webglBackend = new fabric.WebglFilterBackend();
} catch (e) {
  console.log(e);
}
var canvas2dBackend = new fabric.Canvas2dFilterBackend();

fabric.filterBackend = fabric.initFilterBackend();
fabric.filterBackend = webglBackend;

// Lottie support
fabric.Lottie = fabric.util.createClass(fabric.Image, {
  type: 'lottie',
  lockRotation: true,
  lockSkewingX: true,
  lockSkewingY: true,
  srcFromAttribute: false,

  initialize: function (path, options) {
    if (!options.width) options.width = 480;
    if (!options.height) options.height = 480;

    this.path = path;
    this.tmpCanvasEl = fabric.util.createCanvasElement();
    this.tmpCanvasEl.width = options.width;
    this.tmpCanvasEl.height = options.height;

    this.lottieItem = bodymovin.loadAnimation({
      renderer: 'canvas',
      loop: false,
      autoplay: false,
      path: path,
      rendererSettings: {
        context: this.tmpCanvasEl.getContext('2d'),
        preserveAspectRatio: 'xMidYMid meet',
      },
    });

    this.lottieItem.addEventListener('enterFrame', (e) => {
      this.canvas.requestRenderAll();
    });

    this.lottieItem.addEventListener('DOMLoaded', () => {
      this.lottieItem.goToAndStop(currenttime, false);
      this.lottieItem.duration =
        this.lottieItem.getDuration(false) * 1000;
      this.canvas.requestRenderAll();
      canvas.renderAll();
      canvas.fire('lottie:loaded', { any: 'payload' });
    });

    this.callSuper('initialize', this.tmpCanvasEl, options);
  },

  goToSeconds: function (seconds) {
    this.lottieItem.goToAndStop(seconds, false);
    this.canvas.requestRenderAll();
  },
  goToFrame: function (frame) {
    this.lottieItem.goToAndStop(frame, true);
  },
  getDuration: function () {
    return this.lottieItem.getDuration(false);
  },
  play: function () {
    this.lottieItem.play();
  },
  pause: function () {
    this.lottieItem.pause();
  },
  getSrc: function () {
    return this.path;
  },
});

fabric.Lottie.fromObject = function (_object, callback) {
  const object = fabric.util.object.clone(_object);
  fabric.Image.prototype._initFilters.call(
    object,
    object.filters,
    function (filters) {
      object.filters = filters || [];
      fabric.Image.prototype._initFilters.call(
        object,
        [object.resizeFilter],
        function (resizeFilters) {
          object.resizeFilter = resizeFilters[0];
          fabric.util.enlivenObjects(
            [object.clipPath],
            function (enlivedProps) {
              object.clipPath = enlivedProps[0];
              const fabricLottie = new fabric.Lottie(
                object.src,
                object
              );
              callback(fabricLottie, false);
            }
          );
        }
      );
    }
  );
};

// Initialize canvas
var canvas = new fabric.Canvas('canvas', {
  preserveObjectStacking: true,
  backgroundColor: '#FFF',
  stateful: true,
});
canvas.selection = false;
canvas.controlsAboveOverlay = true;

// Customize controls
fabric.Object.prototype.set({
  transparentCorners: false,
  borderColor: '#51B9F9',
  cornerColor: '#FFF',
  borderScaleFactor: 2.5,
  cornerStyle: 'circle',
  cornerStrokeColor: '#0E98FC',
  borderOpacityWhenMoving: 1,
});

canvas.selectionColor = 'rgba(46, 115, 252, 0.11)';
canvas.selectionBorderColor = 'rgba(98, 155, 255, 0.81)';
canvas.selectionLineWidth = 1.5;

var img = document.createElement('img');
img.src = '../../static/img/Editor/middlecontrol.svg';

var img2 = document.createElement('img');
img2.src = '../../static/img/Editor/middlecontrolhoz.svg';

var img3 = document.createElement('img');
img3.src = '../../static/img/Editor/edgecontrol.svg';

var img4 = document.createElement('img');
img4.src = '../../static/img/Editor/rotateicon.svg';

function renderIcon(ctx, left, top, styleOverride, fabricObject) {
  const wsize = 20;
  const hsize = 25;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
  ctx.drawImage(img, -wsize / 2, -hsize / 2, wsize, hsize);
  ctx.restore();
}
function renderIconHoz(ctx, left, top, styleOverride, fabricObject) {
  const wsize = 25;
  const hsize = 20;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
  ctx.drawImage(img2, -wsize / 2, -hsize / 2, wsize, hsize);
  ctx.restore();
}
function renderIconEdge(ctx, left, top, styleOverride, fabricObject) {
  const wsize = 25;
  const hsize = 25;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
  ctx.drawImage(img3, -wsize / 2, -hsize / 2, wsize, hsize);
  ctx.restore();
}

function renderIconRotate(
  ctx,
  left,
  top,
  styleOverride,
  fabricObject
) {
  const wsize = 40;
  const hsize = 40;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
  ctx.drawImage(img4, -wsize / 2, -hsize / 2, wsize, hsize);
  ctx.restore();
}
function resetControls() {
  fabric.Object.prototype.controls.ml = new fabric.Control({
    x: -0.5,
    y: 0,
    offsetX: -1,
    cursorStyleHandler:
      fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingXOrSkewingY,
    getActionName: fabric.controlsUtils.scaleOrSkewActionName,
    render: renderIcon,
  });

  fabric.Object.prototype.controls.mr = new fabric.Control({
    x: 0.5,
    y: 0,
    offsetX: 1,
    cursorStyleHandler:
      fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingXOrSkewingY,
    getActionName: fabric.controlsUtils.scaleOrSkewActionName,
    render: renderIcon,
  });

  fabric.Object.prototype.controls.mb = new fabric.Control({
    x: 0,
    y: 0.5,
    offsetY: 1,
    cursorStyleHandler:
      fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingYOrSkewingX,
    getActionName: fabric.controlsUtils.scaleOrSkewActionName,
    render: renderIconHoz,
  });

  fabric.Object.prototype.controls.mt = new fabric.Control({
    x: 0,
    y: -0.5,
    offsetY: -1,
    cursorStyleHandler:
      fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingYOrSkewingX,
    getActionName: fabric.controlsUtils.scaleOrSkewActionName,
    render: renderIconHoz,
  });

  fabric.Object.prototype.controls.tl = new fabric.Control({
    x: -0.5,
    y: -0.5,
    cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingEqually,
    render: renderIconEdge,
  });

  fabric.Object.prototype.controls.tr = new fabric.Control({
    x: 0.5,
    y: -0.5,
    cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingEqually,
    render: renderIconEdge,
  });

  fabric.Object.prototype.controls.bl = new fabric.Control({
    x: -0.5,
    y: 0.5,
    cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingEqually,
    render: renderIconEdge,
  });

  fabric.Object.prototype.controls.br = new fabric.Control({
    x: 0.5,
    y: 0.5,
    cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingEqually,
    render: renderIconEdge,
  });

  fabric.Object.prototype.controls.mtr = new fabric.Control({
    x: 0,
    y: 0.5,
    cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
    actionHandler: fabric.controlsUtils.rotationWithSnapping,
    offsetY: 30,
    withConnecton: false,
    actionName: 'rotate',
    render: renderIconRotate,
  });
}
resetControls();
var textBoxControls = (fabric.Textbox.prototype.controls = {});

textBoxControls.mtr = fabric.Object.prototype.controls.mtr;
textBoxControls.tr = fabric.Object.prototype.controls.tr;
textBoxControls.br = fabric.Object.prototype.controls.br;
textBoxControls.tl = fabric.Object.prototype.controls.tl;
textBoxControls.bl = fabric.Object.prototype.controls.bl;
textBoxControls.mt = fabric.Object.prototype.controls.mt;
textBoxControls.mb = fabric.Object.prototype.controls.mb;

textBoxControls.ml = new fabric.Control({
  x: -0.5,
  y: 0,
  offsetX: -1,
  cursorStyleHandler:
    fabric.controlsUtils.scaleSkewCursorStyleHandler,
  actionHandler: fabric.controlsUtils.changeWidth,
  actionName: 'resizing',
  render: renderIcon,
});

textBoxControls.mr = new fabric.Control({
  x: 0.5,
  y: 0,
  offsetX: 1,
  cursorStyleHandler:
    fabric.controlsUtils.scaleSkewCursorStyleHandler,
  actionHandler: fabric.controlsUtils.changeWidth,
  actionName: 'resizing',
  render: renderIcon,
});

// Get any object by ID
fabric.Canvas.prototype.getItemById = function (name) {
  var object = null,
    objects = this.getObjects();
  for (var i = 0, len = this.size(); i < len; i++) {
    if (objects[i].get('type') == 'group') {
      if (objects[i].get('id') && objects[i].get('id') === name) {
        object = objects[i];
        break;
      }
      var wip = i;
      for (var o = 0; o < objects[i]._objects.length; o++) {
        if (
          objects[wip]._objects[o].id &&
          objects[wip]._objects[o].id === name
        ) {
          object = objects[wip]._objects[o];
          break;
        }
      }
    } else if (objects[i].id && objects[i].id === name) {
      object = objects[i];
      break;
    }
  }
  return object;
};

// Create the artboard
var a_width = 600;
var a_height = 500;
var artboard = new fabric.Rect({
  left: canvas.get('width') / 2 - a_width / 2,
  top: canvas.get('height') / 2 - a_height / 2,
  width: a_width,
  height: a_height,
  absolutePositioned: true,
  rx: 0,
  ry: 0,
  fill: '#FFF',
  hasControls: true,
  transparentCorners: false,
  borderColor: '#0E98FC',
  cornerColor: '#0E98FC',
  cursorWidth: 1,
  cursorDuration: 1,
  cursorDelay: 250,
  id: 'overlay',
});
canvas.renderAll();

// Clip canvas to the artboard
canvas.clipPath = artboard;
canvas.renderAll();

// Initialize color picker (fill)
var o_fill = Pickr.create({
  el: '#color-picker-fill',
  theme: 'nano',
  inline: true,
  useAsButton: true,
  swatches: null,
  default: '#FFFFFF',
  showAlways: true,
  components: {
    preview: true,
    opacity: true,
    hue: true,
    interaction: {
      hex: true,
      rgba: true,
      hsla: false,
      hsva: false,
      cmyk: false,
      input: true,
      clear: false,
      save: false,
    },
  },
});

// Color picker events
o_fill
  .on('init', (instance) => {
    o_fill.hide();
  })
  .on('change', (instance) => {
    if (canvas.getActiveObject()) {
      const object = canvas.getActiveObject();
      if (colormode == 'fill') {
        $('#object-color-fill input').val(
          o_fill.getColor().toHEXA().toString().substring(0, 7)
        );
        $('#object-color-fill-opacity input').val(
          Math.round(o_fill.getColor().toRGBA()[3] * 100 * 100) / 100
        );
        $('#color-fill-side').css(
          'background-color',
          o_fill.getColor().toHEXA().toString().substring(0, 7)
        );
        object.set('fill', o_fill.getColor().toRGBA().toString());
        if (!seeking && !setting) {
          newKeyframe(
            'fill',
            object,
            currenttime,
            object.get('fill'),
            true
          );
        }
      } else if (colormode == 'stroke') {
        $('#object-color-stroke input').val(
          o_fill.getColor().toHEXA().toString().substring(0, 7)
        );
        $('#object-color-stroke-opacity input').val(
          Math.round(o_fill.getColor().toRGBA()[3] * 100 * 100) / 100
        );
        $('#color-stroke-side').css(
          'background-color',
          o_fill.getColor().toHEXA().toString().substring(0, 7)
        );
        object.set('stroke', o_fill.getColor().toRGBA().toString());
        if (!seeking && !setting) {
          newKeyframe(
            'stroke',
            object,
            currenttime,
            object.get('stroke'),
            true
          );
          newKeyframe(
            'strokeWidth',
            object,
            currenttime,
            object.get('strokeWidth'),
            true
          );
        }
      } else if (colormode == 'shadow') {
        $('#object-color-shadow input').val(
          o_fill.getColor().toHEXA().toString().substring(0, 7)
        );
        $('#object-color-shadow-opacity input').val(
          Math.round(o_fill.getColor().toRGBA()[3] * 100 * 100) / 100
        );
        $('#color-shadow-side').css(
          'background-color',
          o_fill.getColor().toHEXA().toString().substring(0, 7)
        );
        object.set(
          'shadow',
          new fabric.Shadow({
            color: o_fill.getColor().toRGBA().toString(),
            offsetX: object.shadow.offsetX,
            offsetY: object.shadow.offsetY,
            blur: object.shadow.blur,
            opacity: object.shadow.opacity,
          })
        );
        if (!seeking && !setting) {
          newKeyframe(
            'shadow.color',
            object,
            currenttime,
            object.shadow.color,
            true
          );
        }
      } else if (colormode == 'chroma') {
        var obj = canvas.getActiveObject();
        $('#chroma-color input').val(
          o_fill.getColor().toHEXA().toString().substring(0, 7)
        );
        $('#color-chroma-side').css(
          'background-color',
          o_fill.getColor().toHEXA().toString().substring(0, 7)
        );
        if (obj.filters.find((x) => x.type == 'RemoveColor')) {
          obj.filters.find((x) => x.type == 'RemoveColor').color =
            o_fill.getColor().toRGBA().toString();
        }
        updateChromaValues();
      } else if (colormode == 'text') {
        var obj = canvas.getActiveObject();
        $('#text-color input').val(
          o_fill.getColor().toHEXA().toString().substring(0, 7)
        );
        $('#color-text-side').css(
          'background-color',
          o_fill.getColor().toHEXA().toString().substring(0, 7)
        );
        animatedtext
          .find((x) => x.id == obj.id)
          .setProps(
            { fill: o_fill.getColor().toRGBA().toString() },
            canvas
          );
      }
      canvas.renderAll();
    } else {
      if (colormode == 'back') {
        $('#canvas-color input').val(
          o_fill.getColor().toHEXA().toString().substring(0, 7)
        );
        $('#canvas-color-opacity input').val(
          Math.round(o_fill.getColor().toRGBA()[3] * 100 * 100) / 100
        );
        $('#color-side').css(
          'background-color',
          o_fill.getColor().toHEXA().toString().substring(0, 7)
        );
        canvas.setBackgroundColor(
          o_fill.getColor().toRGBA().toString()
        );
        canvas.renderAll();
      }
    }
  })
  .on('show', (instance) => {
    $('.pcr-current-color').html(
      "<img id='eyedropper' src='../../static/img/Editor/eyedropper.svg'>"
    );
  });

var f = fabric.Image.filters;

// Canvas recorder initialization
var canvasrecord = new fabric.Canvas('canvasrecord', {
  preserveObjectStacking: true,
  backgroundColor: '#FFF',
  width: artboard.width,
  height: artboard.height,
});

var timelineslider = document.getElementById('timeline-zoom');
var t_slider = new RangeSlider(timelineslider, {
  design: '2d',
  theme: 'default',
  handle: 'round',
  popup: null,
  showMinMaxLabels: false,
  unit: '%',
  min: 5,
  max: 47,
  value: 47,
  onmove: function (x) {
    setTimelineZoom(-1 * (x - 51));
  },
  onfinish: function (x) {
    setTimelineZoom(-1 * (x - 51));
  },
  onstart: function (x) {},
});

const selectbox = new SelectionArea({
  class: 'selection-area',
  selectables: ['.keyframe'],
  container: '#timeline',
  // Query selectors for elements from where a selection can be started from.
  startareas: ['html'],

  // Query selectors for elements which will be used as boundaries for the selection.
  boundaries: ['#timeline'],

  startThreshold: 10,

  allowTouch: true,

  intersect: 'touch',

  overlap: 'invert',

  // Configuration in case a selectable gets just clicked.
  singleTap: {
    allow: false,
    intersect: 'native',
  },

  // Scroll configuration.
  scrolling: {
    speedDivider: 10,
    manualSpeed: 750,
  },
});

selectbox
  .on('beforestart', (evt) => {
    if (
      $(evt.event.target).hasClass('keyframe') ||
      $(evt.event.target).attr('id') == 'seekbar' ||
      $(evt.event.target).parent().hasClass('main-row') ||
      $(evt.event.target).hasClass('main-row') ||
      $(evt.event.target).hasClass('trim-row') ||
      evt.event.which === 3
    ) {
      return false;
    }
  })
  .on('start', (evt) => {})
  .on('move', (evt) => {})
  .on('stop', (evt) => {
    $('.keyframe-selected').removeClass('keyframe-selected');
    shiftkeys = [];
    if (evt.store.selected.length == 0) {
      $('.keyframe-selected').removeClass('keyframe-selected');
    } else {
      canvas.discardActiveObject();
      canvas.renderAll();
      evt.store.selected.forEach(function (key) {
        shiftkeys.push({
          keyframe: key,
          offset: $(key).offset().left,
        });
        $(key).addClass('keyframe-selected');
      });
    }
  });
