const API_URL = "http://127.0.0.1:3000";



const site = {
  logo: "🌿 Trilhas & Serras",
  nav: [
  { label: "Início",    href: "index.html" },
  { label: "Destinos",  href: "index.html#destinos" },
  { label: "Dashboard", href: "dashboard.html" },
  { label: "Sobre",     href: "index.html#sobre" },
  { label: "Contato",   href: "index.html#contato" }
],
  responsavel: {
    nome:      "Ana Ayla Pires Reis",
    matricula: "919036",
    curso:     "Engenharia de software — PUC Minas",
    descricao: "Decidi criar o site de trilhas para juntar em um só lugar as melhores rotas da região de forma fácil e confiável. A ideia é ajudar as pessoas que gostam da natureza a planejar a próxima aventura sem complicação, incentivando todo mundo a sair da rotina, praticar esportes ao ar livre e valorizar o turismo ecológico.",
    foto:      "https://cdn-icons-png.flaticon.com/256/17/17004.png"
  }
};


function badge(dificuldade) {
  var cores = {
    "Fácil":           "success",
    "Moderada":        "warning",
    "Difícil":         "danger",
    "Fácil a Moderada":"info"
  };
  return cores[dificuldade] || "secondary";
}


function renderNav() {
  var header = document.getElementById("site-header");
  if (!header) return;

  header.innerHTML =
    '<nav class="navbar navbar-expand-md navbar-dark bg-success px-3">' +
    '<a class="navbar-brand fw-bold fs-4" href="index.html">' + site.logo + '</a>' +
    '<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">' +
    '<span class="navbar-toggler-icon"></span>' +
    '</button>' +
    '<div class="collapse navbar-collapse" id="navMenu">' +
    '<ul class="navbar-nav ms-auto">' +
    site.nav.map(function (item) {
      return '<li class="nav-item"><a class="nav-link" href="' + item.href + '">' + item.label + '</a></li>';
    }).join("") +
    '</ul>' +
    '</div>' +
    '</nav>';
}


function renderResponsavel() {
  var el = document.getElementById("sobre-responsavel");
  if (!el) return;
  var r = site.responsavel;

  el.innerHTML =
    '<div class="row align-items-center g-4">' +
    '<div class="col-12 col-md-3 text-center">' +
    '<img src="' + r.foto + '" alt="' + r.nome + '" class="foto-responsavel rounded-circle" style="width:200px;height:200px;object-fit:cover;object-position:center top;border-radius:37%!important;">' +
    '</div>' +
    '<div class="col-12 col-md-9">' +
    '<h4 class="fw-bold text-success">' + r.nome + '</h4>' +
    '<p class="text-muted mb-1"><strong>Matrícula:</strong> ' + r.matricula + '</p>' +
    '<p class="text-muted mb-2"><strong>Curso:</strong> ' + r.curso + '</p>' +
    '<p>' + r.descricao + '</p>' +
    '</div>' +
    '</div>';
}



/**
 * Busca todos os destinos no JSON Server.
 * @returns {Promise<Array>} Array de destinos
 */
async function fetchItems() {
  const response = await fetch(API_URL + "/destinos");
  if (!response.ok) {
    throw new Error("Erro ao buscar destinos: " + response.status);
  }
  return response.json();
}

/**
 * Cria e retorna o elemento HTML de um card de destino.
 * @param {Object} d - Objeto do destino
 * @returns {HTMLElement} Coluna Bootstrap com o card
 */
function createCard(d) {
  var col = document.createElement("div");
  col.classList.add("col-12", "col-sm-6", "col-lg-4");

  col.innerHTML =
    '<div class="card h-100 shadow-sm card-trilha" style="border-radius:24px!important;overflow:hidden;">' +
    '<div class="card-img-container">' +
    '<img src="' + d.imagem + '" class="card-img-top" alt="' + d.nome + '" loading="lazy" style="height:250px!important;object-fit:cover;object-position:center top;">' +
    '<span class="badge bg-' + badge(d.dificuldade) + ' badge-dif" style="position:absolute;top:10px;left:10px;">' + d.dificuldade + '</span>' +
    '</div>' +
    '<div class="card-body d-flex flex-column">' +
    '<h5 class="card-title fw-bold">' + d.nome + '</h5>' +
    '<p class="card-text text-muted small flex-grow-1">' + d.descricaoCurta + '</p>' +
    '<div class="info-pills mt-2" style="display:flex;flex-direction:column;gap:6px;">' +
    '<span class="pill">📍 ' + d.estado + '</span>' +
    '<span class="pill">⛰️ ' + d.altitude + '</span>' +
    '<span class="pill">🕐 ' + d.duracao + '</span>' +
    '</div>' +
    '<a href="detalhes.html?id=' + d.id + '" class="btn btn-success btn-sm mt-3">Ver detalhes</a>' +
    '</div>' +
    '</div>';

  return col;
}

/**
 * Limpa o grid e renderiza os cards a partir do array de itens.
 * @param {Array} items - Array de destinos
 */
function renderCards(items) {
  var el = document.getElementById("destinos-grid");
  if (!el) return;

  el.innerHTML = "";
  items.forEach(function (d) {
    el.appendChild(createCard(d));
  });
}

/**
 * Renderiza o carrossel com os destinos recebidos.
 * @param {Array} items - Array de destinos
 */
function renderCarrossel(items) {
  var el = document.getElementById("carrossel");
  if (!el) return;

  var indicators = items.map(function (d, i) {
    return '<button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="' + i + '"' +
      (i === 0 ? ' class="active" aria-current="true"' : '') +
      ' aria-label="' + d.nome + '"></button>';
  }).join("");

  var slides = items.map(function (d, i) {
    return '<div class="carousel-item' + (i === 0 ? " active" : "") + '">' +
      '<img src="' + d.imagem + '" class="d-block w-100 carousel-img" alt="' + d.nome + '" style="height:440px!important;object-fit:cover;">' +
      '<div class="carousel-caption d-block">' +
      '<h2 class="fw-bold">' + d.nome + '</h2>' +
      '<p class="d-none d-md-block">' + d.descricaoCurta + '</p>' +
      '<a href="detalhes.html?id=' + d.id + '" class="btn btn-success btn-sm mt-1">Ver detalhes →</a>' +
      '</div>' +
      '</div>';
  }).join("");

  el.innerHTML =
    '<div id="heroCarousel" class="carousel slide" data-bs-ride="carousel">' +
    '<div class="carousel-indicators">' + indicators + '</div>' +
    '<div class="carousel-inner">' + slides + '</div>' +
    '<button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">' +
    '<span class="carousel-control-prev-icon"></span><span class="visually-hidden">Anterior</span>' +
    '</button>' +
    '<button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">' +
    '<span class="carousel-control-next-icon"></span><span class="visually-hidden">Próximo</span>' +
    '</button>' +
    '</div>';
}


async function init() {
  var grid = document.getElementById("destinos-grid");
  if (!grid) return; // não está na Home

  grid.innerHTML = '<div class="col-12 text-center py-5"><div class="spinner-border text-success" role="status"></div><p class="mt-2 text-muted">Carregando destinos...</p></div>';

  try {
    var items = await fetchItems();
    renderCarrossel(items);
    renderCards(items);
  } catch (err) {
    grid.innerHTML =
      '<div class="col-12 text-center py-5">' +
      '<h5 class="text-danger">⚠️ Não foi possível carregar os destinos.</h5>' +
      '<p class="text-muted">Verifique se o JSON Server está rodando em <code>' + API_URL + '</code>.</p>' +
      '</div>';
  }
}



/**
 * Busca um destino específico pelo id no JSON Server.
 * @param {string|number} id
 * @returns {Promise<Object>} Objeto do destino
 */
async function fetchItemById(id) {
  const response = await fetch(API_URL + "/destinos/" + id);
  if (!response.ok) {
    throw new Error("Destino não encontrado");
  }
  return response.json();
}


async function initDetalhes() {
  var container = document.getElementById("detalhe-container");
  if (!container) return; // não está na página de detalhes

  
  var params = new URLSearchParams(window.location.search);
  var id = params.get("id");


  if (!id) {
    container.innerHTML =
      '<div class="text-center py-5">' +
      '<h2 class="text-danger">⚠️ Nenhum destino selecionado.</h2>' +
      '<p class="text-muted">Acesse um destino a partir da página inicial.</p>' +
      '<a href="index.html" class="btn btn-success mt-3">← Voltar ao início</a>' +
      '</div>';
    return;
  }


  container.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-success" role="status"></div><p class="mt-2 text-muted">Carregando destino...</p></div>';

  try {
    
    var destino = await fetchItemById(id);

    document.title = destino.nome + " — Trilhas & Serras";

    
    var tagsHTML = (destino.tags || []).map(function (tag) {
      return '<span class="badge bg-success me-1 mb-1">' + tag + '</span>';
    }).join("");

   
    var fotosHTML = (destino.fotos || []).map(function (foto) {
      return '<div class="col-12 col-sm-6 col-md-4">' +
        '<div class="foto-card">' +
        '<img src="' + foto.url + '" alt="' + foto.titulo + '" class="img-fluid rounded-3" loading="lazy" style="height:220px!important;width:100%;object-fit:cover;">' +
        '<p class="foto-titulo mt-2 text-center">' + foto.titulo + '</p>' +
        '</div>' +
        '</div>';
    }).join("");

    
    container.innerHTML =
      '<section class="detalhe-hero mb-5">' +
      '<div class="row g-4 align-items-start">' +

      '<div class="col-12 col-md-6">' +
      '<div class="detalhe-img-wrap">' +
      '<img src="' + destino.imagem + '" alt="' + destino.nome + '" class="img-fluid rounded-4 shadow">' +
      '</div>' +
      '</div>' +

      '<div class="col-12 col-md-6">' +
      '<span class="badge bg-' + badge(destino.dificuldade) + ' mb-2">' + destino.dificuldade + '</span>' +
      '<h1 class="fw-bold display-6 mb-1">' + destino.nome + '</h1>' +
      '<p class="text-muted mb-3"><strong>Categoria:</strong> ' + destino.categoria + '</p>' +
      '<p class="lead text-muted mb-4">' + destino.descricaoCompleta + '</p>' +

      '<div class="info-grid mb-3">' +
      '<div class="info-item"><span class="info-label">📍 Estado</span><span class="info-val">' + destino.estado + '</span></div>' +
      '<div class="info-item"><span class="info-label">⛰️ Altitude</span><span class="info-val">' + destino.altitude + '</span></div>' +
      '<div class="info-item"><span class="info-label">📏 Distância</span><span class="info-val">' + destino.distancia + '</span></div>' +
      '<div class="info-item"><span class="info-label">🕐 Duração</span><span class="info-val">' + destino.duracao + '</span></div>' +
      '<div class="info-item"><span class="info-label">☀️ Melhor época</span><span class="info-val">' + destino.melhorEpoca + '</span></div>' +
      '</div>' +

      '<div class="mb-4"><strong class="d-block mb-2">🏷️ Tags:</strong>' + tagsHTML + '</div>' +

      '<a href="index.html" class="btn btn-outline-success">← Voltar ao catálogo</a>' +
      '</div>' +

      '</div>' +
      '</section>' +

      '<section class="fotos-section">' +
      '<h2 class="fw-bold mb-4">📸 Fotos do destino</h2>' +
      '<div class="row g-3">' + fotosHTML + '</div>' +
      '</section>';

  } catch (err) {
   
    container.innerHTML =
      '<div class="text-center py-5">' +
      '<h2 class="text-danger">⚠️ Destino não encontrado.</h2>' +
      '<p class="text-muted">O destino com id <strong>' + id + '</strong> não existe ou foi removido.</p>' +
      '<a href="index.html" class="btn btn-success mt-3">← Voltar ao início</a>' +
      '</div>';
  }
}


renderNav();
renderResponsavel();
init();          
initDetalhes();   