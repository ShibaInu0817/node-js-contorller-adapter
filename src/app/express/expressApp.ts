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

function simpleMiddleware(req: Request, res: Response, next: NextFunction) {
  req.userId = req.headers["userid"]?.toString() || "default";
  req.workspaceId = req.headers["workspaceid"]?.toString();
  next();
}
