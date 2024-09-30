import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { D } from "./d.entity";

@Entity()
export class E {
  @PrimaryColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToOne(() => D, (d) => d.e)
  @JoinColumn()
  d!: D;
}
