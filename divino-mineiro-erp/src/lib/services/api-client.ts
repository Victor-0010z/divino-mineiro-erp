export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";
export function delay<T>(data:T, ms=250):Promise<T> { return new Promise(resolve => setTimeout(()=>resolve(data), ms)); }
export async function apiRequest<T>(path:string, options?:RequestInit):Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers:{ "Content-Type":"application/json", ...(options?.headers ?? {}) } });
  if (!response.ok) throw new Error(await response.text());
  return response.json() as Promise<T>;
}
