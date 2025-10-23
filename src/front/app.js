
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
            .map(p => `<option value="${p.nome}">${p.nome} - R$${p.preco}</option>`)
            .join("");
    } catch (err) {
        console.error("Erro ao carregar produtos:", err);
    }
}

// Adicionar produto ao pedido
document.getElementById("adicionarProdutoBtn").addEventListener("click", () => {
    const produtoNome = produtoSelect.value;
    const quantidade = Number(document.getElementById("quantidade").value);
    const produtoObj = produtos.find(p => p.nome === produtoNome);
    if (!produtoObj || quantidade <= 0) return alert("Produto ou quantidade inválida");

    pedidoItens.push({
        descricao: produtoObj.nome,
        quantidade,
        precoUnitario: produtoObj.preco,
        produtoId: produtoObj.id
    });

    pedidoItensList.innerHTML = pedidoItens
        .map(i => `${i.descricao} x${i.quantidade} - R$${i.precoUnitario * i.quantidade}`)
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

        if (!res.ok) {
            return alert(data.msg);
        }

        pedidoItens = [];
        pedidoItensList.innerHTML = "";
        pedidoForm.reset();
        carregarPedidos();
    } catch (err) {
        console.error("Erro ao criar pedido:", err);
    }
});

// Tornar abrirModalEditar global
window.abrirModalEditar = async function (pedidoId) {
    const modal = document.getElementById("modalEditar");
    const itensDiv = document.getElementById("itensEditar");
    const produtoSelect = document.getElementById("produtoEditarSelect");

    const res = await fetch(`http://localhost:3000/api/pedidos/${pedidoId}`);
    const pedido = await res.json();

    itensDiv.innerHTML = "";
    produtoSelect.innerHTML = "";
    let itensParaRemover = [];

    pedido.itens.forEach(i => {
        const li = document.createElement("div");
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.marginBottom = "5px";

        const span = document.createElement("span");
        span.textContent = `${i.descricao} x${i.quantidade}`;

        const btnRemover = document.createElement("button");
        btnRemover.textContent = "🗑️";
        btnRemover.style.background = "transparent";
        btnRemover.style.border = "none";
        btnRemover.style.cursor = "pointer";
        btnRemover.style.fontSize = "16px";

        btnRemover.onclick = () => {
            if (!itensParaRemover.includes(i.id)) {
                itensParaRemover.push(i.id);
                li.style.opacity = "0.5";
            } else {
                itensParaRemover = itensParaRemover.filter(id => id !== i.id);
                li.style.opacity = "1";
            }
        };

        li.appendChild(span);
        li.appendChild(btnRemover);
        itensDiv.appendChild(li);
    });

    const resProdutos = await fetch("http://localhost:3000/api/produtos");
    const produtos = await resProdutos.json();
    produtoSelect.innerHTML = produtos
        .map(p => `<option value="${p.id}">${p.nome} - R$${p.preco}</option>`)
        .join("");

    modal.style.display = "flex";

    const btnAdicionar = document.getElementById("adicionarItemEditarBtn");
    const btnFechar = document.getElementById("fecharModalEditarBtn");

    let btnSalvarAlteracoes = document.getElementById("salvarAlteracoesBtn");
    if (!btnSalvarAlteracoes) {
        btnSalvarAlteracoes = document.createElement("button");
        btnSalvarAlteracoes.id = "salvarAlteracoesBtn";
        btnSalvarAlteracoes.textContent = "Salvar Alterações";
        btnSalvarAlteracoes.className = "btn-pagamento";
        document.querySelector(".modal-botoes").appendChild(btnSalvarAlteracoes);
    }

    btnAdicionar.onclick = async () => {
        const produtoId = produtoSelect.value;
        const quantidade = Number(document.getElementById("quantidadeEditar").value);
        if (!produtoId || quantidade <= 0) return alert("Produto ou quantidade inválida");

        await fetch(`http://localhost:3000/api/pedidos/${pedidoId}/adicionarItens`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ produtoId, quantidade })
        });

        abrirModalEditar(pedidoId);
        carregarPedidos();
    };

    btnFechar.onclick = () => {
        modal.style.display = "none";
    };

    btnSalvarAlteracoes.onclick = async () => {
        for (const itemId of itensParaRemover) {
            await fetch(`http://localhost:3000/api/pedidos/${pedidoId}/removerItem/${itemId}`, { method: "DELETE" });
        }
        abrirModalEditar(pedidoId);
        carregarPedidos();
    };
};

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
                    <td>${p.Cliente.nome}</td>
                    <td>${itens.map(i => i.descricao + " x" + i.quantidade).join(", ")}</td>
                    <td>R$ ${p.total.toFixed(2)}</td>
                    <td>${p.status}</td>
                    <td>${new Date(p.data).toLocaleString()}</td>
                    <td>${p.formaPagamento && p.formaPagamento.trim() !== "" ? p.formaPagamento.trim().toUpperCase() : "-"}</td>
                    <td>
                        <button onclick="mudarStatus(${p.id}, '${p.status}')">Alterar Status</button>
                    </td>
                    <td>
                        <button class="editar-btn" data-id="${p.id}" onclick="abrirModalEditar(${p.id})">Editar</button>
                    </td>
                </tr>
            `;
        }).join("");
    } catch (err) {
        console.error("Erro ao carregar pedidos:", err);
    }
}

// Inicialização
window.addEventListener("DOMContentLoaded", () => {
    carregarProdutos();
    carregarPedidos();
});

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

document.getElementById('irCaixaBtn').addEventListener('click', () => {
    window.location.href = 'caixa.html';
});

const modal = document.getElementById('modalProduto');
document.getElementById('abrirModalProdutoBtn').onclick = () => modal.style.display = 'flex';
document.getElementById('fecharModalProdutoBtn').onclick = () => modal.style.display = 'none';

document.getElementById('salvarProdutoBtn').onclick = async () => {
    const nome = document.getElementById('nomeProduto').value;
    const preco = document.getElementById('precoProduto').value;

    if (!nome || !preco) return alert('Preencha todos os campos');

    try {
        const resp = await fetch('http://localhost:3000/api/produto', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, preco })
        });

        const data = await resp.json();

        // Substitui o alert por um modal de notificação temporário
        const notif = document.createElement('div');
        notif.textContent = data.msg;
        notif.style.position = 'fixed';
        notif.style.top = '20px';
        notif.style.right = '20px';
        notif.style.padding = '10px 20px';
        notif.style.backgroundColor = '#4CAF50';
        notif.style.color = '#fff';
        notif.style.borderRadius = '8px';
        notif.style.zIndex = '9999';
        document.body.appendChild(notif);

        setTimeout(() => notif.remove(), 2500);

        if (resp.ok) {
            modal.style.display = 'none';
            document.getElementById('nomeProduto').value = '';
            document.getElementById('precoProduto').value = '';

            const option = document.createElement('option');
            option.value = nome;
            option.textContent = `${nome} - R$${preco}`;
            produtoSelect.appendChild(option);
        }
    } catch (err) {
        console.error("Erro ao salvar produto:", err);
    }
};


