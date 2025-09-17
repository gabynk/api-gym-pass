import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memories/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { InMemoryGymsRepository } from '@/repositories/in-memories/in-memory-gyms-repository'
import { InMemoryMembershipRepository } from '@/repositories/in-memories/in-memory-membership-repository'
import { RegisterUserByGymUseCase } from './register-user-by-gym'

let gymsRepository: InMemoryGymsRepository
let userRepository: InMemoryUsersRepository
let membershipRepository: InMemoryMembershipRepository
let sut: RegisterUserByGymUseCase

describe('Register User By Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    userRepository = new InMemoryUsersRepository()
    membershipRepository = new InMemoryMembershipRepository()
    sut = new RegisterUserByGymUseCase(userRepository, membershipRepository)

    gymsRepository.create({
      id: 'gym-id',
      title: 'gym-test',
      description: null,
      phone: null,
      latitude: -22.2147713,
      longitude: -49.9550626,
      created_by_id: 'user-id'
    })

    userRepository.items.push({
      id: 'user-id',
      name: 'user name',
      email: 'user@test.com',
      password_hash: 'passwordhash',
      created_at: new Date(),
      role: 'USER',
      email_verified_at: new Date(),
    })

    membershipRepository.items.push({
      id: 'membership-id',
      status: 'ACTIVE',
      user_id: 'user-id',
      gym_id: 'gym-id',
      created_at: new Date(),
      created_by_id: 'user-id-2',
      left_at: null,
      role: 'MEMBER'
    })
  })

  it('Should be able to register', async () => {
    const gymId = gymsRepository.items[0].id
    const authorId = userRepository.items[0].id

    const { user, membership } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      gymId,
      authorId
    })

    expect(user.id).toEqual(expect.any(String))
    expect(membership.status).toEqual('INVITED')
  })

  it('Should not be able to register with same email twice', async () => {
    const gymId = gymsRepository.items[0].id
    const authorId = userRepository.items[0].id

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email: 'user@test.com',
        gymId,
        authorId
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
