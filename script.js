function updateColor(input) {
  const id = input.id;
  const quantidade = parseInt(input.value);
  const limiteBaixo = parseInt(document.getElementById('limiteBaixo' + capitalizeFirstLetter(id)).value);
  const limiteCheio = parseInt(document.getElementById('limiteCheio' + capitalizeFirstLetter(id)).value);

  if (quantidade <= limiteBaixo) {
      input.style.backgroundColor = '#FFB3B3'; /* Vermelho pastel */
  } else if (quantidade >= limiteCheio) {
      input.style.backgroundColor = '#C8E6C9'; /* Verde pastel */
  } else {
      input.style.backgroundColor = '#FFF9C4'; /* Amarelo pastel */
  }
}

function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function showProductForm() {
  document.getElementById('new-product-form').style.display = 'block';
  document.getElementById('new-product-name').focus();
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    addProduto();
  }
}

function addProdutoElement(id, nome, quantidade, limiteBaixo, limiteCheio) {
  const container = document.getElementById('produtos-container');

  const produtoContainer = document.createElement('div');
  produtoContainer.classList.add('produto-container');

  const produtoDiv = document.createElement('div');
  produtoDiv.classList.add('produto');
  produtoDiv.dataset.id = id;

  const h3 = document.createElement('h3');  // Alterado de h2 para h3
  h3.textContent = nome;

  const quantidadeDiv = document.createElement('div');
  quantidadeDiv.classList.add('quantidade');

  const decrementButton = document.createElement('button');
  decrementButton.textContent = '-';
  decrementButton.onclick = () => {
      decrement(id);
      saveToLocalStorage();
  };

  const quantidadeInput = document.createElement('input');
  quantidadeInput.type = 'number';
  quantidadeInput.id = id;
  quantidadeInput.value = quantidade;
  quantidadeInput.oninput = () => updateColor(quantidadeInput);

  const incrementButton = document.createElement('button');
  incrementButton.textContent = '+';
  incrementButton.onclick = () => {
      increment(id);
      saveToLocalStorage();
  };

  quantidadeDiv.appendChild(decrementButton);
  quantidadeDiv.appendChild(quantidadeInput);
  quantidadeDiv.appendChild(incrementButton);

  const parametroDiv = document.createElement('div');
  parametroDiv.classList.add('parametro');

  const limiteBaixoDiv = document.createElement('div');
  limiteBaixoDiv.classList.add('parametro-item');
  
  const limiteBaixoLabel = document.createElement('label');
  limiteBaixoLabel.textContent = '▼ Baixo';
  limiteBaixoLabel.for = 'limiteBaixo' + capitalizeFirstLetter(id);
  limiteBaixoLabel.classList.add('label');

  const limiteBaixoInput = document.createElement('input');
  limiteBaixoInput.type = 'number';
  limiteBaixoInput.id = 'limiteBaixo' + capitalizeFirstLetter(id);
  limiteBaixoInput.value = limiteBaixo;
  limiteBaixoInput.oninput = () => updateColor(quantidadeInput);
  
  limiteBaixoDiv.appendChild(limiteBaixoLabel);
  limiteBaixoDiv.appendChild(limiteBaixoInput);

  const limiteCheioDiv = document.createElement('div');
  limiteCheioDiv.classList.add('parametro-item');
  
  const limiteCheioLabel = document.createElement('label');
  limiteCheioLabel.textContent = '▲ Alto';
  limiteCheioLabel.for = 'limiteCheio' + capitalizeFirstLetter(id);
  limiteCheioLabel.classList.add('label');

  const limiteCheioInput = document.createElement('input');
  limiteCheioInput.id = 'limiteCheio' + capitalizeFirstLetter(id);
  limiteCheioInput.type = 'number';
  limiteCheioInput.value = limiteCheio;
  limiteCheioInput.oninput = () => updateColor(quantidadeInput);

  limiteCheioDiv.appendChild(limiteCheioLabel);
  limiteCheioDiv.appendChild(limiteCheioInput);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Excluir';
  deleteButton.classList.add('delete-button');
  deleteButton.onclick = () => deleteProduto(id);

  parametroDiv.appendChild(limiteBaixoDiv);
  parametroDiv.appendChild(limiteCheioDiv);

  produtoDiv.appendChild(h3);  // Alterado de h2 para h3
  produtoDiv.appendChild(quantidadeDiv);
  produtoDiv.appendChild(parametroDiv);
  produtoDiv.appendChild(deleteButton);

  produtoContainer.appendChild(produtoDiv);
  container.appendChild(produtoContainer);
  updateColor(quantidadeInput);
}

function addProduto() {
  const productName = document.getElementById('new-product-name').value;
  if (productName.trim() === "") {
      alert("Por favor, insira um nome para o produto.");
      return;
  }

  const container = document.getElementById('produtos-container');
  const newId = productName.toLowerCase().replace(/\s+/g, '-') + '-' + (container.children.length + 1);

  addProdutoElement(newId, productName, 0, 5, 20);
  saveToLocalStorage();

  // Limpar e esconder o formulário
  document.getElementById('new-product-form').style.display = 'none';
  document.getElementById('new-product-name').value = "";
}

function increment(id) {
  const input = document.getElementById(id);
  console.log(`Incrementando quantidade para ID: ${id}, Valor atual: ${input.value}`); // Log do incremento
  input.value = parseInt(input.value) + 1;
  updateColor(input);
  saveToLocalStorage();
}

function decrement(id) {
  const input = document.getElementById(id);
  console.log(`Decrementando quantidade para ID: ${id}, Valor atual: ${input.value}`); // Log do decremento
  if (parseInt(input.value) > 0) {
      input.value = parseInt(input.value) - 1;
      updateColor(input);
      saveToLocalStorage();
  }
}

function saveToLocalStorage() {
  const produtos = [];
  document.querySelectorAll('.produto').forEach(produtoDiv => {
      const id = produtoDiv.dataset.id;
      const nome = produtoDiv.querySelector('h3').textContent;
      const quantidadeInput = produtoDiv.querySelector(`input[id="${id}"]`);
      const limiteBaixoInput = produtoDiv.querySelector(`#limiteBaixo${capitalizeFirstLetter(id)}`);
      const limiteCheioInput = produtoDiv.querySelector(`#limiteCheio${capitalizeFirstLetter(id)}`);

      if (quantidadeInput && limiteBaixoInput && limiteCheioInput) {
          const quantidade = quantidadeInput.value;
          const limiteBaixo = limiteBaixoInput.value;
          const limiteCheio = limiteCheioInput.value;
          produtos.push({ id, nome, quantidade, limiteBaixo, limiteCheio });
      } else {
          console.error('Elemento não encontrado para o produto:', {
              id,
              quantidadeInput,
              limiteBaixoInput,
              limiteCheioInput
          });
      }
  });
  console.log('Produtos salvos:', produtos);
  localStorage.setItem('produtos', JSON.stringify(produtos));
}

function loadFromLocalStorage() {
  const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
  console.log('Produtos carregados:', produtos);
  produtos.forEach(produto => {
      const { id, nome, quantidade, limiteBaixo, limiteCheio } = produto;
      addProdutoElement(id, nome, quantidade, limiteBaixo, limiteCheio);
  });
}

function deleteProduto(id) {
  const produtoContainer = document.querySelector(`.produto[data-id="${id}"]`).parentElement;
  if (produtoContainer) {
      produtoContainer.remove();
      saveToLocalStorage();
  }
}

document.addEventListener('DOMContentLoaded', loadFromLocalStorage);
