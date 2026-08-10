import { db } from "../lib/db";
import { users, students } from "../lib/db/schema";
import { hashPassword } from "../lib/auth/password";
import { eq } from "drizzle-orm";

async function main() {
  const adminPassHash = await hashPassword("admin123");
  const studentPassHash = await hashPassword("estudiante123");

  // 1. Admin Demo User
  const [existingAdmin] = await db
    .select()
    .from(users)
    .where(eq(users.email, "admin@plataformaeducativa.com"));

  if (existingAdmin) {
    await db
      .update(users)
      .set({ passwordHash: adminPassHash, name: "Administrador Plataforma Educativa" })
      .where(eq(users.id, existingAdmin.id));
  } else {
    await db.insert(users).values({
      name: "Administrador Plataforma Educativa",
      email: "admin@plataformaeducativa.com",
      passwordHash: adminPassHash,
      role: "admin",
    });
  }

  // 2. Student Demo User
  const [existingStudent] = await db
    .select()
    .from(students)
    .where(eq(students.phone, "3001234567"));

  if (existingStudent) {
    await db
      .update(students)
      .set({ passwordHash: studentPassHash, name: "Estudiante Demo" })
      .where(eq(students.id, existingStudent.id));
  } else {
    await db.insert(students).values({
      name: "Estudiante Demo",
      phone: "3001234567",
      passwordHash: studentPassHash,
    });
  }

  const allAdmins = await db.select().from(users);
  const allStudents = await db.select().from(students);

  console.log("Admins en la BD:", allAdmins.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role })));
  console.log("Estudiantes en la BD:", allStudents.map(s => ({ id: s.id, name: s.name, phone: s.phone })));
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Error al poblar usuarios demo:", e);
    process.exit(1);
  });
