import { PrismaClient } from '@prisma/client';

// Declare is a keyword in Typescript. Used to declare a global here.
// It is used to inform the compiler about the existence of entities that are defined elsewhere, 
// enabling type checking.
declare global {
    var prisma: PrismaClient | undefined
};

// || is a logical OR operator
// If globalThis.prisma is defined, assign its value to prismadb
// Otherwise, assign a new instance of PrismaClient.
// This ensures that there is only one instance of PrismaClient thorughout the application.
const prismadb = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prismadb;

export default prismadb;