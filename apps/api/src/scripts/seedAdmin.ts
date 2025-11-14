import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../../../../drizzle/schema";
import { hashPassword } from "../utils/auth";

async function main() {
  const args = process.argv.slice(2).filter((arg) => arg !== "--");
  const [username, email, password, fullName] = args;

  if (!username || !email || !password) {
    console.error(
      "Usage: pnpm seed:admin -- <username> <email> <password> [fullName]"
    );
    process.exitCode = 1;
    return;
  }

  const existingByUsername = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (existingByUsername.length > 0) {
    console.log(`User '${username}' already exists. Skipping.`);
    return;
  }

  const existingByEmail = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingByEmail.length > 0) {
    console.log(`Email '${email}' already in use. Skipping.`);
    return;
  }

  const passwordHash = await hashPassword(password);

  await db.insert(users).values({
    username,
    email,
    passwordHash,
    role: "admin",
    fullName,
  });

  console.log(`Admin user '${username}' created.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    // ensure pool closes
    setTimeout(() => process.exit(process.exitCode ?? 0), 100);
  });

