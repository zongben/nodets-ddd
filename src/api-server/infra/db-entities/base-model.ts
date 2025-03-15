import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export abstract class BaseModel extends BaseEntity {
  @Column({
    nullable: true,
  })
  createdBy!: string;

  @CreateDateColumn({
    precision: 0,
  })
  createdAt!: Date;

  @Column({
    nullable: true,
  })
  updatedBy!: string;

  @UpdateDateColumn({
    precision: 0,
  })
  updatedAt!: Date;
}
