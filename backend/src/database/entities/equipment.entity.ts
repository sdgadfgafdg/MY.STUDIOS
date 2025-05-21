import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SessionEquipment } from './session-equipment.entity';

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  price_per_hour: number;

  @OneToMany(() => SessionEquipment, sessionEquipment => sessionEquipment.equipment)
  sessionConnections: SessionEquipment[];
}