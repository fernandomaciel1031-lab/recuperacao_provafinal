const form = document.querySelector('#form-livro');
const listaEl = document.querySelector('#lista-livros');
const mensagemErro = document.querySelector('#mensagem-erro');

async function carregarLivros() {
  try {
    const response = await fetch("/livros");

    if (!response.ok) {
      mostrarErro('Erro ao buscar livros');
      return;
    }

    const livros = await response.json();

    renderizarLivros(livros);
    return;
  } catch (error) {
    mostrarErro(error.message);
  }
}

function mostrarErro(msg) {
  mensagemErro.textContent = msg;
  mensagemErro.classList.remove('oculto');
}

// ----- TAREFA 1: renderizar os livros na tela -----
function renderizarLivros(livros) {
  listaEl.innerHTML = '';
  livros.forEach((livro) => {
    const li = document.createElement('li');
    li.classList.add(
      livro.disponivel === 1 ? 'disponivel' : 'indisponivel'
    );
    li.innerHTML = `
      <strong>Titulo: ${livro.titulo}</strong>
      <span>Autor: ${livro.autor}</span>
      <span>Ano: ${livro.ano}</span>
      <span>
        Status: ${livro.disponivel === 1 ? 'Disponível' : 'Emprestado'}
      </span>
    `;
    const botaoStatus = document.createElement('button');
    botaoStatus.textContent =
      livro.disponivel === 1 ? 'Emprestar' : 'Devolver';
    botaoStatus.addEventListener('click', () => {
      alternarStatus(livro);
    });
    const botaoRemover = document.createElement('button');
    botaoRemover.textContent = 'Remover';
    botaoRemover.addEventListener('click', () => {
      removerLivro(livro.id);
    });
    li.appendChild(botaoStatus);
    li.appendChild(botaoRemover);
    listaEl.appendChild(li);
  });
}

// ----- TAREFA 2: cadastrar um novo livro (POST) -----
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const titulo = document.querySelector('#input-titulo').value;
  const autor = document.querySelector('#input-autor').value;
  const ano = document.querySelector('#input-ano').value;
  try {
    const response = await fetch('/livros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        titulo: titulo,
        autor: autor,
        ano: ano
      })
    });
    if (!response.ok) {
      mostrarErro('Erro ao cadastrar livro.');
      return;
    }
    form.reset();
    await carregarLivros();
  } catch (error) {
    mostrarErro(error.message);
  }
});
// ----- TAREFA 3: remover um livro (DELETE) -----
async function removerLivro(id) {
  try {
    const res = await fetch(`livros/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      mostrarErro('Erro ao remover livro.');
      return;
    }
    await carregarLivros();
  } catch (error) {
    mostrarErro(error.message);
  }
}
// ----- TAREFA 4: emprestar / devolver um livro (PUT) -----
async function alternarStatus(livro) {
  // TAREFA: descobrir o novo valor de "disponivel" (inverter o atual: 1 vira 0, 0 vira 1)
  // TAREFA: fazer fetch PUT para a rota PUT enviando
  //       { disponivel: novoValor } no body, com headers corretos
  //       OBS: A rota PUT precisa ser criada no back-end
  // TAREFA: tratar erro com a função mostrarErro
  // TAREFA: se der certo, chamar carregarLivros() para atualizar a lista
}

carregarLivros();
