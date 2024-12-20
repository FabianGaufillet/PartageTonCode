export interface ApiResponse {
  message: string;
  data: { [key: string]: string | object };
}
