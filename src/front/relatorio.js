const gerarBtn = document.getElementById("gerarRelatorioBtn");
const tipoSelect = document.getElementById("tipoRelatorio");
const tabelaBody = document.querySelector("#tabelaRelatorio tbody");

gerarBtn.addEventListener("click", async () => {
    const tipo = tipoSelect.value;

    try {
        const res = await fetch("http://localhost:3000/api/relatorios/gerar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tipo })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.msg || "Erro ao gerar relatório");

        const dados = JSON.parse(data.relatorio.dados);

        tabelaBody.innerHTML = Object.entries(dados)
            .map(([chave, valor]) => `<tr><td>${chave}</td><td>${valor}</td></tr>`)
            .join("");

    } catch (err) {
        alert(err.message);
        console.error("Erro ao gerar relatório:", err);
    }
});
