const searchInput = document.querySelector(".search");
const menuLinks = Array.from(document.querySelectorAll(".menu-link"));
const mobileMenu = document.querySelector(".mobile-menu");
const content = document.querySelector("#content");
const empresaContent = content?.innerHTML || "";

const titles = {
  empresa: {
    title: "Manual de Uso do Gestor3D",
    subtitle: "Rotinas operacionais organizadas por módulo."
  },
  clientes: {
    title: "Cadastro de Clientes",
    subtitle: "Como cadastrar contatos, documentos, endereço e status do cliente."
  },
  categorias: {
    title: "Cadastro de Categorias",
    subtitle: "Como agrupar produtos para organização e relatórios."
  },
  usuarios: {
    title: "Cadastro de Usuários",
    subtitle: "Como criar acessos, perfis e controlar usuários ativos."
  },
  marketplaces: {
    title: "Cadastro de Marketplaces",
    subtitle: "Como configurar canais de venda e taxas comerciais."
  },
  impressoras: {
    title: "Cadastro de Impressoras",
    subtitle: "Como cadastrar máquinas, custos por hora e dados operacionais."
  },
  materiais: {
    title: "Cadastro de Materiais",
    subtitle: "Como cadastrar insumos, unidades, estoque mínimo e material imprimível."
  },
  fornecedores: {
    title: "Cadastro de Fornecedores",
    subtitle: "Como cadastrar fornecedores, contatos e lead time de reposição."
  }
};

function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function filterMenu(term) {
  const query = normalizeText(term.trim());

  menuLinks.forEach((link) => {
    const label = normalizeText(link.textContent || "");
    const visible = !query || label.includes(query);
    link.style.display = visible ? "flex" : "none";
  });
}

searchInput?.addEventListener("input", (event) => {
  filterMenu(event.target.value);
});

mobileMenu?.addEventListener("change", () => {
  navigateTo(mobileMenu.value);
});

function setTopbar(route) {
  const data = titles[route] || titles.empresa;
  const title = document.querySelector(".topbar h1");
  const subtitle = document.querySelector(".topbar p");
  if (title) title.textContent = data.title;
  if (subtitle) subtitle.textContent = data.subtitle;
}

function setActiveMenu(route) {
  menuLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.route === route);
  });
  if (mobileMenu) mobileMenu.value = route;
}

function renderRoute(route) {
  if (!content) return;

  if (route === "empresa") {
    content.innerHTML = empresaContent;
  } else {
    const template = document.querySelector(`#template-${route}`);
    if (!template) return;
    content.innerHTML = template.innerHTML;
  }

  setTopbar(route);
  setActiveMenu(route);
  window.location.hash = route;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function navigateTo(route) {
  if (!route || !titles[route]) return;
  renderRoute(route);
}

document.querySelectorAll("[data-route]").forEach((item) => {
  item.addEventListener("click", () => navigateTo(item.dataset.route));
});

const initialRoute = window.location.hash.replace("#", "");
if (initialRoute && titles[initialRoute]) {
  renderRoute(initialRoute);
}
