import { createInterface } from "readline";

export default async function prompt (query: string) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const value = await new Promise((resolve) => rl.question(query, resolve));
  rl.close();  
  return value;
}