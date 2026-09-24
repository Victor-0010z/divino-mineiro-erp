"use client";
import { useMemo, useState } from "react";
import { CheckCircle2, Pencil, Plus, Trash2, UserRoundPlus, X } from "lucide-react";
import { diaristasMock } from "@/lib/mock-data";
import type { Diarista } from "@/types";
import { moeda } from "@/lib/utils";
import { PageHeading } from "@/components/page-heading";
import { EntityTable } from "@/components/entity-table";
import { StatusBadge } from "@/components/status-badge";
import { TableFilter } from "@/components/table-filter";

type Escala = { id: string; diaristaId: string; status: "PENDENTE" | "PAGO"; valor: number };

export default function Diaristas() {
  const [lista, setLista] = useState<Diarista[]>(diaristasMock);
  const [escalados, setEscalados] = useState<Escala[]>([]);
  const [selecionado, setSelecionado] = useState("");
  const [buscaHoje, setBuscaHoje] = useState("");
  const [buscaCadastro, setBuscaCadastro] = useState("");
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<Diarista | null>(null);
  const cadastros = useMemo(() => lista.filter((d) => (d.nome + d.cpf + d.chavePix).toLowerCase().includes(buscaCadastro.toLowerCase())), [lista, buscaCadastro]);
  const hoje = useMemo(() => escalados.filter((e) => (lista.find((d) => d.id === e.diaristaId)?.nome || "").toLowerCase().includes(buscaHoje.toLowerCase())), [escalados, lista, buscaHoje]);

  function escalar() {
    const diarista = lista.find((d) => d.id === selecionado);
    if (!diarista || escalados.some((e) => e.diaristaId === diarista.id)) return;
    setEscalados((atual) => [{ id: crypto.randomUUID(), diaristaId: diarista.id, status: "PENDENTE", valor: diarista.valorPadraoDiaria }, ...atual]);
    setSelecionado("");
  }
  function salvar(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault(); const f = new FormData(evento.currentTarget);
    const d: Diarista = { id: editando?.id || crypto.randomUUID(), nome: String(f.get("nome")), cpf: String(f.get("cpf")), telefone: String(f.get("telefone")), chavePix: String(f.get("pix")), banco: String(f.get("banco")), valorPadraoDiaria: Number(f.get("valor")), ativo: true };
    setLista((atual) => editando ? atual.map((item) => item.id === d.id ? d : item) : [d, ...atual]); setModal(false); setEditando(null);
  }

  return <><PageHeading title="Diaristas" description="Escale o dia usando os profissionais já cadastrados." action={<button className="btn-primary" onClick={() => { setEditando(null); setModal(true); }}><Plus size={17}/>Novo cadastro</button>}/>
    <section className="card mb-6"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="section-title">Diaristas de hoje</h2><p className="text-sm text-foreground/55">Selecione um cadastro para escalar e liberar o pagamento.</p></div><div className="flex min-w-[300px] flex-1 justify-end gap-2"><select className="input max-w-sm" value={selecionado} onChange={(e) => setSelecionado(e.target.value)}><option value="">Selecione um diarista...</option>{lista.filter((d) => !escalados.some((e) => e.diaristaId === d.id)).map((d) => <option key={d.id} value={d.id}>{d.nome} — {moeda(d.valorPadraoDiaria)}</option>)}</select><button className="btn-primary" onClick={escalar} disabled={!selecionado}><UserRoundPlus size={17}/>Escalar</button></div></div><TableFilter value={buscaHoje} onChange={setBuscaHoje} placeholder="Buscar na escala de hoje..."/><EntityTable headers={["Nome", "PIX", "Valor", "Pagamento", "Ação"]}>{hoje.map((escala) => { const d = lista.find((item) => item.id === escala.diaristaId); return d && <tr key={escala.id}><td className="font-semibold">{d.nome}</td><td>{d.chavePix}</td><td>{moeda(escala.valor)}</td><td><StatusBadge status={escala.status}/></td><td><button className="btn-outline" disabled={escala.status === "PAGO"} onClick={() => setEscalados((atual) => atual.map((item) => item.id === escala.id ? { ...item, status: "PAGO" } : item))}><CheckCircle2 size={16}/>Pagar diária</button></td></tr>; })}</EntityTable>{!hoje.length && <p className="py-5 text-center text-sm text-foreground/50">Nenhum diarista escalado para hoje.</p>}</section>
    <section><div className="mb-3"><h2 className="section-title">Cadastros de diaristas</h2><p className="text-sm text-foreground/55">Cadastre cada profissional uma única vez.</p></div><TableFilter value={buscaCadastro} onChange={setBuscaCadastro} placeholder="Buscar nome, CPF ou PIX nos cadastros..."/><EntityTable headers={["Nome", "CPF", "Telefone", "PIX / Banco", "Diária", "Status", "Ações"]}>{cadastros.map((d) => <tr key={d.id}><td className="font-semibold">{d.nome}</td><td>{d.cpf}</td><td>{d.telefone}</td><td>{d.chavePix}<p className="text-xs text-foreground/45">{d.banco}</p></td><td>{moeda(d.valorPadraoDiaria)}</td><td><StatusBadge status={d.ativo ? "ATIVO" : "INATIVO"}/></td><td><div className="flex gap-1"><button className="icon-action" onClick={() => { setEditando(d); setModal(true); }}><Pencil/></button><button className="icon-action text-red-600" onClick={() => confirm("Excluir diarista?") && setLista((atual) => atual.filter((item) => item.id !== d.id))}><Trash2/></button></div></td></tr>)}</EntityTable></section>
    {modal && <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"><form onSubmit={salvar} className="card w-full max-w-xl"><div className="mb-5 flex justify-between"><h2 className="text-xl font-bold">{editando ? "Editar" : "Novo"} diarista</h2><button type="button" onClick={() => setModal(false)}><X/></button></div><div className="grid gap-4 sm:grid-cols-2">{[["nome", "Nome completo", editando?.nome], ["cpf", "CPF", editando?.cpf], ["telefone", "Telefone", editando?.telefone], ["pix", "Chave PIX", editando?.chavePix], ["banco", "Banco", editando?.banco], ["valor", "Valor da diária", editando?.valorPadraoDiaria]].map(([n, l, v]) => <label key={String(n)}><span className="label">{l}</span><input name={String(n)} defaultValue={v} type={n === "valor" ? "number" : "text"} step="0.01" className="input" required/></label>)}</div><button className="btn-primary mt-6">Salvar cadastro</button></form></div>}
  </>;
}
