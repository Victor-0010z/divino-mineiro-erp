import { Download, TrendingUp } from "lucide-react";
import { contasPagarMock, fornecedoresMock, registrosDiariaMock } from "@/lib/mock-data";
import { moeda } from "@/lib/utils";
import { PageHeading } from "@/components/page-heading";

export default function Relatorios() {
  const pago = contasPagarMock.filter((c) => c.status === "PAGO").reduce((s, c) => s + c.valor, 0);
  const pendente = contasPagarMock.filter((c) => c.status !== "PAGO" && c.status !== "CANCELADO").reduce((s, c) => s + c.valor, 0);
  return (<>
    <PageHeading title="Relatórios" description="Visão consolidada das despesas e operações." action={<button className="btn-outline"><Download size={17}/>Exportar PDF</button>}/>
    <section className="grid gap-4 md:grid-cols-3">
      <div className="card"><p className="text-sm text-foreground/50">Pago no período</p><b className="mt-2 block text-2xl text-success">{moeda(pago)}</b></div>
      <div className="card"><p className="text-sm text-foreground/50">Total pendente</p><b className="mt-2 block text-2xl text-gold">{moeda(pendente)}</b></div>
      <div className="card"><p className="text-sm text-foreground/50">Diárias registradas</p><b className="mt-2 block text-2xl">{registrosDiariaMock.length}</b></div>
    </section>
    <section className="mt-6 grid gap-6 lg:grid-cols-2">
      <div className="card"><div className="flex items-center gap-2"><TrendingUp className="text-primary"/><h2 className="font-bold">Compras por fornecedor</h2></div><div className="mt-5 space-y-4">{fornecedoresMock.map((f) => <div key={f.id}><div className="mb-1 flex justify-between text-sm"><span>{f.nomeFantasia}</span><b>{moeda(f.totalComprado)}</b></div><div className="h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{width:`${Math.min(100,f.totalComprado/1200)}%`}}/></div></div>)}</div></div>
      <div className="card"><h2 className="font-bold">Distribuição das contas</h2><div className="mt-5 grid grid-cols-2 gap-3">{["PENDENTE","PAGO","VENCIDO","CANCELADO"].map((s) => <div className="rounded-xl bg-muted p-4" key={s}><p className="text-xs text-foreground/50">{s}</p><b className="text-2xl">{contasPagarMock.filter((c) => c.status === s).length}</b></div>)}</div></div>
    </section>
  </>);
}
