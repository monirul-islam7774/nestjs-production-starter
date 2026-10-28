import { ConflictException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let repo: { exists: jest.Mock; create: jest.Mock; save: jest.Mock; findOne: jest.Mock };
  let service: UsersService;

  beforeEach(() => {
    repo = {
      exists: jest.fn(),
      create: jest.fn((u: Partial<User>) => u),
      save: jest.fn(async (u: Partial<User>) => ({ id: 'u1', ...u })),
      findOne: jest.fn(),
    };
    service = new UsersService(repo as unknown as Repository<User>);
  });

  it('hashes the password and never returns it', async () => {
    repo.exists.mockResolvedValue(false);
    const result = await service.create({
      email: 'Jane@Example.com',
      name: 'Jane',
      password: 'secret123',
    });
    expect(result).toMatchObject({ id: 'u1', email: 'jane@example.com', name: 'Jane' });
    expect(result).not.toHaveProperty('passwordHash');
    expect(repo.create.mock.calls[0][0].passwordHash).not.toBe('secret123');
  });

  it('rejects duplicate emails', async () => {
    repo.exists.mockResolvedValue(true);
    await expect(
      service.create({ email: 'jane@example.com', name: 'Jane', password: 'secret123' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws NotFound for a missing user', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(service.findById('missing')).rejects.toBeInstanceOf(NotFoundException);
  });
});
