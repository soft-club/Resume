import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { Prisma, Subscription, SubscriptionStatus } from "@prisma/client";

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByUserId(userId: string): Promise<Subscription[]> {
    return this.prisma.subscription.findMany({
      where: { userId },
      include: { plan: true },
    });
  }

  async findActiveByUserId(userId: string): Promise<Subscription | null> {
    return this.prisma.subscription.findFirst({
      where: {
        userId,
        status: SubscriptionStatus.active,
        endDate: { gt: new Date() },
      },
      include: { plan: true },
    });
  }

  async create(data: Prisma.SubscriptionCreateInput): Promise<Subscription> {
    return this.prisma.subscription.create({ data });
  }

  async update(
    id: string,
    data: Prisma.SubscriptionUpdateInput,
  ): Promise<Subscription> {
    return this.prisma.subscription.update({ where: { id }, data });
  }

  async updateStatus(id: string, status: SubscriptionStatus): Promise<Subscription> {
    return this.prisma.subscription.update({
      where: { id },
      data: { status },
    });
  }

  async cancelSubscription(id: string): Promise<Subscription> {
    return this.prisma.subscription.update({
      where: { id },
      data: { status: SubscriptionStatus.canceled },
    });
  }

  async hasActiveSubscription(userId: string): Promise<boolean> {
    const activeSubscription = await this.findActiveByUserId(userId);
    return !!activeSubscription;
  }
} 