export interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export enum ResponseStatus {
  success = 'success',
  error = 'error',
}
