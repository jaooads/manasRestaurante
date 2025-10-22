const produtoSelect = document.getElementById("produtoSelect");
const pedidoForm = document.getElementById("pedidoForm");
const pedidosTableBody = document.querySelector("#pedidosTable tbody");
const pedidoItensList = document.getElementById("pedidoItensList");

let produtos = [];
let pedidoItens = [];

// Carregar produtos
async function carregarProdutos() {
    try {
        const res = await fetch("http://localhost:3000/api/produtos");
        produtos = await res.json();
        produtoSelect.innerHTML = produtos
            .map(p => `<option value="${p.id}">${p.nome} - R$${p.preco}</option>`)
            .join("");
    } catch (err) {
        console.error("Erro ao carregar produtos:", err);
    }
}

// Adicionar produto ao pedido
document.getElementById("adicionarProdutoBtn").addEventListener("click", () => {
    const produtoId = Number(produtoSelect.value);
    const quantidade = Number(document.getElementById("quantidade").value);
    const produtoObj = produtos.find(p => p.id === produtoId);
    if (!produtoObj || quantidade <= 0) return alert("Produto ou quantidade inválida");

    pedidoItens.push({
        produtoId: produtoObj.id,
        descricao: produtoObj.nome,
        quantidade,
        precoUnitario: produtoObj.preco
    });

    pedidoItensList.innerHTML = pedidoItens
        .map(i => `${i.descricao} x${i.quantidade} - R$${(i.precoUnitario * i.quantidade).toFixed(2)}`)
        .join("<br>");
});

// Criar pedido
pedidoForm.addEventListener("submit", async e => {
    e.preventDefault();
    const clienteNome = document.getElementById("clienteNome").value;
    if (!clienteNome || pedidoItens.length === 0) return alert("Preencha o cliente e adicione produtos");

    const body = { clienteNome, itens: pedidoItens };

    try {
        const res = await fetch("http://localhost:3000/api/pedido", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        if (!res.ok) return alert(data.msg);

        pedidoItens = [];
        pedidoItensList.innerHTML = "";
        pedidoForm.reset();
        carregarPedidos();
    } catch (err) {
        console.error("Erro ao criar pedido:", err);
    }
});

// Carregar pedidos
async function carregarPedidos() {
    try {
        const res = await fetch("http://localhost:3000/api/pedidos");
        const pedidos = await res.json();

        if (!Array.isArray(pedidos)) {
            console.error("Resposta inesperada:", pedidos);
            return;
        }

        pedidosTableBody.innerHTML = pedidos.map(p => {
            const itens = p.itens || [];
            return `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.Cliente?.nome || "-"}</td>
                    <td>${itens.map(i => i.descricao + " x" + i.quantidade).join(", ")}</td>
                    <td>R$ ${p.total.toFixed(2)}</td>
                    <td>${p.status}</td>
                    <td>${new Date(p.data).toLocaleString()}</td>
                    <td>${p.formaPagamento?.trim() ? p.formaPagamento.toUpperCase() : "-"}</td>
                    <td>
                        <button onclick="mudarStatus(${p.id}, '${p.status}')">Alterar Status</button>
                    </td>
                    <td>
                        <button class="editar-btn" data-id="${p.id}">Editar</button>
                    </td>
                </tr>
            `;
        }).join("");

        atualizarBotoesEditar();
    } catch (err) {
        console.error("Erro ao carregar pedidos:", err);
    }
}

// Atualiza botões de editar
function atualizarBotoesEditar() {
    document.querySelectorAll(".editar-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const pedidoId = btn.getAttribute("data-id");
            abrirModalEditar(pedidoId);
        });
    });
}

// Inicialização
window.addEventListener("DOMContentLoaded", () => {
    carregarProdutos();
    carregarPedidos();
});

// Alterar status do pedido
async function mudarStatus(pedidoId, statusAtual) {
    let novoStatus;

    if (statusAtual === "em_preparo") {
        novoStatus = "concluido";
    } else if (statusAtual === "concluido") {
        const formaPagamento = await escolherFormaPagamento();
        if (!formaPagamento) return;
        novoStatus = "pago";

        try {
            await fetch(`http://localhost:3000/api/pedido/${pedidoId}/pagamento`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ formaPagamento })
            });
        } catch (err) {
            console.error("Erro ao registrar pagamento:", err);
            return;
        }
    } else {
        novoStatus = "em_preparo";
    }

    try {
        await fetch(`http://localhost:3000/api/pedido/${pedidoId}/status`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: novoStatus })
        });
        carregarPedidos();
    } catch (err) {
        console.error("Erro ao atualizar status:", err);
    }
}

// Modal escolher forma de pagamento
function escolherFormaPagamento() {
    return new Promise((resolve) => {
        const modal = document.createElement("div");
        modal.classList.add("modal-pagamento");
        modal.innerHTML = `
            <div class="modal-conteudo">
                <h3>Selecione a forma de pagamento</h3>
                <button class="btn-pagamento" data-tipo="dinheiro">💵 Dinheiro</button>
                <button class="btn-pagamento" data-tipo="pix">⚡ Pix</button>
                <button class="btn-pagamento" data-tipo="cartao">💳 Cartão</button>
                <button class="btn-pagamento" data-tipo="nota">🧾 Nota</button>
            </div>
        `;
        document.body.appendChild(modal);

        modal.querySelectorAll(".btn-pagamento").forEach(btn => {
            btn.addEventListener("click", () => {
                const tipo = btn.getAttribute("data-tipo");
                modal.remove();
                resolve(tipo);
            });
        });
    });
}

// Navegação
document.getElementById('irCaixaBtn').addEventListener('click', () => {
    window.location.href = 'caixa.html';
});

document.getElementById('irRelatorioBtn').addEventListener('click', () => {
    window.location.href = 'relatorio.html';
});

// Modal de produto
const modal = document.getElementById('modalProduto');
document.getElementById('abrirModalProdutoBtn').onclick = () => modal.style.display = 'flex';
document.getElementById('fecharModalProdutoBtn').onclick = () => modal.style.display = 'none';

document.getElementById('salvarProdutoBtn').onclick = async () => {
    const nome = document.getElementById('nomeProduto').value;
    const preco = document.getElementById('precoProduto').value;

    if (!nome || !preco) return alert('Preencha todos os campos');

    const resp = await fetch('http://localhost:3000/api/produto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, preco })
    });

    const data = await resp.json();
    alert(data.msg);
    if (resp.ok) modal.style.display = 'none';
};
