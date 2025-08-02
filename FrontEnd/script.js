const urlGetAllUsers = 'https://localhost:7071/Users';
const urlGetUserById = `https://localhost:7071/User/`;
const urlPost = 'https://localhost:7071/User/';
const urlPut = 'https://localhost:7071/User';
const urlDelete = 'https://localhost:7071/User/Delete/';

let id;
let name;
let userName;
let email;

function addUserHtml(trechoHtml, id, name, userName, email) {
    return trechoHtml.innerHTML += `
        <tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${userName}</td>
            <td>${email}</td>
        </tr>
        `
}

let btnGetAllUsers = document.querySelector('#obterTodosUsuarios');

let usuariosObtidos = document.getElementById('usuariosObtidos');

let tabelaUsuarios = document.getElementById('usuarios');

btnGetAllUsers.addEventListener('click', async (event) => {
    event.preventDefault();
    tabelaUsuarios.innerHTML = '';

    const response = await fetch(urlGetAllUsers);
    const usuarios = await response.json();
    usuariosObtidos.hidden = false;
    usuarios.forEach(result => {
        id = result.id;
        name = result.name;
        userName = result.username;
        email = result.email;
        addUserHtml(tabelaUsuarios, id, name, userName, email)
    });
});

let btnGetUserById = document.querySelector('#obterUsuarioPorId');

let inputIdUsuario = document.getElementById('inputId');
let usuarioObtido = document.getElementById('usuarioObtido');

let tabelaUsuario = document.getElementById('usuario');
let mensagemErroPorId = document.getElementById('mensagemErroPorId');
let cabecalhoUsuarioPorId = document.getElementById('cabecalhoUsuarioPorId');

btnGetUserById.addEventListener('click', async (event) => {
    event.preventDefault();
    tabelaUsuario.innerHTML = '';
    mensagemErroPorId.innerHTML = '';
    cabecalhoUsuarioPorId.style.display = 'block';

    if (inputIdUsuario.value === '') {
        usuarioObtido.hidden = false;
        mensagemErroPorId.innerHTML += `
            <div>
                <h2>Erro!</h2>
                <p>Informe o ID.</p>
            </div>`
        cabecalhoUsuarioPorId.style.display = 'none';
    } else {
        const response = await fetch(urlGetUserById + inputIdUsuario.value);
        if (response.ok == true) {
            const usuario = await response.json();
            usuarioObtido.hidden = false;
            id = usuario.id;
            name = usuario.name;
            userName = usuario.username;
            email = usuario.email;
            addUserHtml(tabelaUsuario, id, name, userName, email);
        }
        else {
            usuarioObtido.hidden = false;
            mensagemErroPorId.innerHTML += `
            <div>
                <h2>Erro!</h2>
                <p>Usuário com ID ${inputIdUsuario.value} não encontrado.</p>
            </div>`
            cabecalhoUsuarioPorId.style.display = 'none';
        }
    }
});

let btnPostUser = document.querySelector('#cadastrarUsuario');

let createId = document.getElementById('createId');
let createUsername = document.getElementById('createUsername');
let createNome = document.getElementById('createNome');
let createEmail = document.getElementById('createEmail');
let usuarioCriado = document.getElementById('usuarioCriado');

let cabecalhoUsuarioCriado = document.getElementById('cabecalhoUsuarioCriado');
let mensagemErroUserCriado = document.getElementById('mensagemErroUserCriado');
let tabelaUsuariosCriados = document.getElementById('tabelaUsuariosCriados');

btnPostUser.addEventListener('click', async (event) => {
    event.preventDefault();
    tabelaUsuariosCriados.innerHTML = '';
    mensagemErroUserCriado.innerHTML = '';
    cabecalhoUsuarioCriado.style.display = 'block';

    if (createId.value === '') {
        usuarioCriado.hidden = false;
        mensagemErroUserCriado.innerHTML += `
            <div>
                <h2>Erro!</h2>
                <p>Informe os dados a serem alterados.</p>
            </div>`
        cabecalhoUsuarioCriado.style.display = 'none';
    } else {
        const response = await fetch(urlPost, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: createId.value,
                name: createNome.value,
                username: createUsername.value,
                email: createEmail.value
            })
        })
        if (response.ok == true) {
            usuarioCriado.hidden = false;
            const usuarios = await response.json();
            usuarios.forEach(result => {
                id = result.id;
                name = result.name;
                userName = result.username;
                email = result.email;
                addUserHtml(tabelaUsuariosCriados, id, name, userName, email)
            });
        }
        else {
            usuarioCriado.hidden = false;
            mensagemErroUserCriado.innerHTML += `<h2>Erro ao cadastrar usuário.</h2>`
            cabecalhoUsuarioCriado.style.display = 'none';
        }
    }
});

let btnPutUser = document.querySelector('#editarUsuario');

let editId = document.getElementById('editId');
let editNome = document.getElementById('editNome');
let editUsername = document.getElementById('editUsername');
let editEmail = document.getElementById('editEmail');
let usuarioEditar = document.getElementById('usuarioEditar');

let cabecalhoUsuarioAlterado = document.getElementById('cabecalhoUsuarioAlterado');
let mensagemErroUserAlterado = document.getElementById('mensagemErroUserAlterado');
let tabelaUsuariosAlterados = document.getElementById('tabelaUsuariosAlterados');

btnPutUser.addEventListener('click', async (event) => {
    event.preventDefault();
    tabelaUsuariosAlterados.innerHTML = '';
    mensagemErroUserAlterado.innerHTML = '';
    cabecalhoUsuarioAlterado.style.display = 'block';

    if (editId.value === '') {
        usuarioEditar.hidden = false;
        mensagemErroUserAlterado.innerHTML += `
            <div>
                <h2>Erro!</h2>
                <p>Informe os dados a serem alterados.</p>
            </div>`
        cabecalhoUsuarioAlterado.style.display = 'none';
    } else {
        const response = await fetch(urlPut, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: editId.value,
                name: editNome.value,
                username: editUsername.value,
                email: editEmail.value
            })
        })
        if (response.ok == true) {
            usuarioEditar.hidden = false;
            const usuarios = await response.json();
            usuarios.forEach(result => {
                id = result.id;
                name = result.name;
                userName = result.username;
                email = result.email;
                addUserHtml(tabelaUsuariosAlterados, id, name, userName, email)
            });
        }
        else {
            usuarioEditar.hidden = false;
            mensagemErroUserAlterado.innerHTML += `<h2>Erro ao alterar dados do usuário.</h2>`
            cabecalhoUsuarioAlterado.style.display = 'none';
        }
    }
});

let btnDeleteUser = document.querySelector('#deletarUsuario');

let deleteId = document.getElementById('deleteId');
let usuarioDeletado = document.getElementById('usuarioDeletado');

let cabecalhoUsuarioDeletado = document.getElementById('cabecalhoUsuarioDeletado');
let mensagemErroUserDeletado = document.getElementById('mensagemErroUserDeletado');
let tabelaUsuariosDeletados = document.getElementById('tabelaUsuariosDeletados');

btnDeleteUser.addEventListener('click', async (event) => {
    event.preventDefault();
    tabelaUsuariosDeletados.innerHTML = '';
    mensagemErroUserDeletado.innerHTML = '';
    cabecalhoUsuarioDeletado.style.display = 'block';

    if (deleteId.value === '') {
        usuarioDeletado.hidden = false;
        mensagemErroUserDeletado.innerHTML += `
            <div>
                <h2>Erro!</h2>
                <p>Informe o ID.</p>
            </div>`
        cabecalhoUsuarioDeletado.style.display = 'none';
    } else {
        const response = await fetch(urlDelete + deleteId.value, {
            method: "DELETE"
        });
        if (response.ok == true) {
            usuarioDeletado.hidden = false;
            const usuarios = await response.json();
            usuarios.forEach(result => {
                id = result.id;
                name = result.name;
                userName = result.username;
                email = result.email;
                addUserHtml(tabelaUsuariosDeletados, id, name, userName, email)
            });
        }
        else {
            usuarioDeletado.hidden = false;
            mensagemErroUserDeletado.innerHTML += `
            <div>
                <h2>Erro!</h2>
                <p>Usuário com ID ${deleteId.value} não encontrado.</p>
            </div>`
            cabecalhoUsuarioDeletado.style.display = 'none';
        }
    }
});