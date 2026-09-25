"use client";

import { useMemo, useState } from "react";
import {
  CalendarCheck2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { motoboysMock, jornadasMotoboyMock } from "@/lib/mock-data";
import type { Motoboy } from "@/types";
import { moeda } from "@/lib/utils";
import { PageHeading } from "@/components/page-heading";
import { DownloadReportButton } from "@/components/download-report-button";
import { TableFilter } from "@/components/table-filter";
import {
  lerFechamentosMotoboys,
  salvarFechamentosMotoboys,
  type StatusPagamentoMotoboy,
} from "@/lib/motoboy-history";

const dias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const ocorrencias = [
  "TRABALHOU",
  "FOLGA",
  "FALTOU",
  "FERIADO",
  "ATESTADO",
] as const;
type Ocorrencia = (typeof ocorrencias)[number];
type Dia = { tipo: Ocorrencia; valor: number };

function semanaAtual() {
  const hoje = new Date();
  const dia = hoje.getDay();
  const segunda = new Date(hoje);
  segunda.setDate(hoje.getDate() - (dia === 0 ? 6 : dia - 1));
  const sabado = new Date(segunda);
  sabado.setDate(segunda.getDate() + 5);
  const iso = (data: Date) => {
    const local = new Date(data.getTime() - data.getTimezoneOffset() * 60_000);
    return local.toISOString().slice(0, 10);
  };
  return { inicio: iso(segunda), fim: iso(sabado) };
}

function jornadaInicial(motoboyId: string): Dia[] {
  const jornada = jornadasMotoboyMock.find(
    (item) => item.motoboyId === motoboyId,
  );
  return dias.map((_, index) => ({
    tipo: jornada?.folgas.includes(index) ? "FOLGA" : "TRABALHOU",
    valor: jornada?.valores[index] || 0,
  }));
}

export default function Motoboys() {
  const [lista, setLista] = useState<Motoboy[]>(motoboysMock);
  const [jornadas, setJornadas] = useState<Record<string, Dia[]>>(() =>
    Object.fromEntries(motoboysMock.map((m) => [m.id, jornadaInicial(m.id)])),
  );
  const [busca, setBusca] = useState("");
  const [{ inicio, fim }] = useState(semanaAtual);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<Motoboy | null>(null);
  const filtrados = useMemo(
    () =>
      lista.filter((m) => m.nome.toLowerCase().includes(busca.toLowerCase())),
    [lista, busca],
  );
  const total = (id: string) =>
    (jornadas[id] || []).reduce(
      (s, dia) => s + (dia.tipo === "TRABALHOU" ? dia.valor : 0),
      0,
    );

  function atualizarDia(id: string, indice: number, alteracao: Partial<Dia>) {
    setJornadas((atual) => ({
      ...atual,
      [id]: (atual[id] || jornadaInicial(id)).map((dia, i) =>
        i === indice
          ? {
              ...dia,
              ...alteracao,
              valor:
                alteracao.tipo && alteracao.tipo !== "TRABALHOU"
                  ? 0
                  : (alteracao.valor ?? dia.valor),
            }
          : dia,
      ),
    }));
    setLista((atual) =>
      atual.map((item) =>
        item.id === id ? { ...item, statusPagamento: "PENDENTE" } : item,
      ),
    );
  }

  function mudarPagamento(id: string, statusPagamento: StatusPagamentoMotoboy) {
    setLista((atual) =>
      atual.map((item) =>
        item.id === id ? { ...item, statusPagamento } : item,
      ),
    );
  }

  function fecharSemana() {
    if (!confirm(`Fechar a semana de ${inicio.split("-").reverse().join("/")} a ${fim.split("-").reverse().join("/")}? Os lançamentos serão enviados aos relatórios e esta tela será zerada.`)) return;
    const fechamento = {
      id: crypto.randomUUID(),
      inicio,
      fim,
      fechadoEm: new Date().toISOString(),
      itens: lista.map((motoboy) => ({
        motoboyId: motoboy.id,
        nome: motoboy.nome,
        chavePix: motoboy.chavePix,
        valor: total(motoboy.id),
        status: motoboy.statusPagamento,
      })),
    };
    salvarFechamentosMotoboys([fechamento, ...lerFechamentosMotoboys()]);
    setJornadas((atual) => ({
      ...Object.fromEntries(Object.keys(atual).map((id) => [id, dias.map(() => ({ tipo: "TRABALHOU" as const, valor: 0 }))])),
    }));
    setLista((atual) => atual.map((item) => ({ ...item, statusPagamento: "PENDENTE" })));
    alert("Semana fechada e enviada para Relatórios > Motoboys.");
  }

  function salvar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    const motoboy: Motoboy = {
      id: editando?.id || crypto.randomUUID(),
      nome: String(dados.get("nome")),
      telefone: String(dados.get("telefone")),
      chavePix: String(dados.get("pix")),
      valorDiaria: Number(dados.get("diaria")),
      ativo: true,
      statusPagamento: editando?.statusPagamento || "PENDENTE",
    };
    setLista((atual) =>
      editando
        ? atual.map((item) => (item.id === motoboy.id ? motoboy : item))
        : [motoboy, ...atual],
    );
    if (!editando)
      setJornadas((atual) => ({
        ...atual,
        [motoboy.id]: dias.map(() => ({ tipo: "TRABALHOU", valor: 0 })),
      }));
    setModal(false);
    setEditando(null);
  }

  const rows = [
    ["Motoboy", ...dias, "Total", "Pagamento"],
    ...lista.map((m) => [
      m.nome,
      ...(jornadas[m.id] || []).map((d) =>
        d.tipo === "TRABALHOU" ? d.valor : d.tipo,
      ),
      total(m.id),
      m.statusPagamento,
    ]),
  ];

  return (
    <>
      <PageHeading
        title="Motoboys"
        description="Escala diária, ocorrências e fechamento semanal."
        action={
          <div className="flex flex-wrap gap-2">
            <DownloadReportButton filename="motoboys-semana" rows={rows} />
            <button
              className="btn-primary"
              onClick={() => {
                setEditando(null);
                setModal(true);
              }}
            >
              <Plus size={17} />
              Novo motoboy
            </button>
          </div>
        }
      />
      <div className="mb-5 flex items-center gap-2 rounded-xl bg-orange-50 px-4 py-3 text-sm font-semibold text-primary">
        <CalendarCheck2 size={18} />
        Semana atual: {inicio.split("-").reverse().join("/")} — {fim.split("-").reverse().join("/")}
      </div>
      <section className="mb-5 grid gap-4 sm:grid-cols-3">
        <div className="card">
          <p className="metric-label">Ativos</p>
          <b className="metric-value">{lista.filter((m) => m.ativo).length}</b>
        </div>
        <div className="card">
          <p className="metric-label">Total da semana</p>
          <b className="metric-value text-primary">
            {moeda(lista.reduce((s, m) => s + total(m.id), 0))}
          </b>
        </div>
        <div className="card">
          <p className="metric-label">Pagamentos pendentes</p>
          <b className="metric-value text-amber-600">
            {lista.filter((m) => m.statusPagamento === "PENDENTE").length}
          </b>
        </div>
      </section>
      <TableFilter
        value={busca}
        onChange={setBusca}
        placeholder="Buscar motoboy..."
      />
      <div className="table-wrap motoboy-table">
        <table>
          <thead>
            <tr>
              <th>Motoboy</th>
              {dias.map((dia) => (
                <th key={dia}>{dia}</th>
              ))}
              <th>Total</th>
              <th>Pagamento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((m) => (
              <tr key={m.id}>
                <td>
                  <b>{m.nome}</b>
                  <p className="text-xs text-foreground/45">
                    PIX: {m.chavePix}
                  </p>
                </td>
                {(jornadas[m.id] || jornadaInicial(m.id)).map((dia, indice) => (
                  <td key={dias[indice]}>
                    <div className="min-w-28 space-y-1">
                      <select
                        className={`mini-select occurrence-${dia.tipo.toLowerCase()}`}
                        value={dia.tipo}
                        onChange={(e) =>
                          atualizarDia(m.id, indice, {
                            tipo: e.target.value as Ocorrencia,
                          })
                        }
                      >
                        {ocorrencias.map((opcao) => (
                          <option key={opcao}>{opcao}</option>
                        ))}
                      </select>
                      {dia.tipo === "TRABALHOU" && (
                        <input
                          aria-label={`Valor de ${dias[indice]}`}
                          className="mini-input"
                          type="number"
                          step="0.01"
                          min="0"
                          value={dia.valor}
                          onChange={(e) =>
                            atualizarDia(m.id, indice, {
                              valor: Number(e.target.value),
                            })
                          }
                        />
                      )}
                    </div>
                  </td>
                ))}
                <td className="font-bold text-primary">{moeda(total(m.id))}</td>
                <td>
                  <select
                    aria-label={`Pagamento de ${m.nome}`}
                    className={`mini-select payment-${m.statusPagamento.toLowerCase()}`}
                    value={m.statusPagamento}
                    onChange={(e) => mudarPagamento(m.id, e.target.value as StatusPagamentoMotoboy)}
                  >
                    <option value="PENDENTE">Pendente</option>
                    <option value="PAGO">Pago</option>
                  </select>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button
                      aria-label="Editar"
                      className="icon-action"
                      onClick={() => {
                        setEditando(m);
                        setModal(true);
                      }}
                    >
                      <Pencil />
                    </button>
                    <button
                      aria-label="Excluir"
                      className="icon-action text-red-600"
                      onClick={() =>
                        confirm("Excluir motoboy?") &&
                        setLista((atual) =>
                          atual.filter((item) => item.id !== m.id),
                        )
                      }
                    >
                      <Trash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="mt-5 rounded-2xl border border-orange-200 bg-orange-50 p-5 text-center">
        <p className="mb-3 text-sm text-foreground/65">Ao fechar, os valores e pagamentos desta semana serão guardados no histórico e os campos voltarão a zero.</p>
        <button className="btn-primary h-12 w-full text-base" onClick={fecharSemana}>
          <CalendarCheck2 size={19} />
          Fechar a semana
        </button>
      </section>
      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
          <form onSubmit={salvar} className="card w-full max-w-2xl">
            <div className="mb-5 flex justify-between">
              <h2 className="text-xl font-bold">
                {editando ? "Editar" : "Novo"} motoboy
              </h2>
              <button type="button" onClick={() => setModal(false)}>
                <X />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ["nome", "Nome", editando?.nome],
                ["telefone", "Telefone", editando?.telefone],
                ["pix", "Chave PIX", editando?.chavePix],
                ["diaria", "Valor da diária", editando?.valorDiaria],
              ].map(([nome, label, valor]) => (
                <label key={String(nome)}>
                  <span className="label">{label}</span>
                  <input
                    className="input"
                    name={String(nome)}
                    defaultValue={valor}
                    type={nome === "diaria" ? "number" : "text"}
                    step="0.01"
                    required
                  />
                </label>
              ))}
            </div>
            <button className="btn-primary mt-6">Salvar cadastro</button>
          </form>
        </div>
      )}
    </>
  );
}
