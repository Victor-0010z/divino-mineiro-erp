import { fornecedoresMock } from "@/lib/mock-data";
import type { Fornecedor } from "@/types";
import { delay } from "./api-client";
let fornecedores=[...fornecedoresMock];
export async function listarFornecedores(){ return delay([...fornecedores]); }
export async function criarFornecedor(f:Fornecedor){ fornecedores=[f,...fornecedores]; return delay(f); }
export async function atualizarFornecedor(f:Fornecedor){ fornecedores=fornecedores.map(x=>x.id===f.id?f:x); return delay(f); }
