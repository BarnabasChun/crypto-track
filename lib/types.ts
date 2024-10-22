export interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export enum ResponseStatus {
  success = 'success',
  error = 'error',
}
