import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class A {
  @PrimaryColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  age!: number;

  @Column({ nullable: true })
  detail!: string;
}
