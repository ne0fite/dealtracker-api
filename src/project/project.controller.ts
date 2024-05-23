import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Body,
  Param,
  Post,
} from '@nestjs/common';

import { CreateProjectDto } from './create-project.dto';
import Project from '../models/project';
import { ProjectService } from './project.service';
import { UpdateProjectDto } from './update-project.dto';

@Controller('/api/v1/project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get('')
  find(): Promise<Project[]> {
    return this.projectService.findAll();
  }

  @Get(':id')
  async get(@Param() params: any): Promise<Project> {
    const project = await this.projectService.getById(params.id);
    if (!project) {
      throw new NotFoundException('Project Not Found');
    }
    return this.projectService.getById(params.id);
  }

  @Post('')
  async create(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
    const project = new Project();
    project.set(createProjectDto);
    await project.save();
    return project;
  }

  @Post(':id')
  async update(
    @Param() params: any,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.projectService.getById(params.id);
    if (!project) {
      throw new NotFoundException('Project Not Found');
    }

    await project.update(updateProjectDto);

    return project;
  }

  @Delete(':id')
  async delete(@Param() params: any): Promise<Project> {
    const project = await this.projectService.getById(params.id);
    if (!project) {
      throw new NotFoundException('Project Not Found');
    }

    await project.destroy();

    return project;
  }
}
