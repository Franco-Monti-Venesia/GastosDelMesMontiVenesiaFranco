class ItemCarrito {
    constructor(nombre, precio, cantidad, categoria) {
        // Validaciones para evitar agregar datos incorrectos
        if (!nombre || typeof nombre !== "string") throw new Error("Nombre inválido.");
        if (precio <= 0 || typeof precio !== "number") throw new Error("Precio inválido.");
        if (cantidad <= 0 || !Number.isInteger(cantidad)) throw new Error("Cantidad inválida.");
        if (!categoria || typeof categoria !== "string") throw new Error("Categoría inválida.");
        
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = cantidad;
        this.categoria = categoria;
    }
}

// Inicializar variables y recuperar datos de localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
const form = document.getElementById("producto__form");
const cartaItems = document.getElementById("carta__items");
const cartaTotal = document.getElementById("carta__total");
const limpiarCarritoBtn = document.getElementById("limpiar__carrito");
const buscador = document.getElementById("buscador");
const toggleTema = document.getElementById("toggle-tema");
const temaIcono = document.getElementById("tema-icono");

// Elemento para mostrar mensajes de error
const mensajeError = document.createElement("p");
mensajeError.id = "mensaje-error";
mensajeError.style.color = "red";
form.appendChild(mensajeError);

// Verificar si el tema oscuro estaba activo
if (localStorage.getItem("tema") === "dark") {
    document.body.classList.add("dark-mode");
    temaIcono.textContent = "dark_mode"; // Cambiar al ícono de modo oscuro
}

// Cambiar tema
toggleTema.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const esOscuro = document.body.classList.contains("dark-mode");
    temaIcono.textContent = esOscuro ? "dark_mode" : "light_mode"; // Cambiar ícono
    localStorage.setItem("tema", esOscuro ? "dark" : "light"); // Guardar el tema en localStorage
});

// Función para actualizar la vista del carrito
const actualizarCarrito = () => {
    cartaItems.innerHTML = "";
    let total = 0;

    carrito.forEach(({ nombre, precio, cantidad, categoria }) => {
        const li = document.createElement("li");
        li.textContent = `[${categoria}] ${nombre}: $${precio.toFixed(2)} x ${cantidad} = $${(precio * cantidad).toFixed(2)}`;
        total += precio * cantidad;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.classList.add("borrar__btn");
        deleteButton.onclick = () => {
            carrito = carrito.filter(item => item.nombre !== nombre);
            guardarCarrito();
            actualizarCarrito();
        };

        li.appendChild(deleteButton);
        cartaItems.appendChild(li);
    });

    cartaTotal.textContent = `Total: $${total.toFixed(2)}`;
    guardarCarrito();
};

// Guardar el carrito en localStorage
const guardarCarrito = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
};

// Limpiar el carrito
limpiarCarritoBtn.addEventListener("click", () => {
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
});

// Buscador dinámico
buscador.addEventListener("input", (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrados = carrito.filter(item => item.nombre.toLowerCase().includes(texto));
    cartaItems.innerHTML = "";
    filtrados.forEach(({ nombre, precio, cantidad, categoria }) => {
        const li = document.createElement("li");
        li.textContent = `[${categoria}] ${nombre}: $${precio.toFixed(2)} x ${cantidad} = $${(precio * cantidad).toFixed(2)}`;
        cartaItems.appendChild(li);
    });
});

// Agregar productos al carrito
form.addEventListener("submit", (event) => {
    event.preventDefault();
    
    // Recoger los valores del formulario
    const nombre = document.getElementById("producto__nombre").value.trim();
    const precio = parseFloat(document.getElementById("producto__precio").value) || 0;
    const cantidad = parseInt(document.getElementById("producto__cantidad").value, 10) || 0;
    const categoria = document.getElementById("producto__categoria").value || "Sin Categoría";

    try {
        // Comprobar si el producto ya existe en el carrito
        const productoExistente = carrito.find(item => item.nombre === nombre);
        
        if (productoExistente) {
            productoExistente.cantidad += cantidad;
        } else {
            carrito.push(new ItemCarrito(nombre, precio, cantidad, categoria));
        }

        // Limpiar mensajes de error
        mensajeError.textContent = "";

        actualizarCarrito();
        form.reset();
    } catch (error) {
        mensajeError.textContent = error.message; // Mostrar mensaje en el DOM
    }
});

// Actualizar la vista inicial
actualizarCarrito();
