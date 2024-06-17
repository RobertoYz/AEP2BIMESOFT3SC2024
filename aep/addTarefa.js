document.addEventListener("DOMContentLoaded", function() {
    let editarIndice = null;

    function setMinDateTime() {
        var inputPrazoTarefa = document.getElementById("prazoTarefa");
        var now = new Date();
        var year = now.getFullYear();
        var month = ('0' + (now.getMonth() + 1)).slice(-2);
        var day = ('0' + now.getDate()).slice(-2);
        var hours = ('0' + now.getHours()).slice(-2);
        var minutes = ('0' + now.getMinutes()).slice(-2);

        var datetime = `${year}-${month}-${day}T${hours}:${minutes}`;
        inputPrazoTarefa.setAttribute('min', datetime);
    }

    function inserirQuebrasDeLinha(texto) {
        const quebraDeLinhaManual = texto.split('\n').map(parte => {
            let resultado = '';
            for (let i = 0; i < parte.length; i += 100) {
                resultado += parte.slice(i, i + 100) + '<br>';
            }
            return resultado;
        }).join('<br>');
        return quebraDeLinhaManual;
    }

    function mostrarTarefas() {
        var listaDeTarefas = document.getElementById("listaDeTarefas");
        var listaDeTarefasConcluidas = document.getElementById("listaDeTarefasConcluidas");
        listaDeTarefas.innerHTML = '';
        listaDeTarefasConcluidas.innerHTML = '';

        var tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

        tarefas.sort(function(a, b) {
            return new Date(a.prazoTarefa) - new Date(b.prazoTarefa);
        });

        tarefas.forEach(function(tarefa, indice) {
            var prazo = new Date(tarefa.prazoTarefa);
            var hoje = new Date();

            if (prazo < hoje && !tarefa.concluida) {
                tarefa.concluida = true;
            }
        });

        tarefas.forEach(function(tarefa, indice) {
            var itemAdd = document.createElement("li");
            itemAdd.innerHTML = `
                <p>Nome: ${inserirQuebrasDeLinha(tarefa.nomeTarefa)}</p>
                <p>Prazo: ${tarefa.prazoTarefa}</p>
                <p>Descrição: ${inserirQuebrasDeLinha(tarefa.descricaoTarefa)}</p>
                <button class="botaoEditar" data-index="${indice}">Editar</button>
                <button class="botaoDeletar" data-index="${indice}">Excluir</button>
                <button class="botaoConcluir" data-index="${indice}" data-concluida="${tarefa.concluida ? 'true' : 'false'}">Concluir</button> 
            `;

            var concluirButton = itemAdd.querySelector(".botaoConcluir");
            concluirButton.textContent = tarefa.concluida ? "Desfazer" : "Concluir"; 

            if (tarefa.concluida) {
                listaDeTarefasConcluidas.appendChild(itemAdd);
            } else {
                listaDeTarefas.appendChild(itemAdd);
            }
        });

        document.querySelectorAll(".botaoDeletar").forEach(function(button) {
            button.addEventListener("click", function() {
                var indice = button.getAttribute("data-index");
                deletarTarefa(indice);
            });
        });

        document.querySelectorAll(".botaoEditar").forEach(function(button) {
            button.addEventListener("click", function() {
                var indice = button.getAttribute("data-index");
                editarTarefa(indice);
            });
        });

        document.querySelectorAll(".botaoConcluir").forEach(function(button) {
            button.addEventListener("click", function() {
                var indice = button.getAttribute("data-index");
                var concluida = button.getAttribute("data-concluida") === "true";

                concluirTarefa(indice, !concluida);
            });
        });
    }

    function deletarTarefa(indice) {
        var tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
        tarefas.splice(indice, 1);
        localStorage.setItem("tarefas", JSON.stringify(tarefas));
        mostrarTarefas();
    }

    function editarTarefa(indice) {
        var tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
        var tarefa = tarefas[indice];
        document.getElementById("nomeTarefa").value = tarefa.nomeTarefa;
        document.getElementById("prazoTarefa").value = tarefa.prazoTarefa;
        document.getElementById("descricaoTarefa").value = tarefa.descricaoTarefa;
        editarIndice = indice;
    }

    function concluirTarefa(indice, concluida) {
        var tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
        tarefas[indice].concluida = concluida;

        tarefas.sort(function(a, b) {
            return new Date(a.prazoTarefa) - new Date(b.prazoTarefa);
        });

        localStorage.setItem("tarefas", JSON.stringify(tarefas));

        mostrarTarefas(); 
    }

    document.getElementById("formDeTarefa").addEventListener("submit", function(event) {
        event.preventDefault();

        var nomeTarefa = document.getElementById("nomeTarefa").value;
        var prazoTarefa = document.getElementById("prazoTarefa").value;
        var descricaoTarefa = document.getElementById("descricaoTarefa").value;

        var tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

        if (editarIndice !== null) {
            tarefas[editarIndice] = { nomeTarefa: nomeTarefa, prazoTarefa: prazoTarefa, descricaoTarefa: descricaoTarefa };
            editarIndice = null;
        } else {
            tarefas.push({ nomeTarefa: nomeTarefa, prazoTarefa: prazoTarefa, descricaoTarefa: descricaoTarefa, concluida: false });
        }

        localStorage.setItem("tarefas", JSON.stringify(tarefas));

        document.getElementById("formDeTarefa").reset();

        mostrarTarefas();
        setMinDateTime();
    });

    function logout() {
        window.location.href = "login.html";
    }

    document.getElementById("logoutButton").addEventListener("click", logout);

    setMinDateTime();
    mostrarTarefas();
});