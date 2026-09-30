"use client";

import { useMemo, useState } from "react";
import { addMonths, eachDayOfInterval, endOfMonth, format, getDay, isAfter, isBefore, isEqual, parseISO, startOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarRange, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

type Props = {
  inicio: string;
  fim: string;
  onApply: (inicio: string, fim: string) => void;
};

const iso = (data: Date) => format(data, "yyyy-MM-dd");
const br = (data: string) => format(parseISO(data), "dd/MM/yyyy");

export function DateRangePicker({ inicio, fim, onApply }: Props) {
  const [aberto, setAberto] = useState(false);
  const [mes, setMes] = useState(startOfMonth(new Date()));
  const [rascunhoInicio, setRascunhoInicio] = useState(inicio);
  const [rascunhoFim, setRascunhoFim] = useState(fim);
  const dias = useMemo(() => eachDayOfInterval({ start: startOfMonth(mes), end: endOfMonth(mes) }), [mes]);
  const recuo = (getDay(startOfMonth(mes)) + 6) % 7;

  function selecionar(data: Date) {
    const valor = iso(data);
    if (!rascunhoInicio || rascunhoFim) {
      setRascunhoInicio(valor);
      setRascunhoFim("");
      return;
    }
    if (isBefore(data, parseISO(rascunhoInicio))) {
      setRascunhoFim(rascunhoInicio);
      setRascunhoInicio(valor);
    } else setRascunhoFim(valor);
  }

  return (
    <div className="relative">
      <button type="button" className="date-range-trigger" onClick={() => setAberto((v) => !v)}>
        <CalendarRange size={17} />
        <span>{inicio && fim ? `${br(inicio)} — ${br(fim)}` : "Selecionar período"}</span>
      </button>
      {aberto && (
        <div className="date-range-popover">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div><b>Escolha o período</b><p className="text-xs text-foreground/50">Primeiro clique: início. Segundo: fim.</p></div>
            <button type="button" className="calendar-reset" title="Limpar período" onClick={() => { setRascunhoInicio(""); setRascunhoFim(""); }}><RotateCcw size={16}/></button>
          </div>
          <div className="range-preview">
            <span>{rascunhoInicio ? br(rascunhoInicio) : "Data inicial"}</span><b>até</b><span>{rascunhoFim ? br(rascunhoFim) : "Data final"}</span>
          </div>
          <div className="calendar-header">
            <button type="button" onClick={() => setMes(subMonths(mes, 1))}><ChevronLeft size={18}/></button>
            <strong>{format(mes, "MMMM 'de' yyyy", { locale: ptBR })}</strong>
            <button type="button" onClick={() => setMes(addMonths(mes, 1))}><ChevronRight size={18}/></button>
          </div>
          <div className="calendar-grid calendar-week"><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span><span>D</span></div>
          <div className="calendar-grid">
            {Array.from({ length: recuo }).map((_, i) => <span key={`v-${i}`} />)}
            {dias.map((dia) => {
              const valor = iso(dia);
              const inicioData = rascunhoInicio ? parseISO(rascunhoInicio) : null;
              const fimData = rascunhoFim ? parseISO(rascunhoFim) : null;
              const ponta = (inicioData && isEqual(dia, inicioData)) || (fimData && isEqual(dia, fimData));
              const intervalo = inicioData && fimData && isAfter(dia, inicioData) && isBefore(dia, fimData);
              return <button type="button" key={valor} className={`${ponta ? "selected" : ""} ${intervalo ? "in-range" : ""}`} onClick={() => selecionar(dia)}>{format(dia, "d")}</button>;
            })}
          </div>
          <button type="button" className="btn-primary mt-4 w-full" disabled={!rascunhoInicio || !rascunhoFim} onClick={() => { onApply(rascunhoInicio, rascunhoFim); setAberto(false); }}>Aplicar período</button>
        </div>
      )}
    </div>
  );
}
