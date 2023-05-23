import { GiftStatus } from './../../domain/enums/gift-status.enum';
import { Gift } from '../../domain/gift.entity';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { GiftRepository } from 'src/gift/domain/ports';

@Injectable()
export class GiftPrismaRepository implements GiftRepository {
  constructor(private readonly prismaClient: PrismaClient) {}

  async create(entity: Gift): Promise<Gift> {
    const result = await this.prismaClient.gift.create({
      data: entity,
    });

    const { status, ...rest } = result;

    return new Gift({
      ...rest,
      status: GiftStatus[status as keyof typeof GiftStatus] as GiftStatus,
    });
  }

  async getGiftById(giftId: string): Promise<Gift> {
    const result = await this.prismaClient.gift.findUnique({
      where: { id: giftId },
    });

    if (!result) {
      throw new Error('Gift not found');
    }
    const { status, ...rest } = result;

    return new Gift({
      ...rest,
      status: GiftStatus[status as keyof typeof GiftStatus] as GiftStatus,
    });
  }

  async selectItem(
    giftId: string,
    personWhoBoughtIt: string,
    byLink: boolean,
    otherInfos: any,
  ): Promise<Gift> {
    const result = await this.prismaClient.gift.update({
      where: { id: giftId },
      data: {
        status: GiftStatus.BOUGHT,
        personWhoBoughtIt,
        byLink,
        otherInfos,
        boughtAt: new Date(),
      },
    });

    const { status, ...rest } = result;

    return new Gift({
      ...rest,
      status: GiftStatus[status as keyof typeof GiftStatus] as GiftStatus,
    });
  }

  async listGiftsByStatus(status: string): Promise<Gift[]> {
    const result = await this.prismaClient.gift.findMany({
      where: { status },
    });
    return result.map((gift) => {
      const { status, ...rest } = gift;

      return new Gift({
        ...rest,
        status: GiftStatus[status as keyof typeof GiftStatus] as GiftStatus,
      });
    });
  }

  async listAllGifts(): Promise<Gift[]> {
    const result = await this.prismaClient.gift.findMany();

    return result.map((gift) => {
      const { status, ...rest } = gift;

      return new Gift({
        ...rest,
        status: GiftStatus[status as keyof typeof GiftStatus] as GiftStatus,
      });
    });
  }
}
