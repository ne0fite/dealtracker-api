import { Injectable, Inject } from '@nestjs/common';
import Project from '../models/project';

@Injectable()
export class ProjectService {
  constructor(
    @Inject('PROJECT_REPOSITORY')
    private projectRepository: typeof Project,
  ) {}

  findAll(accountId: string): Promise<Project[]> {
    return this.projectRepository.findAll<Project>({
      where: {
        accountId,
      },
    });
  }

  getById(id: string, accountId: string): Promise<Project> {
    return this.projectRepository.findOne({
      where: {
        id,
        accountId,
      },
    });
  }
}
