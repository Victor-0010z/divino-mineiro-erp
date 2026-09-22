import { diaristasMock, pagamentosDiaristaMock, registrosDiariaMock } from "@/lib/mock-data";
import type { Diarista, PagamentoDiarista, RegistroDiaria } from "@/types";
import { delay } from "./api-client";
let diaristas=[...diaristasMock], registros=[...registrosDiariaMock], pagamentos=[...pagamentosDiaristaMock];
export async function listarDiaristas(){ return delay([...diaristas]); }
export async function criarDiarista(d:Diarista){ diaristas=[d,...diaristas]; return delay(d); }
export async function registrarDiaria(r:RegistroDiaria){ registros=[r,...registros]; return delay(r); }
export async function listarTodosRegistros(){ return delay([...registros]); }
export async function gerarPagamento(p:PagamentoDiarista){ pagamentos=[p,...pagamentos]; registros=registros.map(r=>p.diariasIncluidas.includes(r.id)?{...r,status:"PAGO",pagamentoId:p.id}:r); return delay(p); }
