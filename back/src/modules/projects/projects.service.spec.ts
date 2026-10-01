import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service.js';
import { Project } from './entities/project.entity.js';
import { ProjectLink } from './entities/project-link.entity.js';
import { Skill } from '../skills/entities/skill.entity.js';
import { MediaService } from '../media/media.service.js';
import { Company } from './enums/company.enum.js';
import { ProjectCategory } from './enums/project-category.enum.js';
import { ProjectType } from './enums/project-type.enum.js';
import { ProjectStatus } from './enums/project-status.enum.js';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let repository: {
    findOne: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
    find: ReturnType<typeof vi.fn>;
  };
  let linkRepository: { delete: ReturnType<typeof vi.fn>; save: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn> };
  let skillRepository: { find: ReturnType<typeof vi.fn> };
  let mediaService: { remove: ReturnType<typeof vi.fn> };

  const baseProject = {
    id: 'p1',
    date: '2025',
    name: 'Test',
    company: Company.PERSO,
    category: ProjectCategory.WEBSITE,
    type: ProjectType.PERSO,
    status: ProjectStatus.IN_PROGRESS,
    description: 'desc',
    order: 0,
    published: true,
    links: [],
    skills: [],
  };

  beforeEach(async () => {
    repository = {
      findOne: vi.fn(),
      save: vi.fn((x) => x),
      delete: vi.fn(),
      find: vi.fn(),
    };
    linkRepository = { delete: vi.fn(), save: vi.fn(), create: vi.fn((x) => x) };
    skillRepository = { find: vi.fn().mockResolvedValue([]) };
    mediaService = { remove: vi.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: getRepositoryToken(Project), useValue: repository },
        { provide: getRepositoryToken(ProjectLink), useValue: linkRepository },
        { provide: getRepositoryToken(Skill), useValue: skillRepository },
        { provide: MediaService, useValue: mediaService },
      ],
    }).compile();

    service = module.get(ProjectsService);
  });

  describe('update', () => {
    it('removes the old preview image when it is replaced by a different one', async () => {
      repository.findOne.mockResolvedValue({ ...baseProject, previewImage: { id: 'old-media' } });

      await service.update('p1', { previewImageId: 'new-media' } as never);

      expect(mediaService.remove).toHaveBeenCalledWith('old-media');
    });

    it('does not touch media when the preview image is left unchanged', async () => {
      repository.findOne.mockResolvedValue({ ...baseProject, previewImage: { id: 'same-media' } });

      await service.update('p1', { name: 'Renamed' } as never);

      expect(mediaService.remove).not.toHaveBeenCalled();
    });

    it('does not fail the update if media cleanup errors', async () => {
      repository.findOne.mockResolvedValue({ ...baseProject, previewImage: { id: 'old-media' } });
      mediaService.remove.mockRejectedValue(new Error('disk error'));

      await expect(service.update('p1', { previewImageId: 'new-media' } as never)).resolves.toBeDefined();
    });
  });

  describe('remove', () => {
    it('removes the project preview image after deleting the project', async () => {
      repository.findOne.mockResolvedValue({ ...baseProject, previewImage: { id: 'media-1' } });

      await service.remove('p1');

      expect(repository.delete).toHaveBeenCalledWith('p1');
      expect(mediaService.remove).toHaveBeenCalledWith('media-1');
    });

    it('does nothing with media when the project has no preview image', async () => {
      repository.findOne.mockResolvedValue({ ...baseProject, previewImage: undefined });

      await service.remove('p1');

      expect(mediaService.remove).not.toHaveBeenCalled();
    });
  });
});
