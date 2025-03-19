import { Injectable } from "@nestjs/common";
import { Prisma, SubscriptionPlan } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class SubscriptionPlanService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<SubscriptionPlan[]> {
    return this.prisma.subscriptionPlan.findMany();
  }

  async findById(id: string): Promise<SubscriptionPlan | null> {
    return this.prisma.subscriptionPlan.findUnique({ where: { id } });
  }

  async create(data: Prisma.SubscriptionPlanCreateInput): Promise<SubscriptionPlan> {
    return this.prisma.subscriptionPlan.create({ data });
  }

  async update(
    id: string,
    data: Prisma.SubscriptionPlanUpdateInput,
  ): Promise<SubscriptionPlan> {
    return this.prisma.subscriptionPlan.update({ where: { id }, data });
  }

  async delete(id: string): Promise<SubscriptionPlan> {
    return this.prisma.subscriptionPlan.delete({ where: { id } });
  }
}
