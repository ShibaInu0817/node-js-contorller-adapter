# Unlocking the Power of Framework-Agnostic Controllers: A Beginner's Guide to Building Flexible Node.js Applications

In today’s fast-paced development world, it’s not uncommon to switch between different web frameworks as projects evolve. You might start with Express but then consider Fastify for its performance benefits. The challenge is how to ensure that your business logic — the core of your application — remains intact and easily portable across different frameworks.

**The answer lies in using a design pattern known as the "Adapter Pattern."** This approach allows you to keep your controllers framework-agnostic, making it straightforward to switch frameworks without rewriting your business logic.

## Why Does Framework-Agnostic Development Matter?

When code is tightly coupled with a specific framework, it can create dependencies that make future changes difficult and time-consuming. By decoupling your business logic from the web framework, you gain the flexibility to:

- **Switch frameworks easily** without rewriting core logic.
- **Reuse the same controllers** in different projects using different frameworks.
- **Test your controllers independently** from the web framework.

## Understanding the Adapter Pattern

The Adapter Pattern allows you to adapt one interface to another. In the context of web frameworks, you create an intermediary (adapter) that converts framework-specific request and response objects into a common format that your controller can handle.

### Objective:

Create a common controller that processes a greeting request and returns a greeting message. Then, build adapters for Express and Fastify to integrate the controller with each framework.The controller should be able to handle requests from both frameworks without any modifications with the help of `adapters` and `interfaces`.

Here’s a practical example demonstrating how to use this pattern with Express and Fastify.

### Step 1: Create a Common Controller

Start by defining a controller that processes a greeting request. It takes an HTTP request, checks for a `name` in the body, and responds with a greeting message.

```typescript
// CommonController.ts
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

// HttpRequest.ts
export interface HttpRequest {
  body: any;
  params: any;
  headers: any;
  userId?: string;
  workspaceId?: string;
}

// HttpResponse.ts
export interface HttpResponse {
  statusCode: number;
  body: any;
}
```

This `CommonController` class is framework-agnostic. It processes an HTTP request and returns an HTTP response without knowing which framework it’s operating in.

### Step 2: Build Framework-Specific Adapters

Next, create adapter functions for Express and Fastify. These adapters convert the framework-specific request and response objects into a format that our controller can handle.

#### Express Adapter

```typescript
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
```

#### Fastify Adapter

```typescript
// fastifyRouteAdapter.ts
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
```

### Step 3: Integrate Adapters with Your Framework

Now, set up your server using these adapters.

#### Express Setup

```typescript
// expressApp.ts
import express, { NextFunction } from "express";
import { expressRouteAdapter } from "./expressRouteAdapter";
import { Request, Response } from "express";
import { CommonController } from "../../common/controller";

const app = express();
app.use(express.json());

const controller = new CommonController();

app.post("/greet", simpleMiddleware, expressRouteAdapter(controller));

app.listen(3000, () => {
  console.log("Express server running on port 3000");
});

// express middleware to extract userId and workspaceId from headers
function simpleMiddleware(req: Request, res: Response, next: NextFunction) {
  req.userId = req.headers["userid"]?.toString() || "default";
  req.workspaceId = req.headers["workspaceid"]?.toString();
  next();
}
```

#### Fastify Setup

```typescript
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

// Fastify middleware to extract userId and workspaceId from headers
function simpleMiddleware(
  request: FastifyRequest<{ Body: { name: string } }>,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) {
  request.userId = request.headers["userid"]?.toString() || "default";
  request.workspaceId = request.headers["workspaceid"]?.toString();
  done();
}
```

## The Key Takeaway

The Adapter Pattern allows you to write code that is clean, maintainable, and easily adaptable to different frameworks. By keeping your business logic separate from the web framework, you ensure that your codebase remains flexible, making it easier to adapt to new requirements or even switch frameworks altogether.

This approach not only makes your code more resilient to change but also promotes a clear separation of concerns, which is a cornerstone of good software design.

So next time you start a project, consider how you can structure your code to be framework-agnostic. Your future self (and your team) will thank you!

---

**I hope you found this guide helpful!** If you have any questions or need further clarification, feel free to reach out. Happy coding!

---

This guide provides a straightforward introduction to using the Adapter Pattern to make your Node.js applications flexible and framework-agnostic. It includes practical examples with Express and Fastify to help you understand and apply the pattern effectively.
