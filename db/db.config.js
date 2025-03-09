import { PrismaClient } from "@prisma/client";


// if(!process.env.DATABASE_URL){
//     throw new Error("DATABASE_URL is not defined");
// }
const prisma = new PrismaClient({
  log: ["query"],
});

export default prisma;