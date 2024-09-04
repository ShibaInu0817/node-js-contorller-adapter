// fastify.d.ts
import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
    workspaceId?: string;
  }
}

/* Explanation:
Modular Typing: Fastify's types are more modular and scoped specifically to the fastify module. Instead of using a global namespace like Express, Fastify's types are tightly scoped, meaning that to extend them, you need to explicitly declare your extensions using the declare module syntax.
*/
