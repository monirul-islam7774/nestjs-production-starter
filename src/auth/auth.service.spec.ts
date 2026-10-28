import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Role, User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  const user = { id: 'u1', email: 'jane@example.com', role: Role.USER } as User;
  let usersService: jest.Mocked<Pick<UsersService, 'findByEmailWithPassword' | 'create'>>;
  let jwt: jest.Mocked<Pick<JwtService, 'signAsync'>>;
  let service: AuthService;

  beforeEach(async () => {
    user.passwordHash = await bcrypt.hash('correct-password', 4);
    usersService = { findByEmailWithPassword: jest.fn(), create: jest.fn() };
    jwt = { signAsync: jest.fn().mockResolvedValue('signed.jwt.token') };
    service = new AuthService(
      usersService as unknown as UsersService,
      jwt as unknown as JwtService,
    );
  });

  it('returns an access token for valid credentials', async () => {
    usersService.findByEmailWithPassword.mockResolvedValue(user);
    await expect(
      service.login({ email: user.email, password: 'correct-password' }),
    ).resolves.toEqual({ accessToken: 'signed.jwt.token' });
    expect(jwt.signAsync).toHaveBeenCalledWith({ sub: 'u1', email: user.email, role: Role.USER });
  });

  it('rejects a wrong password', async () => {
    usersService.findByEmailWithPassword.mockResolvedValue(user);
    await expect(service.login({ email: user.email, password: 'nope' })).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('rejects an unknown email with the same error', async () => {
    usersService.findByEmailWithPassword.mockResolvedValue(null);
    await expect(service.login({ email: 'x@y.z', password: 'nope' })).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
