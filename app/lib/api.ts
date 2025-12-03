export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://apifullstack2felix-production-36df.up.railway.app";

export async function apiRequest(path: string, options: any = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }

  return res.json();
}

export const usuarioApi = {
  registrar: (data: any) =>
    apiRequest("/usuarios/crear", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  buscarPorEmail: async (email: string) => {
    const usuarios = await apiRequest("/usuarios/listar");
    return usuarios.find((u: any) => u.email === email);
  },
};
