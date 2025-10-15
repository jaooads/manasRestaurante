const statusCaixa = document.getElementById("statusCaixa");
const totalVendido = document.getElementById("totalVendido");
const totalDinheiro = document.getElementById("totalDinheiro");
const totalPix = document.getElementById("totalPix");
const totalCartao = document.getElementById("totalCartao");
const tabelaHistorico = document.querySelector("#tabelaHistoricoCaixa tbody");
const abrirCaixaBtn = document.getElementById("abrirCaixaBtn");
const fecharCaixaBtn = document.getElementById("fecharCaixaBtn");

// Abrir caixa
abrirCaixaBtn.addEventListener("click", async () => {
    try {
        const res = await fetch("http://localhost:3000/api/caixa/abrir", { method: "POST" });
        const data = await res.json();
        if (res.ok) {
            carregarHistoricoCaixa();
        } else alert(data.msg);
    } catch (err) {
        console.error("Erro ao abrir caixa:", err);
    }
});

// Fechar caixa
fecharCaixaBtn.addEventListener("click", async () => {
    try {
        const res = await fetch("http://localhost:3000/api/caixa/fechar", { method: "POST" });
        const data = await res.json();
        if (res.ok) {
            carregarHistoricoCaixa();
        } else alert(data.msg);
    } catch (err) {
        console.error("Erro ao fechar caixa:", err);
    }
});

async function carregarHistoricoCaixa() {
    try {
        const res = await fetch("http://localhost:3000/api/caixa/historico");
        const caixas = await res.json();

        if (!Array.isArray(caixas) || caixas.length === 0) return;

        const caixa = caixas[0]; // pega a caixa mais recente (ou aberta)

        document.getElementById("statusCaixa").textContent = caixa.status.toUpperCase();
        document.getElementById("totalVendido").textContent = `R$ ${caixa.totalVendido.toFixed(2)}`;

        const totais = caixa.totaisPorPagamento;
        const lista = document.getElementById("totaisPagamento");
        lista.innerHTML = `
            <li>Dinheiro: R$ ${totais.dinheiro.toFixed(2)}</li>
            <li>PIX: R$ ${totais.pix.toFixed(2)}</li>
            <li>Cartão: R$ ${totais.cartao.toFixed(2)}</li>
        `;

        const tbody = document.querySelector("#historicoCaixa tbody");
        tbody.innerHTML = caixa.pedido.map(p => `
            <tr>
                <td>${p.id}</td>
                <td>${p.cliente || "-"}</td>
                <td>${p.itens.map(i => i.descricao + " x" + i.quantidade).join(", ")}</td>
                <td>R$ ${p.total.toFixed(2)}</td>
                <td>${p.formaPagamento || "-"}</td>
                <td>${new Date(p.data).toLocaleString()}</td>
            </tr>
        `).join("");

    } catch (err) {
        console.error("Erro ao carregar histórico do caixa:", err);
    }
}
