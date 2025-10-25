import type { PageServerLoad } from "./$types";

export const load = (async ({ url }) => {
  const username = url.searchParams.get("username") || "anon";

  return {
    username
  };
}) satisfies PageServerLoad;
