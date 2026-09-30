import type { Usuario } from "@/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8081/api";

export interface SessaoUsuario {
  usuario: Usuario;
  token: string;
}

interface LoginResponse {
  token: string;
  tipo: string;
  expiraEmSegundos: number;
  usuario: Usuario;
}

export async function login(
  email: string,
  senha: string,
): Promise<SessaoUsuario> {
  let resposta: Response;

  try {
    resposta = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        senha,
      }),
    });
  } catch {
    throw new Error(
      "Não foi possível conectar à API. Verifique se o Spring Boot está aberto.",
    );
  }

  if (resposta.status === 401) {
    throw new Error("E-mail ou senha inválidos.");
  }

  if (resposta.status === 403) {
    throw new Error("Este usuário não possui permissão de acesso.");
  }

  if (!resposta.ok) {
    throw new Error(`Erro ao entrar no sistema (${resposta.status}).`);
  }

  const dados: LoginResponse = await resposta.json();

  return {
    usuario: dados.usuario,
    token: dados.token,
  };
}

export function salvarSessao(sessao: SessaoUsuario) {
  localStorage.setItem("dm-erp-sessao", JSON.stringify(sessao));
}

export function obterSessao(): SessaoUsuario | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const sessao = localStorage.getItem("dm-erp-sessao");
    return sessao ? JSON.parse(sessao) : null;
  } catch {
    return null;
  }
}

export function encerrarSessao() {
  localStorage.removeItem("dm-erp-sessao");
}