import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { Prisma, Transaction, TransactionStatus } from "@prisma/client";

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByUserId(userId: string): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({ where: { userId } });
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.prisma.transaction.findUnique({ where: { id } });
  }

  async create(data: Prisma.TransactionCreateInput): Promise<Transaction> {
    return this.prisma.transaction.create({ data });
  }

  async updateStatus(id: string, status: TransactionStatus): Promise<Transaction> {
    return this.prisma.transaction.update({
      where: { id },
      data: { status },
    });
  }

  async completeTransaction(id: string): Promise<Transaction> {
    return this.prisma.transaction.update({
      where: { id },
      data: { status: TransactionStatus.completed },
    });
  }

  async failTransaction(id: string): Promise<Transaction> {
    return this.prisma.transaction.update({
      where: { id },
      data: { status: TransactionStatus.failed },
    });
  }

  async refundTransaction(id: string): Promise<Transaction> {
    return this.prisma.transaction.update({
      where: { id },
      data: { status: TransactionStatus.refunded },
    });
  }
}
