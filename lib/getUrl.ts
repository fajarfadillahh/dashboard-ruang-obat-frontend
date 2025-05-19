import { ParsedUrlQuery } from "querystring";

export function getUrl(url: string, query: ParsedUrlQuery) {
  if (query.q) {
    return `${url}?q=${query.q}&page=${query.page ? query.page : 1}`;
  }

  return `${url}?page=${query.page ? query.page : 1}`;
}
