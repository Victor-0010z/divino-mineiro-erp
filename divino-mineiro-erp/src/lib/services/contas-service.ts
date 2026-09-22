import { contasPagarMock } from "@/lib/mock-data";
import type { ContaPagar } from "@/types";
import { delay } from "./api-client";
let contas=[...contasPagarMock];
export async function listarContas(){ return delay([...contas]); }
export async function criarConta(conta:ContaPagar){ contas=[conta,...contas]; return delay(conta); }
export async function atualizarConta(conta:ContaPagar){ contas=contas.map(c=>c.id===conta.id?conta:c); return delay(conta); }
export async function excluirConta(id:string){ contas=contas.filter(c=>c.id!==id); return delay(undefined); }
export function existeLinhaDigitavel(linha:string, ignorarId?:string){ return contas.some(c=>c.linhaDigitavel.replace(/\D/g,"")===linha.replace(/\D/g,"")&&c.id!==ignorarId); }
