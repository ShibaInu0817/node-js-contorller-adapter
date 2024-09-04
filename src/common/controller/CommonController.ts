import { HttpRequest, HttpResponse } from "../interfaces";

export class CommonController {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (httpRequest.body.name) {
      console.log(httpRequest);
      return {
        statusCode: 200,
        body: { message: `Hello, ${httpRequest.body.name}!` },
      };
    } else {
      return {
        statusCode: 400,
        body: { message: "Name is required" },
      };
    }
  }
}
