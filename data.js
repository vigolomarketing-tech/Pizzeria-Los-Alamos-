// CONFIG — Pizzería Los Álamos (demo Vigolo Web Studio)
// Todo lo que cambia de un comercio a otro vive acá.
// Lo marcado con "PENDIENTE CLIENTE" hay que confirmarlo con el dueño.

// Atajos para cargar productos rápido: p(categoria, sub, [[nombre, precio, descripcion?], ...])
const p = (categoria, sub, filas) =>
  filas.map(([nombre, precio, descripcion]) => ({
    id: (categoria + "-" + nombre).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-"),
    categoria, sub, nombre, precio, descripcion,
  }));

const CONFIG = {
  negocio: {
    nombre: "Pizzería Los Álamos",
    rubro: "Pizzería y rotisería",
    localidad: "Buenos Aires", // PENDIENTE CLIENTE: localidad exacta
    eslogan: "Pizzas, empanadas, milas y burgers. Pedí y te lo llevamos.",
    logo: "img/logo.webp",
  },

  colores: {
    primario: "#D7312B",
    secundario: "#E9B24B",
    fondo: "#FFF7EC",
    texto: "#1B1B22",
    oscuro: "#14161C",
  },

  contacto: {
    whatsapp: "5491133404927", // PENDIENTE CLIENTE: el 11 3340 4927 sale en sus fotos; confirmar que es el WhatsApp
    mensajeWhatsapp: "¡Hola! Vi su web y quería consultar...",
    telefono: "+54 11 3340-4927",
    telefonoFijo: "2073-7855",
    instagram: "https://instagram.com/pizzerialosalamos",
    instagramUser: "@pizzerialosalamos",
    facebook: "https://www.facebook.com/Pizzeria-los-alamos-179018717438780",
    email: "losalamospizzeria@gmail.com",
    direccion: "", // PENDIENTE CLIENTE: calle y número
    mapsEmbed: "", // PENDIENTE CLIENTE: src del iframe de Google Maps
    mapsLink: "",  // PENDIENTE CLIENTE: link "Cómo llegar"
  },

  // 0 = domingo ... 6 = sábado. Varios turnos por día permitidos. Lunes cerrado.
  horarios: {
    0: [["19:00", "23:59"]],
    1: [],
    2: [["12:00", "15:00"], ["19:00", "23:59"]],
    3: [["12:00", "15:00"], ["19:00", "23:59"]],
    4: [["12:00", "15:00"], ["19:00", "23:59"]],
    5: [["12:00", "15:00"], ["19:00", "23:59"]],
    6: [["12:00", "15:00"], ["19:00", "23:59"]],
  },

  pedidos: {
    habilitado: true,
    envio: { costo: null, zona: "" }, // PENDIENTE CLIENTE: costo y zona de envío (null = "a confirmar por WhatsApp")
    pedidoMinimo: 0,                  // PENDIENTE CLIENTE
    formasDePago: ["Efectivo", "Transferencia", "Mercado Pago", "Cuenta DNI"], // PENDIENTE CLIENTE
  },

  // banner = foto de cabecera; chips = lista informativa (sabores); nota = aclaración debajo del título
  categorias: [
    { id: "promos", nombre: "Promos", banner: "img/picada.webp", nota: "Las promos con Coca de 1,5 L gratis incluyen la gaseosa. Precios sujetos a modificación sin previo aviso." },
    { id: "pizzas", nombre: "Pizzas", banner: "", nota: "Pizzas al molde y a la piedra, rellenas y calzones." }, // PENDIENTE CLIENTE: foto de pizzas
    { id: "empanadas", nombre: "Empanadas", banner: "img/empanadas.webp", nota: "La docena incluye 4 salsas. Martes, miércoles y jueves: docena (14) + Coca de 1,5 L a $ 36.000. Aclará los sabores al pedir.",
      chipsTitulo: "Sabores de empanadas",
      chips: ["Carne clásica", "Carne desmechada", "Carne picante", "Carne y cheddar", "Carne y cheddar picante", "Carne y provolone", "Carne salteña (papa, huevo y verdeo)", "Carne sanjuanina (aceitunas)", "Pollo clásico", "Pollo a la mostaza", "Pollo teriyaki", "Bondiola braseada con bbq", "Cerdo teriyaki (desmechada)", "Jamón y queso"] },
    { id: "canastas", nombre: "Canastas", banner: "img/canastas.webp", nota: "Consultá el precio y aclará los sabores al pedir.", // PENDIENTE CLIENTE: precio de las canastas
      chipsTitulo: "Sabores de canastas",
      chips: ["Pollo al verdeo", "Pollo al champiñón", "Cebolla y queso", "Calabresa", "Capresse", "Roquefort", "Roquefort, jamón y muzzarella", "Roquefort, apio y nueces", "Humita", "Verdura", "Viena (salchicha, mostaza, papa pay)", "Provolone, cantimpalo y muzzarella", "Jamón, ananá y muzzarella", "Pastel de papas", "Calabaza soufflé (calabaza y muzza)", "Berenjenas y muzza"] },
    { id: "tartas", nombre: "Tartas", banner: "img/tartas.webp", nota: "Tartas individuales, recién horneadas, con masa casera." },
    { id: "milanesas", nombre: "Milanesas", banner: "img/milas-plato.webp", nota: "Milanesas al plato. LyT = lechuga y tomate." },
    { id: "sandwiches", nombre: "Sándwiches", banner: "img/mila-sandwich.webp", nota: "Junior 14 cm (individual) · XL 30 cm (para compartir) · X Metro 80 cm (para 6 o 7 personas)." },
    { id: "burgers", nombre: "Hamburguesas", banner: "", nota: "Todas incluyen papas fritas. Carne adicional: $ 2.000." },
    { id: "hotdogs", nombre: "Hot dogs", banner: "img/hotdog.webp", nota: "Todos incluyen papas fritas. Papas pay a elección." },
    { id: "entradas", nombre: "Entradas y papas", banner: "img/entradas.webp", nota: "Papas fritas: guarnición o porción." },
    { id: "helados", nombre: "Helados", banner: "", nota: "Martes, miércoles y jueves: 2x1 en ¼ kilo, llevás 2 y pagás 1.", // PENDIENTE CLIENTE: foto de helados
      chipsTitulo: "Cremas heladas",
      chips: ["Chocolate Donnado (chocolate con ddl, nueces y almendras caramelizadas)", "Havachoc (chocolate con ddl y trozos de alfajores havanna)", "Chocolate amargo", "Chocolate Marroc", "Chocolate Dubai (chocolate belga, pasta de pistachos, kadayif y chocolate con leche)", "Dulce de leche bombón", "Dulce de leche granizado", "Dulce de leche", "Granizado", "Menta granizada", "Milka Oreo", "Crema americana", "Frutilla a la crema", "Frutilla Cadbury (frutilla con yogurt y chocolate semiamargo)", "Franuí", "Mousse de limón", "Tramontana", "Sambayón con almendras", "Flan con dulce de leche", "Banana Split (100% bananas licuadas y ddl natural)", "Crema Patagónica (mousse de arándano con salsa de frutos del bosque)", "Mantecol"] },
    { id: "bebidas", nombre: "Bebidas", banner: "", nota: "Venta de alcohol prohibida a menores de 18 años." },
  ],

  // Hamburguesas del carrusel (posters propios del local). Ids de productos de la categoría "burgers".
  destacadas: [
    { img: "img/poster-texana.webp", w: 600, h: 1066, alt: "La Texana: carne, mayonesa picante, cheddar y cebolla caramelizada", producto: "burgers-texana" },
    { img: "img/poster-chicago.webp", w: 600, h: 901, alt: "Chicago Crispy: smash burger, bacon, cheddar y cebolla crispy", producto: "burgers-chicago-crispy" },
    { img: "img/poster-argenta.webp", w: 600, h: 1048, alt: "La Argenta: doble carne, salsa criolla y provoleta", producto: "burgers-la-argenta" },
    { img: "img/poster-dallas.webp", w: 600, h: 799, alt: "Dallas: smash burger, bacon, cebolla crispy, bbq y cheddar", producto: "burgers-dallas" },
  ],

  salsas: ["Criolla", "Alioli", "Mayonesa de verdeo", "Americana", "Mostaza honey", "Teriyaki", "Mayonesa de aceitunas"],

  productos: [
    // ——— PROMOS ———
    ...p("promos", "Con Coca de 1,5 L gratis", [
      ["3 Muzzarellas", 42000], ["Napolitana + Muzzarella", 36000], ["Calabresa + Muzzarella", 36000],
      ["Jamón + Muzzarella", 36000], ["Fugazza c/ muzza + Muzzarella", 34000],
      ["6 Empanadas + Muzzarella", 35000, "Carne clásica, pollo clásico o jamón y queso."],
    ]),
    ...p("promos", "Para compartir", [
      ["4 Hot dogs a elección + papas fritas + Coca 1,5 L", 24500],
      ["4 Burgers con cheddar y bacon + papas fritas", 31000],
      ["2 Burgers con cheddar y bacon + papas fritas", 19000],
      ["2 Juniors completos, napolitanos o bondiola con bbq", 20000],
      ["Sándwich X Metro + papas fritas", 48000, "Para 6 o 7 personas."],
      ["Milapizza + papas fritas", 34000],
      ["Picada frita para 4", 34000],
      ["Picada frita para 2", 29000],
      ["16 Empanadas", 46000],
      ["Mix de milanesas + papas fritas", 39000, "Napolitana, fugazzeta, cheddar y a caballo."],
      ["2 Milanesas simples + papas fritas grandes con cheddar, panceta y verdeo", 39000],
      ["2 Milanesas simples + papas fritas grandes", 37000],
      ["2 Milanesas simples + ensalada", 37000],
      ["2 Napolitanas a caballo + papas fritas grandes", 39000],
    ]),
    ...p("promos", "Martes, miércoles y jueves", [
      ["12 Empanadas + 2 + Coca de 1,5 L", 36000, "Docena + 2 surtida."],
      ["2 Cuartos de helado artesanal", 11000], // PENDIENTE CLIENTE: confirmar si sigue vigente
    ]),
    ...p("promos", "Más promos", [ // PENDIENTE CLIENTE: confirmar vigencia (salen en el menú viejo)
      ["2 Tartas individuales", 17500, "Varios sabores."],
      ["Promo Olla", 20000, "Combinás como quieras."],
      ["3 Muzza económicas", 28500],
      ["Pata y muslo + fritas", 10000],
    ]),

    // ——— PIZZAS ———
    ...p("pizzas", "Molde y piedra", [
      ["Pizza económica", 12500], ["Muzzarella", 16000], ["Doble muzzarella", 23600], ["Napolitana", 22500], ["Napolitana con jamón", 23300],
      ["Fugazza c/ muzza", 19800], ["Calabresa", 21900], ["Jamón", 21400], ["Jamón y huevo", 21900], ["Jamón y morrones", 24000], ["Jamón y verdeo", 21900],
      ["Jamón crudo y roque", 24700], ["Jamón crudo y rúcula", 24700], ["Cuatro quesos", 24100], ["4 Estaciones", 24100], ["Ahumada", 22500],
      ["Anchoas", 19500], ["Anchoas c/ muzza", 21400], ["Brasilera", 24100], ["Cheddar y panceta", 25100], ["Choclo y salsa blanca", 21900],
      ["Especial al huevo", 25100], ["Especial palmitos", 25600], ["Espinaca, salsa blanca y roquefort", 24700], ["Hawaiana", 23600], ["Huevo", 21400],
      ["Morrones", 23200], ["Muzza y papas fritas", 23700], ["Muzza, papas y huevos", 25300], ["Muzza, papas, huevo y cheddar", 26500],
      ["Panceta", 21900], ["Papa pay", 20800], ["Papa pay y salchichas", 22400], ["Pepperoni", 22500], ["Primavera", 23000],
      ["Provolone", 23000], ["Provolone y chorizo colorado", 23600], ["Provolone y roquefort", 24500], ["Roquefort", 24000],
      ["Roquefort, apio y nueces", 24500], ["Roquefort y longaniza", 24300], ["Rúcula y parmesano", 23500], ["Siciliana", 24100],
      ["Verduras", 23000], ["Champiñones", 23100], ["Champiñones y salsa blanca", 24700], ["Berenjenas y muzza", 22500],
    ]),
    ...p("pizzas", "Fainá", [["Fainá entera", 12500], ["Fainá porción", 2500], ["Fainá pizza entera", 18500]]),
    ...p("pizzas", "Pizzas rellenas", [["Fugazzeta especial", 32400], ["Fugazzeta al tomate", 32400], ["Especial de la casa", 33500]]),
    ...p("pizzas", "Calzone", [["Calzone de jamón y muzzarella", 29100], ["Calzone de jamón, muzzarella y morrones", 29600], ["Calzone napolitano", 29300]]),

    // ——— EMPANADAS ———
    ...p("empanadas", "", [
      ["Empanada (unidad)", 3800, "Elegí el sabor al pedir."],
      ["Docena + 2 (surtida)", 36000, "Incluye 4 salsas."],
      ["Promo 16 + 2 (surtida)", 46000],
    ]),

    // ——— CANASTAS ———
    // PENDIENTE CLIENTE: precio de las canastas (no figura en el menú). Sin precio = "Consultar".
    ...p("canastas", "", [["Canasta (consultar precio)", null, "Elegí el sabor al pedir."]]),

    // ——— TARTAS ———
    ...p("tartas", "", [
      ["Tarta de humita", 10000, "Salsa blanca, cebolla, morrón, choclo y muzza."],
      ["Tarta de jamón", 10000, "Queso, jamón, huevo y tomate."],
      ["Tarta de verdura", 10000, "Salsa blanca, cebolla, morrón, huevo, acelga y muzza."],
      ["Tarta de pollo", 10000, "Pollo, cebolla de verdeo y salsa blanca."],
      ["Promo 2 tartas", 17500],
    ]),

    // ——— MILANESAS AL PLATO ———
    ...p("milanesas", "Al plato", [
      ["Napolitana c/ ensalada LyT", 24500], ["Napolitana c/ fritas", 24500],
      ["Napolitana a caballo c/ ensalada LyT", 25000], ["Napolitana a caballo c/ fritas", 25000],
      ["Simple c/ ensalada LyT", 22500], ["Simple c/ fritas", 22500], ["Simple a caballo c/ fritas", 24500],
      ["Cheddar, panceta y verdeo c/ fritas", 24500],
      ["Napolitana Junior c/ fritas", 19000], ["Napolitana Junior c/ LyT", 19000],
      ["Milapizza + papas fritas", 34000],
    ]),

    // ——— SÁNDWICHES ———
    ...p("sandwiches", "XL (30 cm, para compartir)", [
      ["XL Simple", 19900], ["XL Simple c/ fritas", 21700], ["XL Napolitano", 20700], ["XL Napolitano c/ fritas", 22400],
      ["XL Completo", 20100], ["XL Completo c/ fritas", 21900], ["XL Cheddar y panceta c/ fritas", 22500],
      ["XL A caballo c/ fritas", 21900], ["XL Napo a caballo c/ fritas", 23000],
    ]),
    ...p("sandwiches", "Junior (14 cm, individual)", [
      ["Junior Completo c/ fritas", 19500], ["Junior de Bondiola c/ fritas", 19500], ["Junior Napolitano c/ fritas", 19500],
    ]),
    ...p("sandwiches", "X Metro y chicos", [
      ["X Metro Completo c/ fritas", 48000, "80 cm. Comen 7, pican 10."],
      ["Cajita Feliz burger y nuggets", 16000], ["Cajita Feliz ricosaurios y fritas", 16000],
    ]),

    // ——— HAMBURGUESAS (variantes simple / doble) ———
    ...[
      ["Detroit Basic", "Carne y pan.", [["Simple", 8500]]],
      ["New York", "Carne y cheddar.", [["Simple", 10000], ["Doble", 12000]]],
      ["Las Vegas", "Carne, cheddar y bacon.", [["Simple", 13000], ["Doble", 14500]]],
      ["La Argenta", "Carne, provoleta y criolla.", [["Simple", 13000], ["Doble", 14500]]],
      ["Texana", "Carne, cheddar, cebolla caramelizada y mayo picante.", [["Simple", 13000], ["Doble", 14500]]],
      ["Dallas", "Carne, cheddar, bacon, aros de cebolla y bbq.", [["Simple", 14500]]],
      ["Chicago Crispy", "Carne, cheddar, bacon, cebolla crispy y alioli.", [["Simple", 14500]]],
      ["Boston", "Carne, huevo, tomate, lechuga, jamón y queso.", [["Simple", 13000]]],
    ].map(([nombre, descripcion, variantes]) => ({
      id: "burgers-" + nombre.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      categoria: "burgers", sub: "", nombre, descripcion, variantes: variantes.map(([n, precio]) => ({ nombre: n, precio })),
    })),

    // ——— HOT DOGS ———
    ...p("hotdogs", "Hot dog + papas fritas", [
      ["Clásico", 6000, "Mayonesa."],
      ["Cheddar", 6900, "Cheddar, bacon y verdeo."],
      ["Mix de salsas", 6300, "Mayonesa, ketchup, mostaza y papas pay."],
      ["A la pizza", 6500, "Salsa de tomate, muzzarella y aceitunas."],
      ["A la calabresa", 6500, "Muzzarella y longaniza."],
      ["Al jamón", 6500, "Muzzarella y jamón."],
      ["Capresse", 6500, "Muzzarella, tomate y albahaca."],
      ["Fugazza", 6500, "Muzzarella y cebolla caramelizada."],
    ]),
    ...p("hotdogs", "Combo", [["Súper combo: 4 hot dogs a elección + papas fritas + Coca 1,5 L", 24500]]),

    // ——— ENTRADAS Y PAPAS ———
    ...p("entradas", "Entradas", [
      ["Aros de cebolla", 12000], ["Tequeños + fritas", 15500], ["Empanaditas de copetín", 9500], ["Bastones de muzza + fritas", 11000],
      ["Nuggets + fritas", 11000], ["Patitas de pollo + fritas", 9500], ["Buñuelos de acelga", 9500],
    ]),
    ...p("entradas", "Papas fritas", [
      ["Papas clásicas (guarnición)", 10800], ["Papas clásicas (porción)", 12400],
      ["Papas provenzal (guarnición)", 11000], ["Papas provenzal (porción)", 13300],
      ["Papas cheddar, bacon y verdeo (guarnición)", 12000], ["Papas cheddar, bacon y verdeo (porción)", 14000],
      ["Papas a caballo (guarnición)", 11500], ["Papas a caballo (porción)", 13500],
    ]),
    ...p("entradas", "Picadas", [["Picada frita para 2", 29000], ["Picada frita para 4", 34000]]),

    // ——— HELADOS ———
    ...p("helados", "Por kilo", [
      ["Kilo (4 gustos)", 21000], ["½ kilo (3 gustos)", 14000], ["¼ kilo (2 gustos)", 11000], ["4 cucuruchos dulces", 4000],
    ]),
    ...p("helados", "Bombones Gio", [
      ["Frambuesas con doble chocolate", 9000], ["Frutillas con doble chocolate", 9000], ["Frutillas American cookies", 9000],
      ["Moras con doble chocolate", 9000], ["Frambuesas con pistacho", 11000], ["1 pote de bombones", 9000], ["2 potes de bombones (excepto pistacho)", 16000],
    ]),

    // ——— BEBIDAS ———
    ...p("bebidas", "Gaseosas", [
      ["Coca-Cola 1,5 L", 5000], ["Coca-Cola Zero 1,5 L", 5000], ["Sprite 1,5 L", 5000],
      ["Paso de los Toros Pomelo 1,5 L", 5000], ["Paso de los Toros Pomelo sin azúcar 1,5 L", 5000],
      ["Manaos Cola 2,25 L", 3500], ["Manaos Pomelo 2,25 L", 3500],
      ["Aquarius Naranja 1,5 L", 4000], ["Aquarius Manzana 1,5 L", 4000], ["Aquarius Uva 1,5 L", 4000], ["Aquarius Pera 1,5 L", 4000],
      ["Monster 473 ml (todos los sabores)", 4500], ["Speed 473 ml", 4000],
    ]),
    ...p("bebidas", "Cervezas", [
      ["Brahma 473 ml", 3700], ["Miller 473 ml", 2900], ["Heineken 473 ml", 3500], ["Budweiser 473 ml", 3900],
      ["Andes Rubia 473 ml", 4400], ["Andes IPA Andina 473 ml", 4400], ["Andes Oro Suave 473 ml", 4400], ["Andes Roja 473 ml", 4400], ["Andes Negra 473 ml", 4400],
      ["Corona 710 ml", 6000],
    ]),
    ...p("bebidas", "Tragos y vinos", [
      ["Fernet 1882 473 ml", 2700], ["Fernet Branca 750 ml", 18500],
      ["Smirnoff Red Berries 473 ml", 3500], ["Smirnoff Green Apple 473 ml", 3500],
      ["Sky Cosmic / Ananá / Durazno / Frambuesa", 14500],
      ["Federico de Alvear", 6000], ["Santa Julia", 9500], ["Dadá Malbec", 6500],
    ]),
  ],

  resenas: [
    // PENDIENTE CLIENTE: reseñas reales de Google (autor, texto, estrellas). Hasta tenerlas, la sección no se muestra.
  ],

  seo: {
    titulo: "Pizzería y rotisería | Pizzería Los Álamos",
    descripcion: "Pizzas, empanadas, milanesas, hamburguesas y helados. Mirá el menú completo, armá tu pedido y mandalo por WhatsApp a Pizzería Los Álamos.",
    ogImage: "img/og.webp",
    tipoSchema: "Restaurant",
    url: "", // PENDIENTE CLIENTE: URL final de la web
  },
};
