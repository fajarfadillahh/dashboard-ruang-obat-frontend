import { ParsedUrlQuery } from "querystring";

export function getUrl(url: string, query: ParsedUrlQuery) {
  const params = new URLSearchParams();

  if (query.q) {
    params.set("q", String(query.q));
  }

  if (query.filter) {
    params.set("filter", String(query.filter));
  }

  if (query.sort) {
    params.set("sort", String(query.sort));
  }

  if (query.page) {
    params.set("page", String(query.page));
  }

  const connector = url.includes("?") ? "&" : "?";

  return `${url}${connector}${params.toString()}`;
}
