import { invokeEdgeFunction } from "@/lib/edgeFunctionHelper";

export async function replaceProgram(programId: string, csvContent: string, playerId: string) {
  const { data, error } = await invokeEdgeFunction("replace-program", {
    body: { programId, csvContent, playerId }
  });

  if (error) throw error;
  return data;
}
