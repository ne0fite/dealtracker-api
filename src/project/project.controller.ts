import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Body,
  Param,
  Post,
  Request,
} from '@nestjs/common';

import { CreateProjectDto } from './create-project.dto';
import Project from '../models/project';
import { ProjectService } from './project.service';
import { UpdateProjectDto } from './update-project.dto';
import User from 'src/models/user';

@Controller('/api/v1/project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get('')
  find(@Request() request): Promise<Project[]> {
    const user: User = request['user'];
    return this.projectService.findAll(user.accountId);
  }

  @Get(':id')
  async get(@Param() params: any, @Request() request): Promise<Project> {
    const user: User = request['user'];
    const project = await this.projectService.getById(
      params.id,
      user.accountId,
    );
    if (!project) {
      throw new NotFoundException('Project Not Found');
    }
    return this.projectService.getById(params.id, user.accountId);
  }

  @Post('')
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Request() request,
  ): Promise<Project> {
    const user: User = request['user'];
    const project = new Project();
    project.accountId = user.accountId;
    project.set(createProjectDto);
    await project.save();
    return project;
  }

  @Post(':id')
  async update(
    @Param() params: any,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() request,
  ): Promise<Project> {
    const user: User = request['user'];
    const project = await this.projectService.getById(
      params.id,
      user.accountId,
    );
    if (!project) {
      throw new NotFoundException('Project Not Found');
    }

    await project.update(updateProjectDto);

    return project;
  }

  @Delete(':id')
  async delete(@Param() params: any, @Request() request): Promise<Project> {
    const user: User = request['user'];
    const project = await this.projectService.getById(
      params.id,
      user.accountId,
    );
    if (!project) {
      throw new NotFoundException('Project Not Found');
    }

    await project.destroy();

    return project;
  }
}
