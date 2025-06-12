   
    // Función para cargar y mostrar los posts en tabla
  function cargarPostsEnTabla() {
    fetch('https://684a4f28165d05c5d35845c2.mockapi.io/Api/Drs/BszApp/Server/Registros/Post')
      .then(res => res.json())
      .then(posts => {
        const tabla = document.querySelector('#tabla-posts tbody');
        tabla.innerHTML = ''; // Limpiar tabla actual

        posts.reverse().forEach((post, index) => {
          const fila = document.createElement('tr');

          fila.innerHTML = `
            <td>${index + 1}</td>
            <td>${post.titulo}</td>
            <td>${post.autor || 'Anónimo'}</td>
            <td><a href="${post.enlace}" target="_blank">Ver</a></td>
          `;

          tabla.appendChild(fila);
        });
      })
      .catch(err => {
        console.error('Error al cargar posts:', err);
        alert('No se pudieron cargar los posts.');
      });
  }

  // Llamar al cargar la página
  window.addEventListener('DOMContentLoaded', cargarPostsEnTabla);
  
  
  
  
document.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('user');
  const password = localStorage.getItem('password');

  if (!user || !password) {
    document.getElementById('registroModal').style.display = 'flex';
  }
});

function registrarUsuario() {
  const nick = document.getElementById('nick').value.trim();
  const pass = document.getElementById('password').value.trim();

  if (!nick || !pass) {
    alert('Por favor, ingresa un nick y una contraseña.');
    return;
  }

  fetch('https://684a4f28165d05c5d35845c2.mockapi.io/Api/Drs/BszApp/Server/Registros/User')
    .then(res => res.json())
    .then(users => {
      const existe = users.some(user => user.nick.toLowerCase() === nick.toLowerCase());
      if (existe) {
        alert('Ese nick ya está registrado. Elige otro diferente.');
        return;
      }

      return fetch('https://684a4f28165d05c5d35845c2.mockapi.io/Api/Drs/BszApp/Server/Registros/User', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nick, password: pass })
      });
    })
    .then(res => {
      if (!res) return; // ya se manejó el error
      if (!res.ok) throw new Error('Error al registrar el usuario');
      return res.json();
    })
    .then(data => {
      if (data) {
        localStorage.setItem('user', nick);
        localStorage.setItem('password', pass);
        document.getElementById('registroModal').style.display = 'none';
        alert('¡Usuario registrado con éxito! Ya puedes publicar.');
        location.reload();
      }
    })
    .catch(err => {
      console.error('Registro fallido:', err);
      alert('Error al registrar: ' + err.message);
    });
}

function iniciarSesion() {
  const nick = document.getElementById('loginNick').value.trim();
  const pass = document.getElementById('loginPassword').value.trim();

  if (!nick || !pass) {
    alert('Ingresa tu nick y contraseña para iniciar sesión.');
    return;
  }

  fetch('https://684a4f28165d05c5d35845c2.mockapi.io/Api/Drs/BszApp/Server/Registros/User')
    .then(res => res.json())
    .then(users => {
      const usuario = users.find(user => user.nick.toLowerCase() === nick.toLowerCase() && user.password === pass);
      if (usuario) {
        localStorage.setItem('user', usuario.nick);
        localStorage.setItem('password', pass);
        document.getElementById('loginModal').style.display = 'none';
        alert('¡Bienvenido de nuevo!');
        location.reload();
      } else {
        alert('Nick o contraseña incorrectos.');
      }
    })
    .catch(err => {
      console.error('Inicio de sesión fallido:', err);
      alert('Error al iniciar sesión.');
    });
}

const storedUser = localStorage.getItem('user');
if (storedUser) {
  const userInfo = document.getElementById('userInfo');
  if (userInfo) {
    userInfo.style.display = 'block';
    document.getElementById('userName').textContent = ` Hacker: ${storedUser}`;
  }
}

function cerrarSesion() {
  if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
    localStorage.removeItem('user');
    localStorage.removeItem('password');
    location.reload();
  }
}

function mostrarLogin() {
  document.getElementById('registroModal').style.display = 'none';
  document.getElementById('loginModal').style.display = 'flex';
}

function mostrarRegistro() {
  document.getElementById('loginModal').style.display = 'none';
  document.getElementById('registroModal').style.display = 'flex';
}

 function mostrarSeccion(id) {
  const secciones = document.querySelectorAll('section');
  secciones.forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

 document.getElementById('postForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postText').value.trim();
    const nick = localStorage.getItem('user'); // ← Obtener el nick almacenado

    if (!title || !content) {
      alert('Por favor, completa el título y el contenido.');
      return;
    }

    if (!nick) {
      alert('No has iniciado sesión. Inicia sesión para publicar.');
      return;
    }

    const jsonBinData = { postName: title, text: content };
    console.log("Datos para enviar a JSONBin:", jsonBinData);

    fetch('https://api.jsonbin.io/v3/b', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': '$2a$10$Al57CaO1OAXh9z.EJuL3eeETnbAqmeMcWy/Zv4LXlOKwuHRBJYXpG'
      },
      body: JSON.stringify(jsonBinData)
    })
    .then(response => {
      console.log("Respuesta de JSONBin status:", response.status);
      return response.json();
    })
    .then(data => {
      console.log("Respuesta de JSONBin:", data);

      const binId = data.metadata.id;
      const shareLink = `${window.location.href}?id=${binId}`;
      console.log("Enlace generado:", shareLink);

      document.getElementById('generated-link').value = shareLink;
      document.getElementById('link-container').style.display = 'block';

      const mockApiData = {
        titulo: title,
        contenido: content,
        enlace: shareLink,
        autor: nick // ← Agregar el nick como autor
      };
      console.log("Datos para enviar a MockAPI:", mockApiData);

      return fetch('https://684a4f28165d05c5d35845c2.mockapi.io/Api/Drs/BszApp/Server/Registros/Post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockApiData)
      });
    })
    .then(response => {
      console.log("Respuesta de MockAPI status:", response.status);
      if (!response.ok) {
        throw new Error('Error al guardar en la API de registros');
      }
      return response.json();
    })
    .then(saved => {
      console.log("Datos guardados en MockAPI:", saved);
      alert('Post publicado con éxito.');
      document.getElementById('postForm').reset();
    })
    .catch(error => {
      console.error('Error:', error);
      alert(error.message);
    });
  });

  // Copiar link
  document.getElementById('copy-button').addEventListener('click', function () {
    const input = document.getElementById('generated-link');
    input.select();
    input.setSelectionRange(0, 99999);
    document.execCommand('copy');
    alert('Enlace copiado: ' + input.value);
  });
