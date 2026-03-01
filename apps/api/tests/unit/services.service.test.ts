import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the repository before importing the service
vi.mock('../../src/modules/services/services.repository.ts', () => ({
  servicesRepository: {
    findAll: vi.fn(),
    findById: vi.fn(),
    findByUrl: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

// Mock the scheduler
vi.mock('../../src/scheduler/index.ts', () => ({
  scheduleService: vi.fn(),
  unscheduleService: vi.fn(),
}));

import { servicesRepository } from '../../src/modules/services/services.repository.ts';
import { servicesService, ServiceNotFoundError, ServiceUrlConflictError } from '../../src/modules/services/services.service.ts';

const mockRepo = vi.mocked(servicesRepository);

const mockService = {
  id: 1,
  name: 'Google',
  url: 'https://google.com',
  interval: 60,
  status: 'PENDING' as const,
  isActive: true,
  lastChecked: null,
  createdAt: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('servicesService.getById', () => {
  it('returns service when found', async () => {
    mockRepo.findById.mockReturnValue(mockService);
    const result = await servicesService.getById(1);
    expect(result).toEqual(mockService);
  });

  it('throws ServiceNotFoundError when not found', async () => {
    mockRepo.findById.mockReturnValue(undefined);
    await expect(servicesService.getById(99)).rejects.toThrow(ServiceNotFoundError);
  });
});

describe('servicesService.create', () => {
  it('creates service when URL is unique', async () => {
    mockRepo.findByUrl.mockReturnValue(undefined);
    mockRepo.create.mockReturnValue(mockService);
    const result = await servicesService.create({
      name: 'Google',
      url: 'https://google.com',
      interval: 60,
    });
    expect(result).toEqual(mockService);
    expect(mockRepo.create).toHaveBeenCalledOnce();
  });

  it('throws ServiceUrlConflictError when URL already exists', async () => {
    mockRepo.findByUrl.mockReturnValue(mockService);
    await expect(
      servicesService.create({ name: 'Google', url: 'https://google.com', interval: 60 })
    ).rejects.toThrow(ServiceUrlConflictError);
  });
});

describe('servicesService.remove', () => {
  it('removes service when found', async () => {
    mockRepo.findById.mockReturnValue(mockService);
    mockRepo.remove.mockReturnValue(mockService);
    await servicesService.remove(1);
    expect(mockRepo.remove).toHaveBeenCalledWith(1);
  });

  it('throws ServiceNotFoundError when not found', async () => {
    mockRepo.findById.mockReturnValue(undefined);
    await expect(servicesService.remove(99)).rejects.toThrow(ServiceNotFoundError);
  });
});