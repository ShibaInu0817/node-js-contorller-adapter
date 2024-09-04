// expressRouteAdapter.ts
import { Request, Response } from "express";
import { CommonController } from "../../common/controller";
import { HttpRequest, HttpResponse } from "../../common/interfaces";

export const expressRouteAdapter =
  (controller: CommonController) => async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
      params: req.params,
      headers: req.headers,
      userId: req.userId,
      workspaceId: req.workspaceId,
    };

    const httpResponse: HttpResponse = await controller.handle(httpRequest);

    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      res.status(httpResponse.statusCode).json(httpResponse.body);
    } else {
      res.status(httpResponse.statusCode).json({
        error: httpResponse.body?.message,
      });
    }
  };
