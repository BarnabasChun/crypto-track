export interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
export class ErrorResponse {
  public message: string;
  public statusCode: number;
  public details: unknown;

  constructor({
    message,
    statusCode,
    details,
  }: {
    message: string;
    statusCode: number;
    details?: unknown;
  }) {
    this.statusCode = statusCode;
    this.message = message;
    this.details = details;
  }
}
