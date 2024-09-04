// fastifyRouteAdapter.ts
import Fastify, {
  FastifyRequest,
  FastifyReply,
  HookHandlerDoneFunction,
} from "fastify";
import { fastifyRouteAdapter } from "./fastifyRouteAdapter";
import { CommonController } from "../../common/controller";

const fastify = Fastify();

const controller = new CommonController();

fastify.post(
  "/greet",
  {
    preHandler: simpleMiddleware, // Attach middleware here
  },
  fastifyRouteAdapter(controller)
);
fastify.listen({ port: 3001 }, () => {
  console.log("Fastify server running on port 3001");
});

function simpleMiddleware(
  request: FastifyRequest<{ Body: { name: string } }>,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) {
  request.userId = request.headers["userid"]?.toString() || "default";
  request.workspaceId = request.headers["workspaceid"]?.toString();
  done();
}
