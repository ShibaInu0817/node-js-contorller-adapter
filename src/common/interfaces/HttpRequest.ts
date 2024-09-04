// Types.ts
export interface HttpRequest {
  body: {
    name: string;
  };
  params: any;
  headers: any;
  userId?: string;
  workspaceId?: string;
}
