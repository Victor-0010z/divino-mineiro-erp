"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { tarefasMock } from "@/lib/mock-data";
import type { StatusTarefa, Tarefa } from "@/types";
import { dataBr } from "@/lib/utils";
import { PageHeading } from "@/components/page-heading";
import { StatusBadge } from "@/components/status-badge";
const colunas:[StatusTarefa,string][]=[["PENDENTE","Pendente"],["EM_ANDAMENTO","Em andamento"],["AGUARDANDO","Aguardando"],["CONCLUIDA","Concluída"]];
export default function Tarefas(){const [tarefas,setTarefas]=useState<Tarefa[]>(tarefasMock);function mover(id:string,status:StatusTarefa){setTarefas(tarefas.map(t=>t.id===id?{...t,status}:t))}return <><PageHeading title="Tarefas" description="Organize as atividades diárias e da diretoria." action={<button className="btn-primary"><Plus size={17}/>Nova tarefa</button>}/><div className="grid gap-4 xl:grid-cols-4">{colunas.map(([status,label])=><section key={status} className="rounded-2xl bg-muted/55 p-3"><div className="mb-3 flex items-center justify-between"><b>{label}</b><span className="rounded-full bg-card px-2 py-0.5 text-xs">{tarefas.filter(t=>t.status===status).length}</span></div><div className="space-y-3">{tarefas.filter(t=>t.status===status).map(t=><article key={t.id} className="rounded-xl border bg-card p-4 shadow-sm"><div className="mb-2 flex items-start justify-between gap-2"><h3 className="font-semibold">{t.titulo}</h3><StatusBadge status={t.prioridade}/></div><p className="text-xs text-foreground/50">{t.categoria} • {t.responsavelNome}</p><p className="mt-3 text-xs">Prazo: {dataBr(t.prazo)}</p><select aria-label="Alterar status" className="input mt-3 h-9" value={t.status} onChange={e=>mover(t.id,e.target.value as StatusTarefa)}>{colunas.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></article>)}</div></section>)}</div></>}
