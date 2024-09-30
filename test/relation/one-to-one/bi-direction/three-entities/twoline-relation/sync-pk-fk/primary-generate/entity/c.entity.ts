import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { B } from "./b.entity";

@Entity()
export class C {
  @PrimaryColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToOne(() => B, (b) => b.c)
  @JoinColumn()
  b!: B;
}
