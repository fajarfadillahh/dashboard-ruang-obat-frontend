import { ParsedUrlQuery } from "querystring";

export function getUrl(url: string, query: ParsedUrlQuery) {
  const params = new URLSearchParams();

  if (query.q) {
    params.set("q", String(query.q));
  }

  params.set("page", String(query.page ?? 1));

  const connector = url.includes("?") ? "&" : "?";

  return `${url}${connector}${params.toString()}`;
}
