import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Appeal } from './entities/appeal.entity';
import { CreateAppealDto } from './dto/create-appeal.dto';
import { FindAppealsDto } from './dto/find-appeals.dto';
import { Op } from 'sequelize';

@Injectable()
export class AppealsService {
  constructor(
    @InjectModel(Appeal)
    private readonly appealRepository: typeof Appeal,
  ) {}

  async create(dto: CreateAppealDto) {
    try {
      const appeal = await this.appealRepository.create(dto as any);
      return appeal;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Appeal could not be created');
    }
  }

  async findAll(filters: FindAppealsDto) {
    try {
      const where: any = {};

      const { from, to, appeal_type, full_name, is_checked } = filters || {};

      if (appeal_type) {
        where.appeal_type = appeal_type;
      }

      if (full_name) {
        where.full_name = { [Op.iLike]: `%${full_name}%` };
      }

      if (is_checked !== undefined) {
        const checkedValue =
          typeof is_checked === 'string'
            ? is_checked.toLowerCase() === 'true'
            : Boolean(is_checked);
        where.is_checked = checkedValue;
      }

      if (from || to) {
        where.createdAt = {};

        if (from) {
          const fromDate = new Date(from);
          fromDate.setHours(0, 0, 0, 0);
          where.createdAt[Op.gte] = fromDate;
        }

        if (to) {
          const toDate = new Date(to);
          toDate.setHours(23, 59, 59, 999);
          where.createdAt[Op.lte] = toDate;
        }
      }

      return await this.appealRepository.findAll({
        where,
        order: [['createdAt', 'DESC']],
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Appeals could not be fetched');
    }
  }

  async findOne(id: number) {
    const appeal = await this.appealRepository.findByPk(id);
    if (!appeal) {
      throw new NotFoundException('Appeal not found');
    }
    return appeal;
  }

  async completeCheck(id: number) {
    try {
      const appeal = await this.findOne(id);

      if (!appeal.is_checked) {
        appeal.is_checked = true;
        appeal.checked_at = new Date();
        await appeal.save();
      }

      return appeal;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Appeal check could not be completed',
      );
    }
  }
}

