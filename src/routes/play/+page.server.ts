import type { PageServerLoad } from "./$types";

export const load = (async ({ url }) => {
  const username = url.searchParams.get("username") || "anon";
  const isHosting = url.searchParams.get("hosting") === "true";

  return {
    username,
    isHosting,
  };
}) satisfies PageServerLoad;
