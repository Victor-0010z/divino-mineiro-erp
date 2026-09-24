"use client";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Plus, Search } from "lucide-react";
import { tarefasMock } from "@/lib/mock-data";
import type { StatusTarefa, Tarefa } from "@/types";
import { dataBr } from "@/lib/utils";
import { PageHeading } from "@/components/page-heading";
import { StatusBadge } from "@/components/status-badge";
const colunas: { status: StatusTarefa; label: string; className: string }[] = [
  { status: "PENDENTE", label: "Pendentes", className: "kanban-pending" },
  {
    status: "EM_ANDAMENTO",
    label: "Em andamento",
    className: "kanban-progress",
  },
  { status: "CONCLUIDA", label: "Concluídas", className: "kanban-done" },
];
export default function Tarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>(tarefasMock),
    [busca, setBusca] = useState("");
  const filtradas = useMemo(
    () =>
      tarefas.filter((t) =>
        (t.titulo + t.responsavelNome + t.categoria)
          .toLowerCase()
          .includes(busca.toLowerCase()),
      ),
    [tarefas, busca],
  );
  const mover = (id: string, status: StatusTarefa) =>
    setTarefas((a) => a.map((i) => (i.id === id ? { ...i, status } : i)));
  const voltar = (t: Tarefa) =>
    mover(t.id, t.status === "CONCLUIDA" ? "EM_ANDAMENTO" : "PENDENTE");
  const avancar = (t: Tarefa) =>
    mover(t.id, t.status === "PENDENTE" ? "EM_ANDAMENTO" : "CONCLUIDA");
  const finalizar = (id: string) =>
    confirm("Finalizar e excluir esta tarefa definitivamente?") &&
    setTarefas((a) => a.filter((t) => t.id !== id));
  return (
    <>
      <PageHeading
        title="Tarefas"
        description="Fluxo diário com avanço e retorno entre etapas."
        action={
          <button className="btn-primary">
            <Plus size={17} />
            Nova tarefa
          </button>
        }
      />
      <div className="card mb-4 flex items-center gap-2 py-3">
        <Search size={17} />
        <input
          className="w-full bg-transparent outline-none"
          placeholder="Filtrar por tarefa, responsável ou categoria..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        {colunas.map((c) => (
          <section
            key={c.status}
            className={`rounded-2xl border p-3 ${c.className}`}
          >
            <div className="mb-3 flex items-center justify-between">
              <b>{c.label}</b>
              <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-bold">
                {filtradas.filter((t) => t.status === c.status).length}
              </span>
            </div>
            <div className="space-y-3">
              {filtradas
                .filter((t) => t.status === c.status)
                .map((t) => (
                  <article
                    key={t.id}
                    className="rounded-xl border bg-card p-4 shadow-sm"
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="font-semibold">{t.titulo}</h3>
                      <StatusBadge status={t.prioridade} />
                    </div>
                    <p className="text-xs text-foreground/55">
                      {t.categoria} • {t.responsavelNome}
                    </p>
                    <p className="mt-3 text-xs">Prazo: {dataBr(t.prazo)}</p>
                    <div className="mt-4 flex gap-2">
                      {t.status !== "PENDENTE" && (
                        <button
                          className="btn-outline flex-1"
                          onClick={() => voltar(t)}
                        >
                          <ArrowLeft size={16} />
                          Voltar
                        </button>
                      )}
                      {t.status === "CONCLUIDA" ? (
                        <button
                          aria-label="Finalizar e descartar tarefa"
                          className="finish-button"
                          onClick={() => finalizar(t.id)}
                        >
                          <svg
                            viewBox="0 0 448 512"
                            className="finish-icon"
                            aria-hidden="true"
                          >
                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                          </svg>
                          <span>Finalizar</span>
                        </button>
                      ) : (
                        <button
                          className="btn-primary flex-1"
                          onClick={() => avancar(t)}
                        >
                          {t.status === "PENDENTE" ? "Iniciar" : "Concluir"}
                          {t.status === "EM_ANDAMENTO" ? (
                            <Check size={16} />
                          ) : (
                            <ArrowRight size={16} />
                          )}
                        </button>
                      )}
                    </div>
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
