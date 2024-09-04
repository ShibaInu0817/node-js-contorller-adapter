import { FastifyReply, FastifyRequest } from "fastify";
import { CommonController } from "../../common/controller";
import { HttpRequest } from "../../common/interfaces";

export const fastifyRouteAdapter =
  (controller: CommonController) =>
  async (
    request: FastifyRequest<{ Body: { name: string } }>,
    reply: FastifyReply
  ) => {
    const httpRequest: HttpRequest = {
      body: request.body,
      params: request.params,
      headers: request.headers,
      userId: request.userId,
      workspaceId: request.workspaceId,
    };

    const httpResponse = await controller.handle(httpRequest);

    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      reply.status(httpResponse.statusCode).send(httpResponse.body);
    } else {
      reply.status(httpResponse.statusCode).send({
        error: httpResponse.body?.message,
      });
    }
  };
