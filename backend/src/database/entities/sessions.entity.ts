import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Studio } from './studios.entity';
import { SessionEquipment } from './session-equipment.entity';

@Entity()
export class Session {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: 'text', nullable: false })
  client_name: string;

  @Column({ type: 'text', nullable: false })
  client_phone: string;

  @Column({ type: 'timestamp', nullable: false })
  start_time: Date;

  @Column({ type: 'timestamp', nullable: false })
  end_time: Date;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: false })
  total_price: number;

  @ManyToOne(() => Studio, studio => studio.sessions, { onDelete: 'CASCADE' })
  studio: Studio;

  @OneToMany(() => SessionEquipment, sessionEquipment => sessionEquipment.session)
  equipmentConnections: SessionEquipment[];
}