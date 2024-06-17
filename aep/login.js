document.getElementById('formDeLogin').addEventListener('submit', function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const senha = document.getElementById('senha').value;

    if (nome === 'adm' && senha === 'adm') {
        window.location.href = "addTarefa1.html";
        msgDeErro.textContent = '';
    } else {
        alert("Usuário e/ou senha incorretos. Por favor, tente novamente.");
    }
});
