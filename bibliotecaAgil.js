const { stdin } = require("process");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getInput(message) {
  return new Promise((resolve, reject) => {
    rl.question(message, (input) => resolve(input));
  });
}

const listaDeLivros = [
  {
    numero: "00001",
    titulo: "Como fazer sentido e bater o martelo",
    autor: "Alexandro Aolchique",
    ano: 2017,
    status: "Disponível",
    emprestado_para: "",
  },
  {
    numero: "00002",
    titulo: "Código limpo",
    autor: "Tio Bob",
    ano: 2001,
    status: "Disponível",
    emprestado_para: "",
  },
  {
    numero: "00003",
    titulo: "Basquete 101",
    autor: "Hortência Marcari",
    ano: 2010,
    status: "Disponível",
    emprestado_para: "",
  },
];

async function menu() {
  let opcaoSelecionada;

  do {
    console.log("1 - Retirar um livro");
    console.log("2 - Devolver um livro");
    console.log("3 - Doar um livro");
    console.log("4 - Sair\n");

    opcaoSelecionada = parseInt(
      await getInput("Digite o número da operação que deseja realizar: ")
    );

    switch (opcaoSelecionada) {
      case 1:
        await retirarLivro();
        break;
      case 2:
        await devolverLivro();
        break;
      case 3:
        await doarLivro();
        break;
      case 4:
        console.log("Operação selecionada: Sair.");
        console.log("Até logo!");
        rl.close();
        break;
      default:
        console.log("Código inválido\n");
        break;
    }
  } while (opcaoSelecionada != 4);
}

async function retirarLivro() {
  const titulos = listaDeLivros.map(
    (livro) => ` Número: ${livro.numero} - ${livro.status} - ${livro.titulo}`
  );
  console.log("Operação selecionada: Retirar livro.\n");
  console.log("Confira os títulos abaixo: \n");
  console.log(titulos);

  const codigoDigitado = await getInput(
    "Digite o número do livro que deseja retirar: "
  );
  let livroEncontrado = listaDeLivros.find(
    (livro) => livro.numero == codigoDigitado
  );

  if (livroEncontrado == undefined) {
    console.log("Código inválido!\n");
    return;
  }
  if (livroEncontrado.status === "Disponível") {
    console.log("\nO livro selecionado é: \n");
    mostrarLivroFormatado(livroEncontrado);

    const nomeDigitado = await getInput("Digite o seu nome: ");
    livroEncontrado.status = "Indisponível";
    livroEncontrado.emprestado_para = nomeDigitado;
    mostrarLivroFormatado(livroEncontrado);
    console.log("Operação finalizada com sucesso!\n");
  } else if (livroEncontrado.status === "Indisponível") {
    console.log("O livro selecionado está indisponível.\n");
  }
}

async function devolverLivro() {
  console.log("Operação selecionada: Devolver livro.\n");
  let nomeDeQuemEmprestou = await getInput(
    "Digite o seu nome para visualizar o livro emprestado: "
  );
  let livrosEncontrados = listaDeLivros.filter(
    (livro) =>
      livro.emprestado_para.toLowerCase() == nomeDeQuemEmprestou.toLowerCase()
  );
  if (livrosEncontrados.length == 0) {
    console.log("Você não emprestou nenhum livro.\n");
    return;
  }

  for (let i = 0; i < livrosEncontrados.length; i++) {
    mostrarLivroFormatado(livrosEncontrados[i]);
  }
  const livroParaDevolver = await getInput(
    "Digite o número do livro que deseja devolver: "
  );
  let livroEncontrado = livrosEncontrados.find(
    (livro) => livro.numero == livroParaDevolver
  );

  if (livroEncontrado == undefined) {
    console.log("Você não emprestou nenhum livro com esse número.\n");
    return;
  }

  mostrarLivroFormatado(livroEncontrado);
  let confirmar = await getInput("Digite 's' para confirmar a devolução: ");
  if (confirmar.toLowerCase() == "s") {
    livroEncontrado.status = "Disponível";
    livroEncontrado.emprestado_para = "";
    mostrarLivroFormatado(livroEncontrado);
    console.log("Operação finalizada com sucesso!\n");
  } else {
    console.log("Operação cancelada\n");
  }
}

async function doarLivro() {
  console.log("Operação selecionada: Doar livro.\n");
  const novoLivro = {};

  const inputNumeroDoLivro = await getInput("Digite o número do livro: ");
  novoLivro["numero"] = inputNumeroDoLivro;

  const inputTituloDoLivro = await getInput("Digite o título do livro: ");
  novoLivro["titulo"] = inputTituloDoLivro;

  const inputAutorDoLivro = await getInput("Digite o autor do livro: ");
  novoLivro["autor"] = inputAutorDoLivro;

  const inputAnoDoLivro = await getInput("Digite o ano do livro: ");
  novoLivro["ano"] = parseInt(inputAnoDoLivro);

  novoLivro["status"] = "Disponível";
  novoLivro["emprestado_para"] = "";
  listaDeLivros.push(novoLivro);
  console.log("Operação finalizada com sucesso!\n");
  mostrarLivroFormatado(novoLivro);
}

function mostrarLivroFormatado(livro) {
  console.log(`Número: ${livro.numero}`);
  console.log(`Título: ${livro.titulo}`);
  console.log(`Autor: ${livro.autor}`);
  console.log(`Ano: ${livro.ano}`);
  console.log(`Status: ${livro.status}`);
  console.log(`Emprestado para: ${livro.emprestado_para}\n`);
}

menu();
