import { GetServerSideProps, GetServerSidePropsContext } from "next";

export function withToken<T extends Record<string, any>>(
  handler?: (
    ctx: GetServerSidePropsContext,
    token: string,
  ) => Promise<{ props: T }>,
): GetServerSideProps<T & { token: string }> {
  return async (ctx) => {
    const token = ctx.req.headers["access_token"] as string;

    if (!handler) {
      return { props: { token } as T & { token: string } };
    }

    const result = await handler(ctx, token);
    return {
      props: {
        ...result.props,
        token,
      },
    };
  };
}
