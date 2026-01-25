/** 
        document.getElementById('registroForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                username: document.getElementById('regUsername').value,
                password: document.getElementById('regPassword').value
            };

            const response = await fetch('/api/usuarios/registrar', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });

            if (response.ok) {
                Swal.fire('¡Éxito!', 'Usuario creado. Ahora puedes loguearte.', 'success')
                    .then(() => window.location.href = '/login.html');
            } else {
                Swal.fire('Error', 'El usuario ya existe o hubo un problema.', 'error');
            }
        });*/

document.getElementById('registroForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        username: document.getElementById('regUsername').value,
        password: document.getElementById('regPassword').value
    };

    try {
        const response = await fetch('/api/usuarios/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            Swal.fire('¡Éxito!', 'Usuario creado correctamente.', 'success')
                .then(() => window.location.href = '/login.html');
        } else {
            // Aquí capturamos el mensaje "El nombre de usuario ya está en uso"
            const errorMsg = await response.text();
            Swal.fire('Atención', errorMsg, 'warning');
        }
    } catch (error) {
        Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    }
});