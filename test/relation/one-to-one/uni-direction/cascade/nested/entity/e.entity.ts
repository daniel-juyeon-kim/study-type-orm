import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { D } from "./d.entity";

@Entity()
export class E {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @OneToOne(() => D, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  d!: D;
}
