(() => {
  const C = CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = n => "$ " + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const wa = text => `https://wa.me/${C.contacto.whatsapp}?text=${encodeURIComponent(text)}`;
  const byId = Object.fromEntries(C.productos.map(x => [x.id, x]));
  const get = (o, path) => path.split(".").reduce((a, k) => (a ? a[k] : ""), o);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- textos, colores y links desde CONFIG ---------- */
  const root = document.documentElement.style;
  const col = C.colores;
  root.setProperty("--primario", col.primario); root.setProperty("--secundario", col.secundario);
  root.setProperty("--fondo", col.fondo); root.setProperty("--texto", col.texto); root.setProperty("--oscuro", col.oscuro);
  $$("[data-t]").forEach(el => (el.textContent = get(C, el.dataset.t)));
  $$("[data-wa]").forEach(el => (el.href = wa(C.contacto.mensajeWhatsapp)));
  $("#year").textContent = new Date().getFullYear();
  document.title = C.seo.titulo;
  $('meta[name="description"]').content = C.seo.descripcion;
  if (C.seo.url) $('meta[property="og:url"]').content = C.seo.url;

  /* ---------- horarios y "abierto ahora" (hora de Argentina) ---------- */
  const TZ = "America/Argentina/Buenos_Aires", WEEK = 10080;
  const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const toMin = s => { const [h, m] = s.split(":"); return +h * 60 + +m; };
  const hm = min => {
    let h = Math.floor((min % 1440) / 60), m = min % 60;
    if (m === 59) { m = 0; h = (h + 1) % 24; }
    return h === 0 && m === 0 ? "medianoche" : `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };
  const nowBA = () => {
    const p = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
    const g = t => p.find(x => x.type === t).value;
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(g("weekday")) * 1440 + (+g("hour") % 24) * 60 + +g("minute");
  };
  const turnos = [];
  for (const d in C.horarios) for (const [s, e] of C.horarios[d]) {
    const a = +d * 1440 + toMin(s); let b = +d * 1440 + toMin(e); if (b <= a) b += 1440; turnos.push([a, b]);
  }
  function estado() {
    const now = nowBA(); let prox = null;
    for (const [a, b] of turnos) for (const off of [-WEEK, 0, WEEK]) {
      if (now >= a + off && now < b + off) { const h = hm(b); return { abierto: true, texto: `Abierto ahora · cerramos ${h === "medianoche" ? "a medianoche" : "a las " + h}` }; }
      if (a + off > now && (prox === null || a + off < prox)) prox = a + off;
    }
    const dif = Math.floor(prox / 1440) - Math.floor(now / 1440);
    const cuando = dif === 0 ? "hoy" : dif === 1 ? "mañana" : "el " + DIAS[Math.floor(prox / 1440) % 7].toLowerCase();
    return { abierto: false, texto: `Cerrado ahora · abrimos ${cuando} a las ${hm(prox)}` };
  }
  function pintarEstado() {
    const e = estado();
    $$("#estadoPill,#estadoPill2").forEach(p => { p.classList.toggle("abierto", e.abierto); p.classList.toggle("cerrado", !e.abierto); p.lastElementChild.textContent = e.texto; });
    const w = $("#warnClosed");
    w.hidden = e.abierto; w.textContent = "Ahora estamos cerrados. Igual podés dejar el pedido armado y lo vemos apenas abramos.";
    return e;
  }
  pintarEstado(); setInterval(pintarEstado, 60000);
  const hoy = Math.floor(nowBA() / 1440);
  $("#hours tbody").innerHTML = [1, 2, 3, 4, 5, 6, 0].map(d => {
    const t = C.horarios[d];
    const txt = t.length ? t.map(([a, b]) => `${a} a ${hm(toMin(b))}`.replace("a medianoche", "a 00:00")).join(" y ") : "Cerrado";
    return `<tr class="${d === hoy ? "hoy" : ""}"><td>${DIAS[d]}</td><td>${txt}</td></tr>`;
  }).join("");

  /* ---------- contacto, mapa, salsas, reseñas ---------- */
  const k = C.contacto;
  $("#contact").innerHTML = [
    [wa(k.mensajeWhatsapp), `WhatsApp ${k.telefono}`, "_blank"],
    [`tel:${k.telefono.replace(/[^+\d]/g, "")}`, `Llamar al ${k.telefono}`, ""],
    k.telefonoFijo && [`tel:${k.telefonoFijo.replace(/\D/g, "")}`, `Fijo ${k.telefonoFijo}`, ""],
    [k.instagram, `Instagram ${k.instagramUser}`, "_blank"],
    k.facebook && [k.facebook, "Facebook", "_blank"],
    k.email && [`mailto:${k.email}`, k.email, ""],
  ].filter(Boolean).map(([h, t, tg]) => `<li><a href="${esc(h)}"${tg ? ` target="_blank" rel="noopener"` : ""}>${esc(t)}</a></li>`).join("");
  if (k.mapsEmbed) { const f = $("#mapFrame"); f.src = k.mapsEmbed; f.hidden = false; $("#mapPend").hidden = true; }
  if (k.mapsLink) { const l = $("#mapLink"); l.href = k.mapsLink; l.hidden = false; }
  $("#salsasList").innerHTML = C.salsas.map(s => `<li>${esc(s)}</li>`).join("");
  if (C.resenas.length) {
    $("#resenas").hidden = false;
    $("#reviews").innerHTML = C.resenas.map(r => `<blockquote class="rev"><p class="st" aria-label="${r.estrellas} estrellas">${"★".repeat(r.estrellas)}</p><p>${esc(r.texto)}</p><p><b>${esc(r.autor)}</b></p></blockquote>`).join("");
  }

  /* ---------- datos estructurados para Google ---------- */
  const spec = [];
  for (const d in C.horarios) for (const [s, e] of C.horarios[d])
    spec.push({ "@type": "OpeningHoursSpecification", dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][d], opens: s, closes: e });
  const ld = {
    "@context": "https://schema.org", "@type": C.seo.tipoSchema, name: C.negocio.nombre, description: C.seo.descripcion,
    telephone: k.telefono, email: k.email, servesCuisine: ["Pizza", "Empanadas", "Hamburguesas", "Milanesas", "Helados"],
    image: new URL(C.seo.ogImage, location.href).href, openingHoursSpecification: spec, sameAs: [k.instagram, k.facebook].filter(Boolean),
  };
  if (C.seo.url) ld.url = C.seo.url;
  if (k.direccion) ld.address = { "@type": "PostalAddress", streetAddress: k.direccion, addressLocality: C.negocio.localidad, addressCountry: "AR" };
  const sc = document.createElement("script"); sc.type = "application/ld+json"; sc.textContent = JSON.stringify(ld); document.head.append(sc);

  /* ---------- botones de compra ---------- */
  function buyHTML(p) {
    if (p.variantes && p.variantes.length > 1)
      return `<div class="buy multi">${p.variantes.map(v => `<button class="var" type="button" data-add="${p.id}" data-v="${esc(v.nombre)}" aria-label="Agregar ${esc(p.nombre)} ${esc(v.nombre)} al pedido">${esc(v.nombre)} · ${money(v.precio)} +</button>`).join("")}</div>`;
    const precio = p.variantes ? p.variantes[0].precio : p.precio;
    if (precio == null) return `<div class="buy"><a class="ask" href="${wa("¡Hola! Quería consultar el precio de: " + p.nombre)}" target="_blank" rel="noopener">Consultar</a></div>`;
    return `<div class="buy"><span class="price">${money(precio)}</span><button class="add" type="button" data-add="${p.id}" data-v="${p.variantes ? esc(p.variantes[0].nombre) : ""}" aria-label="Agregar ${esc(p.nombre)} al pedido">+</button></div>`;
  }
  const itemHTML = p => `<article class="item"><div><h4>${esc(p.nombre)}</h4>${p.descripcion ? `<p>${esc(p.descripcion)}</p>` : ""}</div>${buyHTML(p)}</article>`;

  /* ---------- carrusel de burgers (3D) ---------- */
  const car = $("#car");
  car.innerHTML = C.destacadas.map(d => {
    const p = byId[d.producto];
    const bt = p.variantes.length > 1
      ? p.variantes.map(v => `<button class="var" type="button" data-add="${p.id}" data-v="${v.nombre}" aria-label="Agregar ${esc(p.nombre)} ${v.nombre} al pedido">${v.nombre} · ${money(v.precio)} +</button>`).join("")
      : `<button class="var" type="button" data-add="${p.id}" data-v="${p.variantes[0].nombre}" aria-label="Agregar ${esc(p.nombre)} al pedido">Agregar · ${money(p.variantes[0].precio)} +</button>`;
    return `<figure class="slide"><img src="${d.img}" alt="${esc(d.alt)}" width="${d.w}" height="${d.h}" loading="lazy"><figcaption>${bt}</figcaption></figure>`;
  }).join("");
  const slides = $$(".slide", car);
  const centrar = () => { car.style.paddingInline = Math.max(16, (car.clientWidth - slides[0].offsetWidth) / 2) + "px"; };
  centrar(); addEventListener("resize", centrar); slides[0].querySelector("img").addEventListener("load", () => { centrar(); efecto(); });
  let raf = 0;
  function efecto() {
    raf = 0;
    const c = car.getBoundingClientRect(), mid = c.left + c.width / 2;
    slides.forEach(s => {
      const r = s.getBoundingClientRect(), d = Math.max(-1.6, Math.min(1.6, (r.left + r.width / 2 - mid) / r.width));
      const a = Math.min(Math.abs(d), 1);
      s.style.transform = `rotateY(${-d * 22}deg) scale(${1 - a * 0.14})`;
      s.style.opacity = 1 - a * 0.45;
    });
  }
  if (!reduced) { car.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(efecto); }, { passive: true }); addEventListener("resize", efecto); efecto(); }
  const paso = dir => car.scrollBy({ left: dir * (slides[0].offsetWidth + 20), behavior: "smooth" });
  $(".car-nav.prev").onclick = () => paso(-1);
  $(".car-nav.next").onclick = () => paso(1);
  car.addEventListener("keydown", e => { if (e.key === "ArrowRight") paso(1); if (e.key === "ArrowLeft") paso(-1); });

  /* ---------- súper combo ---------- */
  const combo = C.productos.find(p => p.id === "hotdogs-super-combo-4-hot-dogs-a-eleccion-papas-fritas-coca-1-5-l");
  $("#comboPrice").textContent = money(combo.precio);
  $("#comboAdd").onclick = () => add(combo.id, "");

  /* ---------- menú: tabs, búsqueda, panel ---------- */
  const tabs = $("#tabs"), panel = $("#panel"), q = $("#q");
  let cat = C.categorias[0].id;
  tabs.innerHTML = C.categorias.map(c => `<button class="tab" role="tab" type="button" data-cat="${c.id}" aria-selected="${c.id === cat}">${esc(c.nombre)}</button>`).join("");
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  function grupos(items) {
    const subs = [...new Set(items.map(p => p.sub))];
    return subs.map(s => (s ? `<h3 class="subh">${esc(s)}</h3>` : "") + items.filter(p => p.sub === s).map(itemHTML).join("")).join("");
  }
  function render() {
    const term = norm(q.value.trim());
    $$(".tab", tabs).forEach(t => t.setAttribute("aria-selected", !term && t.dataset.cat === cat));
    if (term) {
      const res = C.productos.filter(p => norm(p.nombre + " " + (p.descripcion || "") + " " + (p.sub || "")).includes(term));
      panel.innerHTML = res.length ? C.categorias.map(c => { const l = res.filter(p => p.categoria === c.id); return l.length ? `<h3 class="group-t">${esc(c.nombre)}</h3>` + l.map(itemHTML).join("") : ""; }).join("") : `<p class="none">No encontramos "${esc(q.value)}". Probá con otra palabra o escribinos por WhatsApp.</p>`;
      return;
    }
    const c = C.categorias.find(x => x.id === cat);
    const ban = `<div class="banner">${c.banner ? `<img class="bg" src="${c.banner}" alt="" width="800" height="400" loading="lazy">` : `<img class="seal" src="${C.negocio.logo}" alt="" width="96" height="96">`}<h3>${esc(c.nombre)}</h3></div>`;
    const info = c.chips ? `<details class="more-info"><summary>${esc(c.chipsTitulo)}</summary><ul class="chips">${c.chips.map(x => `<li>${esc(x)}</li>`).join("")}</ul></details>` : "";
    panel.innerHTML = ban + (c.nota ? `<p class="nota">${esc(c.nota)}</p>` : "") + info + grupos(C.productos.filter(p => p.categoria === c.id));
  }
  function irCat(id) { cat = id; q.value = ""; render(); const t = $(`.tab[data-cat="${id}"]`, tabs); if (t) t.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" }); }
  tabs.addEventListener("click", e => { const t = e.target.closest(".tab"); if (t) { irCat(t.dataset.cat); const bar = $(".tabs-bar"); if (scrollY < $("#menu").offsetTop) $("#menu").scrollIntoView(); } });
  $$("[data-cat]:not(.tab)").forEach(a => a.addEventListener("click", () => irCat(a.dataset.cat)));
  q.addEventListener("input", render);
  render();

  /* ---------- carrito ---------- */
  const KEY = "losalamos-pedido";
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { cart = []; }
  cart = cart.filter(l => byId[l.id]);
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} };
  const envio = C.pedidos.envio;
  let toastT;
  function toast(t) { const el = $("#toast"); el.textContent = t; el.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove("show"), 1600); }

  function add(id, vname) {
    const p = byId[id], v = p.variantes ? p.variantes.find(x => x.nombre === vname) || p.variantes[0] : null;
    const key = id + (v ? "|" + v.nombre : "");
    const nombre = p.nombre + (v && p.variantes.length > 1 ? ` (${v.nombre})` : "");
    const l = cart.find(x => x.key === key);
    if (l) l.qty++; else cart.push({ key, id, nombre, precio: v ? v.precio : p.precio, qty: 1 });
    save(); pintar(); toast(`Agregado: ${nombre}`);
    const b = $("#cartBar"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
  }
  document.addEventListener("click", e => { const b = e.target.closest("[data-add]"); if (b) add(b.dataset.add, b.dataset.v); });

  const subtotal = () => cart.reduce((s, l) => s + l.precio * l.qty, 0);
  const cantidad = () => cart.reduce((s, l) => s + l.qty, 0);
  const esEnvio = () => $('#orderForm [name="entrega"]:checked').value.startsWith("Envío");

  function pintar() {
    const n = cantidad();
    $("#cartCount").hidden = !n; $("#cartCount").textContent = n;
    $("#cartBar").hidden = !n; $("#cartBarTxt").textContent = `${n} ${n === 1 ? "ítem" : "ítems"} · ${money(subtotal())}`;
    $("#waFloat").style.bottom = n ? "92px" : "";
    $("#lines").innerHTML = cart.map((l, i) => `<li class="line"><b>${esc(l.nombre)}</b><span>${money(l.precio * l.qty)}</span><div class="q"><button type="button" data-q="${i}" data-d="-1" aria-label="Quitar uno de ${esc(l.nombre)}">−</button><span>${l.qty}</span><button type="button" data-q="${i}" data-d="1" aria-label="Sumar uno de ${esc(l.nombre)}">+</button><button type="button" class="rm" data-q="${i}" data-d="x">Quitar</button></div></li>`).join("");
    $("#emptyCart").hidden = !!n; $("#orderForm").hidden = !n;
    const ent = esEnvio(), costo = ent && typeof envio.costo === "number" ? envio.costo : 0;
    $("#totals").innerHTML = `<div><span>Subtotal</span><span>${money(subtotal())}</span></div>` +
      (ent ? `<div><span>Envío</span><span>${typeof envio.costo === "number" ? money(envio.costo) : "a confirmar"}</span></div>` : "") +
      `<div class="t"><span>Total</span><span>${money(subtotal() + costo)}</span></div>`;
    $("#dirRow").hidden = !ent; $('#orderForm [name="direccion"]').required = ent;
  }
  $("#lines").addEventListener("click", e => {
    const b = e.target.closest("[data-q]"); if (!b) return;
    const i = +b.dataset.q, d = b.dataset.d;
    if (d === "x") cart.splice(i, 1); else { cart[i].qty += +d; if (cart[i].qty < 1) cart.splice(i, 1); }
    save(); pintar();
  });
  $("#pago").innerHTML = C.pedidos.formasDePago.map(f => `<option>${esc(f)}</option>`).join("");
  $$('#orderForm [name="entrega"]').forEach(r => r.addEventListener("change", pintar));

  const dlg = $("#cart");
  const abrir = () => { pintar(); pintarEstado(); dlg.showModal(); };
  $("#cartBtn").onclick = abrir; $("#cartBar").onclick = abrir;
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  $("#clearBtn").onclick = () => { cart = []; save(); pintar(); dlg.close(); };

  $("#orderForm").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target; if (!f.reportValidity()) return;
    if (subtotal() < C.pedidos.pedidoMinimo) { toast(`El pedido mínimo es ${money(C.pedidos.pedidoMinimo)}`); return; }
    const ent = esEnvio(), costo = ent && typeof envio.costo === "number" ? envio.costo : 0;
    const lineas = cart.map(l => `• ${l.qty}x ${l.nombre} — ${money(l.precio * l.qty)}`).join("\n");
    const msg = [
      "¡Hola! Quiero hacer este pedido:", lineas,
      `Total: ${money(subtotal() + costo)}${ent && typeof envio.costo !== "number" ? " (más envío a confirmar)" : ""}`,
      `Entrega: ${f.entrega.value}`, ent ? `Dirección: ${f.direccion.value.trim()}` : "",
      `Pago: ${f.pago.value}`, `Nombre: ${f.nombre.value.trim()}`, f.notas.value.trim() ? `Aclaraciones: ${f.notas.value.trim()}` : "",
    ].filter(Boolean).join("\n");
    window.open(wa(msg), "_blank", "noopener");
  });
  pintar();

  /* ---------- menú móvil ---------- */
  const bb = $("#burgerBtn");
  const cerrarNav = () => { document.body.classList.remove("nav-open"); bb.setAttribute("aria-expanded", "false"); };
  bb.onclick = () => { const o = document.body.classList.toggle("nav-open"); bb.setAttribute("aria-expanded", o); };
  $$("#nav a").forEach(a => a.addEventListener("click", cerrarNav));

  /* ---------- animaciones ---------- */
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: 0.12 });
  $$(".reveal").forEach(el => io.observe(el));
  if (!reduced) {
    const hero = $("#inicio"), cl = $("#clusterIn");
    hero.addEventListener("pointermove", e => {
      const r = hero.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      cl.style.setProperty("--ry", `${x * 26}deg`); cl.style.setProperty("--rx", `${-y * 22}deg`);
    });
    hero.addEventListener("pointerleave", () => { cl.style.setProperty("--ry", "0deg"); cl.style.setProperty("--rx", "0deg"); });
    $$(".tilt").forEach(el => {
      el.addEventListener("pointermove", e => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; el.style.transform = `perspective(700px) rotateY(${x * 18}deg) rotateX(${-y * 14}deg) scale(1.03)`; });
      el.addEventListener("pointerleave", () => (el.style.transform = ""));
    });
  }
})();
