//const API_URL = 'http://localhost:8080/books';
// Cambia esto al principio de tu script.js
const API_URL = '/books';
const bookModal = new bootstrap.Modal(document.getElementById('bookModal'));
let isEdit = false;

// Cargar libros al iniciar
document.addEventListener('DOMContentLoaded', fetchBooks);

async function fetchBooks() {
    const response = await fetch(API_URL);
    const books = await response.json();
    const tbody = document.getElementById('booksTableBody');
    tbody.innerHTML = '';

    books.forEach(book => {
        tbody.innerHTML += `
                <tr>
                    <td>${book.id}</td>
                    <td><img src="${book.imageUrl || 'https://via.placeholder.com/50'}" class="book-img"></td>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>$${book.price.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="editBook(${book.id}, '${book.title}', '${book.author}', ${book.price}, '${book.imageUrl}')">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteBook(${book.id})">Borrar</button>
                    </td>
                </tr>
            `;
    });
    // ACTUALIZACIÓN: Llamamos al gráfico con los datos frescos
    updateChart(books);
}
/** 
        // Guardar (Crear o Editar)
        document.getElementById('bookForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('bookId').value;
            const bookData = {
                title: document.getElementById('title').value,
                author: document.getElementById('author').value,
                price: parseFloat(document.getElementById('price').value),
                imageUrl: document.getElementById('imageUrl').value
            };
	
            const url = isEdit ? `${API_URL}/${id}` : API_URL;
            const method = isEdit ? 'PUT' : 'POST';
	
            await fetch(url, {
                method: method,
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(bookData)
            });
	
            bookModal.hide();
            fetchBooks();
	
            // Notificación rápida tipo Toast
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: isEdit ? 'Libro actualizado' : 'Libro creado',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
        });
        */
/** 
// Guardar (Crear o Editar)
document.getElementById('bookForm').addEventListener('submit', async (e) => {
e.preventDefault();

const id = document.getElementById('bookId').value;
const bookData = {
title: document.getElementById('title').value,
author: document.getElementById('author').value,
price: parseFloat(document.getElementById('price').value),
imageUrl: document.getElementById('imageUrl').value
};

const url = isEdit ? `${API_URL}/${id}` : API_URL;
const method = isEdit ? 'PUT' : 'POST';

try {
const response = await fetch(url, {
    method: method,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(bookData)
});

if (response.ok) {
    // 1. Cerramos el modal
    bookModal.hide();

    // 2. Refrescamos la tabla automáticamente
    await fetchBooks();

    // 3. Mostramos notificación de éxito
    Swal.fire({
        icon: 'success',
        title: isEdit ? '¡Actualizado!' : '¡Creado!',
        text: `el libro se ha ${isEdit ? 'actualizado' : 'creado'} correctamente`,
        timer: 2000,
        showConfirmButton: false
    });
} else {
    throw new Error('Error en la respuesta del servidor');
}
} catch (error) {
Swal.fire('Error', 'No se pudo guardar el libro', 'error');
}
});
*/
// GUARDAR (CREAR O EDITAR)
document.getElementById('bookForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const rawId = document.getElementById('bookId').value;

    // Creamos el objeto sin ID inicialmente
    const bookData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        price: parseFloat(document.getElementById('price').value),
        imageUrl: document.getElementById('imageUrl').value
    };

    // Si es edición, le ponemos el ID
    if (isEdit) bookData.id = parseInt(rawId);

    const url = isEdit ? `${API_URL}/${rawId}` : API_URL;
    const method = isEdit ? 'PUT' : 'POST';
    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });

        if (response.ok) {
            bookModal.hide();
            fetchBooks();
            Swal.fire('¡Éxito!', isEdit ? 'Libro actualizado' : 'Libro creado', 'success');

        } else if (response.status === 403) {
            // AQUÍ MANEJAMOS EL ERROR PARA FILIP
            bookModal.hide(); // Cerramos el modal para que vea el aviso
            Swal.fire({
                icon: 'error',
                title: 'Acceso Denegado',
                text: 'Lo sentimos, no tienes permisos para modificar o crear libros. Solo el administrador puede hacerlo.',
                confirmButtonColor: '#d33'
            });
        } else {
            Swal.fire('Error', 'Hubo un problema con el servidor', 'error');
        }
    } catch (error) {
        console.error("Error:", error);
        Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    }
});

function showCreateModal() {
    isEdit = false;
    document.getElementById('bookForm').reset();
    document.getElementById('modalTitle').innerText = 'Nuevo Libro';
    bookModal.show();
}

function editBook(id, title, author, price, imageUrl) {
    isEdit = true;
    document.getElementById('bookId').value = id;
    document.getElementById('title').value = title;
    document.getElementById('author').value = author;
    document.getElementById('price').value = price;
    document.getElementById('imageUrl').value = imageUrl;
    document.getElementById('modalTitle').innerText = 'Editar Libro';
    bookModal.show();
}
async function deleteBook(id) {
    // Configuramos la alerta de confirmación
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, bórralo',
        cancelButtonText: 'Cancelar',
        // Estilo compatible con Bootswatch Morph
        customClass: {
            popup: 'rounded-4 shadow'
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                // Realizamos la petición DELETE
                const response = await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: id }) // Enviamos el objeto solicitado por tu API
                });

                if (response.ok) {
                    Swal.fire(
                        '¡Eliminado!',
                        'El libro ha sido borrado con éxito.',
                        'success'
                    );
                    fetchBooks(); // Recargamos la tabla
                } else if (response.status === 403) {
                    // ESTA ES LA CLAVE: Capturamos el bloqueo de Spring
                    Swal.fire('Acceso Denegado', 'Solo el usuario "moha" tiene permisos para borrar libros.', 'error');
                } else {
                    Swal.fire('Error', 'No se pudo eliminar el libro.', 'error');
                }
            } catch (error) {
                Swal.fire(
                    'Error',
                    'No se pudo eliminar el libro.',
                    'error'
                );
            }
        }
    });
}
/**
    async function deleteBook(id) {
        if(confirm('¿Seguro que deseas eliminar este libro?')) {
            // Nota: Enviamos un cuerpo vacío ya que tu @DeleteMapping lo requiere por el @RequestBody
            await fetch(`${API_URL}/${id}`, { 
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({id: id}) 
            });
            fetchBooks();
        }
    }
    */

function filterBooks() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#booksTableBody tr');

    rows.forEach(row => {
        // Extraemos los textos de las celdas
        const title = row.cells[2].textContent.toLowerCase();
        const author = row.cells[3].textContent.toLowerCase();
        const price = row.cells[4].textContent.toLowerCase(); // Nueva línea para el precio

        // Verificamos si la consulta está en el título, autor O precio
        if (title.includes(query) || author.includes(query) || price.includes(query)) {
            row.style.display = '';
            row.classList.add('fadeIn');
        } else {
            row.style.display = 'none';
            row.classList.remove('fadeIn');
        }
    });
}

async function logout() {
    const result = await Swal.fire({
        title: '¿Cerrar sesión?',
        text: "Tendrás que volver a ingresar tus credenciales.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        // Creamos un formulario dinámico para hacer el POST a /logout
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/logout';
        document.body.appendChild(form);
        form.submit();
    }
}

let myChart; // Variable global para guardar la instancia del gráfico
/** 
        function updateChart(books) {
            const ctx = document.getElementById('booksChart').getContext('2d');
	
            // Si el gráfico ya existe, lo destruimos para crearlo de nuevo con datos frescos
            if (myChart) {
                myChart.destroy();
            }
	
            // Extraemos los títulos y los precios
            const labels = books.map(book => book.title);
            const prices = books.map(book => book.price);
	
            myChart = new Chart(ctx, {
                type: 'bar', // Tipo de gráfico: barras
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Precio por Libro (€)',
                        data: prices,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        borderRadius: 10 // Bordes redondeados para estilo Morph
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    	
        */
function updateChart(books) {
    const ctx = document.getElementById('booksChart').getContext('2d');

    if (myChart) {
        myChart.destroy();
    }

    const labels = books.map(book => book.title);
    const prices = books.map(book => book.price);

    // Generamos una paleta de colores dinámicos
    const backgroundColors = [
        'rgba(255, 99, 132, 0.7)',  // Rosa
        'rgba(54, 162, 235, 0.7)',  // Azul
        'rgba(255, 206, 86, 0.7)',  // Amarillo
        'rgba(75, 192, 192, 0.7)',  // Verde agua
        'rgba(153, 102, 255, 0.7)', // Morado
        'rgba(255, 159, 64, 0.7)',  // Naranja
        'rgba(199, 199, 199, 0.7)'  // Gris
    ];

    myChart = new Chart(ctx, {
        type: 'pie', // CAMBIO: Tipo tarta
        data: {
            labels: labels,
            datasets: [{
                label: 'Precio (€)',
                data: prices,
                backgroundColor: backgroundColors, // Usamos el array de colores
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom', // Colocamos la leyenda debajo
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        // Añadimos el símbolo € al pasar el ratón
                        label: function(context) {
                            return ` ${context.label}: ${context.raw}€`;
                        }
                    }
                }
            }
        }
    });
}

function exportToPDF1() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // 1. Configuración del encabezado
    doc.setFontSize(18);
    doc.text("Reporte de Inventario de Libros", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 28);

    // 2. Definir las columnas manualmente para tener control total
    // Ignoramos la columna 1 (Portada) y la 5 (Acciones) del HTML original
    const head = [['ID', 'Título', 'Autor', 'Precio', 'URL Portada']];

    // 3. Extraer los datos de las filas de la tabla HTML
    const tableBody = [];
    const rows = document.querySelectorAll('#booksTableBody tr');

    rows.forEach(row => {
        const imgUrl = row.cells[1].querySelector('img').src;
        const rowData = [
            row.cells[0].innerText, // ID
            row.cells[2].innerText, // Título
            row.cells[3].innerText, // Autor
            row.cells[4].innerText,  // Precio (ya trae el $ del HTML)
            imgUrl // Añadimos la URL al final
        ];
        tableBody.push(rowData);
    });

    // 4. Generar la tabla en el PDF
    doc.autoTable({
        startY: 35,
        head: head,
        body: tableBody,
        theme: 'striped', // Estilo de filas alternas
        headStyles: { fillColor: [52, 73, 94] }, // Color oscuro para el encabezado
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
            0: { cellWidth: 20 }, // ID más estrecho
            3: { halign: 'right' } // Alinear precio a la derecha
        }
    });

    // 5. Guardar el archivo
    doc.save(`Reporte_Libros_${new Date().getTime()}.pdf`);
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('l', 'mm', 'a4'); // 'l' cambia la orientación a Horizontal (Landscape) para más espacio

    // 1. Encabezado
    doc.setFontSize(18);
    doc.text("Reporte de Inventario de Libros", 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 28);

    const head = [['ID', 'Título', 'Autor', 'Precio', 'URL Portada']];
    const tableBody = [];
    const rows = document.querySelectorAll('#booksTableBody tr');

    rows.forEach(row => {
        const imgUrl = row.cells[1].querySelector('img').src;
        tableBody.push([
            row.cells[0].innerText,
            row.cells[2].innerText,
            row.cells[3].innerText,
            row.cells[4].innerText,
            imgUrl
        ]);
    });

    // 2. Generar tabla con anchos fijos
    doc.autoTable({
        startY: 35,
        head: head,
        body: tableBody,
        theme: 'striped',
        styles: {
            fontSize: 9,
            cellPadding: 2,
            overflow: 'linebreak' // Permite saltos de línea controlados
        },
        headStyles: { fillColor: [52, 73, 94] },
        columnStyles: {
            0: { cellWidth: 10 }, // ID estrecho
            1: { cellWidth: 50 }, // Título
            2: { cellWidth: 40 }, // Autor
            3: { cellWidth: 20, halign: 'right' }, // Precio
            4: {
                cellWidth: 100,
                fontSize: 7,
                overflow: 'ellipsize' // Si la URL es muy larga, pone "..." al final en lugar de romper la fila
            }
        }
    });

    doc.save(`Reporte_Libros_${new Date().getTime()}.pdf`);
}

function exportToExcel() {
    // 1. Obtener la tabla de HTML
    const table = document.getElementById("booksTableBody");
    const rows = table.querySelectorAll("tr");

    // 2. Crear un array de datos con encabezados
    const data = [
        ["ID", "Portada (URL)", "Título", "Autor", "Precio"]
    ];

    // 3. Recorrer las filas y extraer los textos
    rows.forEach(row => {
        // Extraemos la URL de la imagen del atributo src
        const imgUrl = row.cells[1].querySelector('img').src;

        const rowData = [
            row.cells[0].innerText, // ID
            imgUrl, // URL de la imagen
            row.cells[2].innerText, // Título
            row.cells[3].innerText, // Autor
            // Quitamos el $ y convertimos a número para que Excel pueda sumar
            parseFloat(row.cells[4].innerText.replace('$', ''))
        ];
        data.push(rowData);
    });

    // 4. Crear el libro de Excel (Workbook)
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    // 5. Añadir la hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, "Inventario de Libros");

    // 6. Descargar el archivo
    XLSX.writeFile(wb, `Reporte_Libros_${new Date().getTime()}.xlsx`);
}
