import { usuariosMock } from "@/lib/mock-data";
import type { Usuario } from "@/types";
import { delay } from "./api-client";
export interface SessaoUsuario { usuario:Usuario; token:string }
export async function login(email:string, senha:string):Promise<SessaoUsuario> {
  await delay(null,500);
  const usuario=usuariosMock.find(u=>u.email.toLowerCase()===email.toLowerCase());
  if(!usuario || senha!=="divino123") throw new Error("E-mail ou senha inválidos.");
  if(usuario.status!=="ATIVO") throw new Error("Usuário sem acesso ao sistema.");
  return { usuario, token:`demo-${usuario.id}` };
}
export function salvarSessao(sessao:SessaoUsuario){ localStorage.setItem("dm-erp-sessao",JSON.stringify(sessao)); }
export function obterSessao():SessaoUsuario|null { if(typeof window==="undefined") return null; try{return JSON.parse(localStorage.getItem("dm-erp-sessao")||"null")}catch{return null} }
export function encerrarSessao(){ localStorage.removeItem("dm-erp-sessao"); }
