import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Session } from "./sessions.entity";
import { Equipment } from "./equipment.entity";

@Entity()
export class SessionEquipment {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => Session, (session) => session.equipmentConnections, {
    onDelete: "CASCADE",
  })
  session: Session;

  @ManyToOne(() => Equipment, { eager: true })
  equipment: Equipment;

  @Column({ type: "numeric", precision: 4, scale: 2, nullable: false })
  hours: number;
}
