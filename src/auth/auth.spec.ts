import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { RegisterDto } from './validators/register-validation';
import { UserDto } from './dto/user.dto';
import { UserRepository } from './auth.repository';

// Mock the UserRepository
class MockUserRepository {
  createUser = jest.fn();
}

describe('authService', () => {
  let service: AuthService;
  let userRepository: MockUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useClass: MockUserRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<MockUserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('auth/register', () => {
    it('register new user', async () => {
      const data: RegisterDto = {
        name: 'ahmed raef',
        email: 'ahmedraef806@gmail.com',
        password: 'secret password',
      };

      const expectedResult: UserDto = {
        name: 'ahmed raef',
        email: 'ahmedraef806@gmail.com',
        id: '$2b$12$sXy41s14ihlAABwSeFvMSeqQdU7qJ9R.IuwZSdAgovVoE7Yjxp5Vi',
      };

      userRepository.createUser.mockResolvedValue(expectedResult);

      const result = await service.create(data);

      expect(result).toEqual(expectedResult);
      expect(userRepository.createUser).toHaveBeenCalledWith(data);
    });
  });
});
