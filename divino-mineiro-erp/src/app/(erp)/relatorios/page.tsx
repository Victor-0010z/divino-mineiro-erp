"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Bike,
  CalendarRange,
  FileClock,
  ListTodo,
  Printer,
  ReceiptText,
  ShoppingCart,
  Truck,
  UsersRound,
} from "lucide-react";
import {
  contasPagarMock,
  diaristasMock,
  fornecedoresMock,
  motoboysMock,
  solicitacoesMock,
  tarefasMock,
} from "@/lib/mock-data";
import { moeda } from "@/lib/utils";
import { PageHeading } from "@/components/page-heading";
import { DownloadReportButton } from "@/components/download-report-button";
import { lerFechamentosMotoboys, type MotoboyFechamento } from "@/lib/motoboy-history";

const secoes = [
  { id: "contas", nome: "Contas a pagar", icon: ReceiptText },
  { id: "compras", nome: "Compras e solicitações", icon: ShoppingCart },
  { id: "diaristas", nome: "Diaristas", icon: UsersRound },
  { id: "motoboys", nome: "Motoboys", icon: Bike },
  { id: "fornecedores", nome: "Fornecedores", icon: Truck },
  { id: "tarefas", nome: "Tarefas", icon: ListTodo },
  { id: "auditoria", nome: "Auditoria", icon: FileClock },
];

export default function Relatorios() {
  const [secao, setSecao] = useState("contas"),
    [busca, setBusca] = useState(""),
    [inicio, setInicio] = useState("2026-09-01"),
    [fim, setFim] = useState("2026-09-30"),
    [inicioRascunho, setInicioRascunho] = useState(inicio),
    [fimRascunho, setFimRascunho] = useState(fim),
    [calendarioAberto, setCalendarioAberto] = useState(false),
    [fechamentos, setFechamentos] = useState<MotoboyFechamento[]>([]);

  useEffect(() => setFechamentos(lerFechamentosMotoboys()), []);

  const linhas = useMemo(() => {
    const q = busca.toLowerCase();
    if (secao === "contas")
      return contasPagarMock
        .filter((i) =>
          (i.descricao + i.fornecedorNome).toLowerCase().includes(q),
        )
        .map((i) => [
          i.descricao,
          i.fornecedorNome,
          i.dataVencimento,
          moeda(i.valor),
          i.status,
        ]);
    if (secao === "compras")
      return solicitacoesMock
        .filter((i) =>
          (i.solicitanteNome + i.fornecedorNome).toLowerCase().includes(q),
        )
        .map((i) => [
          i.solicitanteNome,
          i.fornecedorNome,
          i.dataNecessaria,
          moeda(i.valorTotal),
          i.status,
        ]);
    if (secao === "diaristas")
      return diaristasMock
        .filter((i) => i.nome.toLowerCase().includes(q))
        .map((i) => [
          i.nome,
          i.chavePix,
          "Diária",
          moeda(i.valorPadraoDiaria),
          i.ativo ? "ATIVO" : "INATIVO",
        ]);
    if (secao === "motoboys") {
      const noPeriodo = fechamentos.filter((fechamento) => fechamento.fim >= inicio && fechamento.inicio <= fim);
      const somados = new Map<string, { nome: string; pix: string; valor: number; pagos: number; pendentes: number }>();
      noPeriodo.forEach((fechamento) => fechamento.itens.forEach((item) => {
        const atual = somados.get(item.motoboyId) || { nome: item.nome, pix: item.chavePix, valor: 0, pagos: 0, pendentes: 0 };
        atual.valor += item.valor;
        if (item.status === "PAGO") atual.pagos += 1;
        else atual.pendentes += 1;
        somados.set(item.motoboyId, atual);
      }));
      return [...somados.values()]
        .filter((item) => (item.nome + item.pix).toLowerCase().includes(q))
        .map((item) => [
          item.nome,
          item.pix,
          `${inicio.split("-").reverse().join("/")} a ${fim.split("-").reverse().join("/")}`,
          moeda(item.valor),
          item.pendentes === 0 ? "PAGO" : item.pagos === 0 ? "PENDENTE" : `PARCIAL (${item.pagos} pago / ${item.pendentes} pendente)`,
        ]);
    }
    if (secao === "fornecedores")
      return fornecedoresMock
        .filter((i) => i.nomeFantasia.toLowerCase().includes(q))
        .map((i) => [
          i.nomeFantasia,
          i.documento,
          "Acumulado",
          moeda(i.totalComprado),
          i.ativo ? "ATIVO" : "INATIVO",
        ]);
    if (secao === "tarefas")
      return tarefasMock
        .filter((i) =>
          (i.titulo + i.responsavelNome + i.categoria)
            .toLowerCase()
            .includes(q),
        )
        .map((i) => [
          i.titulo,
          i.responsavelNome,
          i.prazo,
          i.categoria,
          i.status,
        ]);
    return [
      [
        "Carlos Andrade",
        "Dashboard",
        "22/09/2026 09:12",
        "Login realizado",
        "REGISTRADO",
      ],
      [
        "Fernanda Lopes",
        "Contas",
        "22/09/2026 08:44",
        "Boleto cadastrado",
        "REGISTRADO",
      ],
    ];
  }, [secao, busca, inicio, fim, fechamentos]);
  const nomeSecao = secoes.find((s) => s.id === secao)?.nome || "Relatório";
  const rows = [
    ["Nome / descrição", "Referência", "Data / tipo", "Valor / ação", "Status"],
    ...linhas,
  ];
  return (
    <>
      <PageHeading
        title="Relatórios"
        description="Consulte todo o histórico por assunto, nome e período."
        action={
          <div className="flex gap-2">
            <DownloadReportButton filename={`relatorio-${secao}`} rows={rows} />
            <button className="btn-outline" onClick={() => window.print()}>
              <Printer size={17} />
              Salvar PDF
            </button>
          </div>
        }
      />
      <div className="grid gap-5 xl:grid-cols-[250px_1fr]">
        <aside className="card h-fit p-2">
          <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-foreground/45">
            Seções
          </p>
          {secoes.map(({ id, nome, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSecao(id)}
              className={`report-nav ${secao === id ? "active" : ""}`}
            >
              <Icon size={17} />
              {nome}
            </button>
          ))}
        </aside>
        <section>
          <div className="card relative z-20 mb-5 grid gap-3 md:grid-cols-[1fr_310px]">
            <input
              className="input"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder={`Filtrar em ${nomeSecao.toLowerCase()}...`}
            />
            <div className="relative">
              <button className="date-range-trigger" onClick={() => setCalendarioAberto((aberto) => !aberto)}>
                <CalendarRange size={18} />
                <span>{inicio.split("-").reverse().join("/")} — {fim.split("-").reverse().join("/")}</span>
              </button>
              {calendarioAberto && (
                <div className="date-range-popover">
                  <p className="mb-3 font-semibold">Escolha o período</p>
                  <label><span className="label">Data inicial</span><input className="input" type="date" value={inicioRascunho} onChange={(e) => setInicioRascunho(e.target.value)} /></label>
                  <label><span className="label mt-3">Data final</span><input className="input" type="date" min={inicioRascunho} value={fimRascunho} onChange={(e) => setFimRascunho(e.target.value)} /></label>
                  <button
                    className="btn-primary mt-4 w-full"
                    onClick={() => {
                      if (fimRascunho < inicioRascunho) return alert("A data final precisa ser posterior à data inicial.");
                      setInicio(inicioRascunho);
                      setFim(fimRascunho);
                      setCalendarioAberto(false);
                    }}
                  >Aplicar período</button>
                </div>
              )}
            </div>
          </div>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <h2 className="section-title">{nomeSecao}</h2>
              <p className="text-sm text-foreground/50">
                {inicio.split("-").reverse().join("/")} a{" "}
                {fim.split("-").reverse().join("/")}
              </p>
            </div>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-primary">
              {linhas.length} registros
            </span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {rows[0].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {linhas.map((linha, i) => (
                  <tr key={i}>
                    {linha.map((celula, j) => (
                      <td key={j} className={j === 0 ? "font-semibold" : ""}>
                        {celula}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
