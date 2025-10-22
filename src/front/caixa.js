const statusCaixa = document.getElementById("statusCaixa");
const totalVendido = document.getElementById("totalVendido");
const totaisPagamento = document.getElementById("totaisPagamento");
const tbodyHistorico = document.querySelector("#historicoCaixa tbody");

let caixaAberto = null;
let caixas = [];

// Carregar status do caixa
async function carregarCaixa() {
    try {
        const res = await fetch("http://localhost:3000/api/caixas");
        const data = await res.json();
        caixaAberto = data.find(c => !c.dataFechamento);

        if (caixaAberto) {
            statusCaixa.textContent = `Aberto em ${new Date(caixaAberto.dataAbertura).toLocaleString()}`;
            statusCaixa.style.color = "#10b981";
            carregarMovimentacoes();
        } else {
            statusCaixa.textContent = "Fechado";
            statusCaixa.style.color = "#ef4444";
            tbodyHistorico.innerHTML = `<tr><td colspan="6">Nenhum caixa aberto no momento.</td></tr>`;
        }
    } catch (err) {
        console.error("Erro ao carregar caixa:", err);
    }
}

// Carregar movimentações
async function carregarMovimentacoes() {
    try {
        const res = await fetch("http://localhost:3000/api/pedidos");
        const pedidos = await res.json();

        const pedidosDoCaixa = pedidos.filter(p => new Date(p.data) >= new Date(caixaAberto.dataAbertura));

        if (pedidosDoCaixa.length === 0) {
            tbodyHistorico.innerHTML = `<tr><td colspan="6">Nenhuma movimentação neste caixa.</td></tr>`;
            totalVendido.textContent = "R$ 0,00";
            return;
        }

        tbodyHistorico.innerHTML = pedidosDoCaixa.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.Cliente?.nome || "-"}</td>
                <td>${p.itens?.map(i => `${i.descricao} x${i.quantidade}`).join(", ") || "-"}</td>
                <td>R$ ${p.total.toFixed(2)}</td>
                <td>${p.formaPagamento?.toUpperCase() || "-"}</td>
                <td>${new Date(p.data).toLocaleString()}</td>
            </tr>
        `).join("");

        atualizarTotais(pedidosDoCaixa);
    } catch (err) {
        console.error("Erro ao carregar movimentações:", err);
    }
}

// Atualizar totais
function atualizarTotais(pedidos) {
    let total = 0, totalDinheiro = 0, totalPix = 0, totalCartao = 0;

    pedidos.forEach(p => {
        if (p.status === "pago") {
            total += p.total;
            if (p.formaPagamento === "dinheiro") totalDinheiro += p.total;
            if (p.formaPagamento === "pix") totalPix += p.total;
            if (p.formaPagamento === "cartao") totalCartao += p.total;
        }
    });

    totalVendido.textContent = `R$ ${total.toFixed(2)}`;
    totaisPagamento.innerHTML = `
        <li>Dinheiro: R$ ${totalDinheiro.toFixed(2)}</li>
        <li>PIX: R$ ${totalPix.toFixed(2)}</li>
        <li>Cartão: R$ ${totalCartao.toFixed(2)}</li>
    `;
}

// Abrir caixa
document.getElementById("abrirCaixaBtn").addEventListener("click", async () => {
    try {
        const res = await fetch("http://localhost:3000/api/caixa/abrir", { method: "POST" });
        const data = await res.json();
        alert(data.msg);
        carregarCaixa();
    } catch (err) {
        console.error("Erro ao abrir caixa:", err);
    }
});

// Fechar caixa
document.getElementById("fecharCaixaBtn").addEventListener("click", async () => {
    try {
        const res = await fetch("http://localhost:3000/api/caixa/fechar", { method: "POST" });
        const data = await res.json();
        alert(`${data.msg}. Total vendido: R$ ${data.totalVendido.toFixed(2)}`);
        carregarCaixa();
    } catch (err) {
        console.error("Erro ao fechar caixa:", err);
    }
});

// Histórico de caixas
const historicoCaixasBtn = document.getElementById("historicoCaixasBtn");
const modalHistorico = document.getElementById("modalHistoricoCaixas");
const fecharModalHistorico = document.getElementById("fecharModalHistorico");
const tbodyHistoricoCaixas = document.querySelector("#tabelaHistoricoCaixas tbody");

historicoCaixasBtn.addEventListener("click", async () => {
    try {
        caixas = await fetch("http://localhost:3000/api/caixa/historico").then(res => res.json());

        tbodyHistoricoCaixas.innerHTML = caixas.map(c => `
            <tr>
                <td>${c.caixaId}</td>
                <td>${c.status.toUpperCase()}</td>
                <td>${new Date(c.dataAbertura).toLocaleString()}</td>
                <td>${c.dataFechamento ? new Date(c.dataFechamento).toLocaleString() : "-"}</td>
                <td>R$ ${c.totalVendido.toFixed(2)}</td>
                <td>R$ ${c.totaisPorPagamento.dinheiro.toFixed(2)}</td>
                <td>R$ ${c.totaisPorPagamento.pix.toFixed(2)}</td>
                <td>R$ ${c.totaisPorPagamento.cartao.toFixed(2)}</td>
                <td><button onclick="verPedidosDoCaixa(${c.caixaId})">Visualizar</button></td>
            </tr>
        `).join("");

        modalHistorico.style.display = "flex";
    } catch (err) {
        console.error("Erro ao carregar histórico de caixas:", err);
    }
});

fecharModalHistorico.addEventListener("click", () => {
    modalHistorico.style.display = "none";
});

function verPedidosDoCaixa(caixaId) {
    const caixa = caixas.find(c => c.caixaId === caixaId);
    if (!caixa) return;

    const tbody = document.querySelector("#pedidosDoCaixa tbody");
    tbody.innerHTML = caixa.pedido.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.cliente}</td>
            <td>${p.itens?.map(i => `${i.descricao} x${i.quantidade}`).join(", ") || "-"}</td>
            <td>R$ ${p.total.toFixed(2)}</td>
            <td>${p.formaPagamento}</td>
            <td>${new Date(p.data).toLocaleString()}</td>
        </tr>
    `).join("");

    document.getElementById("modalPedidosCaixa").style.display = "flex";
}

// Fechar modal pedidos
document.getElementById("fecharModalPedidos").addEventListener("click", () => {
    document.getElementById("modalPedidosCaixa").style.display = "none";
});

document.getElementById("voltarPedidos").addEventListener("click", () => {
    window.location.href = "index.html";
});

// Modal de vendas
const modalVendas = document.getElementById("modalVendas");
const verVendasBtn = document.getElementById("verVendasBtn");
const fecharModalVendas = document.getElementById("fecharModalVendas");

verVendasBtn.addEventListener("click", async () => {
    modalVendas.style.display = "flex";
    try {
        const res = await fetch("http://localhost:3000/api/caixaVendas");
        const data = await res.json();

        const renderResumo = (containerId, vendas) => {
            const container = document.getElementById(containerId);
            container.innerHTML = ""; // limpar conteúdo
            for (const [produto, info] of Object.entries(vendas)) {
                const li = document.createElement("li");
                li.textContent = `${produto} — ${info.quantidade} un — R$ ${info.valor.toFixed(2)}`;
                container.appendChild(li);
            }
        };

        renderResumo("vendasDia", data.dia);
        renderResumo("vendasSemana", data.semana);
        renderResumo("vendasMes", data.mes);

    } catch (err) {
        console.error("Erro ao carregar vendas:", err);
    }
});


fecharModalVendas.addEventListener("click", () => {
    modalVendas.style.display = "none";
});

window.addEventListener("DOMContentLoaded", carregarCaixa);
