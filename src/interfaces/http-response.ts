export class HttpResponse<T> {
  success?: boolean = true;
  message?: string;
  data?: T;
}
