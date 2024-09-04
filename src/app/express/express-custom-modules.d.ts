// // src/express-custom-modules.d.ts
declare namespace Express {
  interface Request {
    userId?: string;
    workspaceId?: string;
  }
}
