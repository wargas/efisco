import { createMiddleware } from "hono/factory";

export const authMiddleware = createMiddleware(async (c, next) => {
  const auth = c.req.header('Authorization')

  if (!auth || !auth.startsWith("Bearer ")) {
    return c.json({ error: 'Token não informado' }, 401)
  }

  const token = auth.replace("Bearer ", "").trim()

  // Aqui você valida o token como quiser
  // Pode comparar com variável do ambiente, banco, Redis, JWT, etc.
  if (token !== process.env.API_TOKEN) {
    return c.json({ error: 'Token inválido' }, 403)
  }

  await next()
})