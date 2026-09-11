import 'dotenv/config';
import { EventStatus, PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function findOrCreateAdmin() {
  const password = await hash('123456', 8);
  const existingAdmin = await prisma.admin.findFirst({
    where: { email: 'admin@mageverde.local' },
  });

  if (existingAdmin) {
    return existingAdmin;
  }

  return prisma.admin.create({
    data: {
      name: 'Admin Magé Verde',
      email: 'admin@mageverde.local',
      password,
    },
  });
}

async function findOrCreateUser() {
  const password = await hash('123456', 8);
  const existingUser = await prisma.user.findFirst({
    where: { email: 'usuario@mageverde.local' },
  });

  if (existingUser) {
    return existingUser;
  }

  return prisma.user.create({
    data: {
      name: 'Usuário de Teste',
      email: 'usuario@mageverde.local',
      password,
    },
  });
}

async function seedEvent(adminId: string) {
  const existingEvent = await prisma.event.findFirst({
    where: { title: 'Caminhada no Parque Natural' },
  });

  if (existingEvent) {
    return existingEvent;
  }

  return prisma.event.create({
    data: {
      authorId: adminId,
      title: 'Caminhada no Parque Natural',
      content:
        'Uma manhã para conhecer as trilhas, respirar o ar da serra e descobrir novos caminhos em Magé.',
      colaborators: 'Projeto Magé Verde',
      time: '08:00',
      date: new Date('2026-10-12T08:00:00-03:00'),
      location: 'Parque Natural Municipal de Magé',
      fileUrl:
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
      status: EventStatus.APPROVED,
    },
  });
}

async function main() {
  const admin = await findOrCreateAdmin();
  await findOrCreateUser();
  const event = await seedEvent(admin.id);

  console.log('Seed concluído:', {
    admin: 'admin@mageverde.local / 123456',
    user: 'usuario@mageverde.local / 123456',
    event: event.title,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
