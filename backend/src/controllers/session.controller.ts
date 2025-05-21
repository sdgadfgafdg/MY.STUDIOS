import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import { Between } from "typeorm";
import { Session } from "../database/entities/sessions.entity";
import { Equipment } from "../database/entities/equipment.entity";
import { SessionEquipment } from "../database/entities/session-equipment.entity";
import { Studio } from "../database/entities/studios.entity";

export class SessionController {
  static async getStudioAvailability(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const studioId = parseInt(req.query.studioId as string);
      const dateStr = req.query.date as string;

      if (isNaN(studioId) || !dateStr) {
        res.status(400).json({ error: "Invalid studioId or date" });
        return;
      }

      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
        return;
      }

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const sessions = await AppDataSource.getRepository(Session).find({
        where: {
          studio: { id: studioId },
          start_time: Between(startOfDay, endOfDay),
        },
        order: { start_time: "ASC" },
      });

      const busyTimes = sessions.map((session) => ({
        start_time: session.start_time,
        end_time: session.end_time,
      }));

      res.json(busyTimes);
    } catch (error) {
      console.error("Error fetching studio availability:", error);
      res.status(500).json({ error: "Failed to fetch studio availability" });
    }
  }

  static async getUpcomingStudioSessions(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const studioId = parseInt(req.params.studioId as string);
      if (isNaN(studioId)) {
        res.status(400).json({ error: "Invalid studio ID" });
        return;
      }
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 14);
      endDate.setHours(23, 59, 59, 999);
      const sessions = await AppDataSource.getRepository(Session)
        .createQueryBuilder("session")
        .leftJoinAndSelect("session.studio", "studio")
        .where("studio.id = :studioId", { studioId })
        .andWhere("session.start_time >= :startDate", { startDate })
        .andWhere("session.start_time <= :endDate", { endDate })
        .orderBy("session.start_time", "ASC")
        .getMany();
      const formattedSessions = sessions.map((session) => ({
        id: session.id,
        client_name: session.client_name,
        client_phone: session.client_phone,
        start_time: session.start_time,
        end_time: session.end_time,
        total_price: session.total_price,
      }));
      res.json(formattedSessions);
    } catch (error) {
      console.error("Error fetching upcoming studio sessions:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch upcoming studio sessions" });
    }
  }

  static async getBusyEquipment(req: Request, res: Response): Promise<void> {
    try {
      const { date } = req.query as { date: string };

      if (!date) {
        res.status(400).json({ error: "Missing date parameter" });
        return;
      }

      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD" });
        return;
      }

      const startOfDay = new Date(parsedDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(parsedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const sessionEquipments = await AppDataSource.getRepository(
        SessionEquipment
      )
        .createQueryBuilder("se")
        .leftJoinAndSelect("se.session", "s")
        .leftJoinAndSelect("se.equipment", "e")
        .where("s.start_time <= :endOfDay AND s.end_time >= :startOfDay", {
          startOfDay,
          endOfDay,
        })
        .getMany();

      const busyEquipment = sessionEquipments.map((se) => ({
        equipment_id: se.equipment.id,
        start_time: se.session.start_time,
        end_time: se.session.end_time,
      }));

      res.json(busyEquipment);
    } catch (error) {
      console.error("Error fetching busy equipment:", error);
      res.status(500).json({ error: "Failed to fetch busy equipment" });
    }
  }

  static async calculateBookingPrice(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { start_time, end_time, studio_id, equipment_ids, hours } =
        req.body;

      if (!start_time || !end_time || !studio_id || !hours) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const conflictingBooking = await AppDataSource.getRepository(
        Session
      ).findOne({
        where: {
          studio: { id: studio_id },
          start_time: Between(new Date(start_time), new Date(end_time)),
        },
      });

      if (conflictingBooking) {
        res.status(400).json({ error: "Time slot is already booked" });
        return;
      }

      const studio = await AppDataSource.getRepository(Studio).findOneBy({
        id: studio_id,
      });
      if (!studio) {
        res.status(404).json({ error: "Studio not found" });
        return;
      }

      let total_price = studio.price_per_hour * hours;

      if (equipment_ids && equipment_ids.length > 0) {
        const equipment = await AppDataSource.getRepository(
          Equipment
        ).findByIds(equipment_ids);
        const equipment_price = equipment.reduce(
          (sum, eq) => sum + eq.price_per_hour * hours,
          0
        );
        total_price += equipment_price;
      }

      res.status(200).json({ total_price });
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate price" });
    }
  }

  static async createBooking(req: Request, res: Response): Promise<void> {
    try {
      const {
        client_name,
        client_phone,
        start_time,
        end_time,
        studio_id,
        equipment_ids,
        hours,
      } = req.body;

      if (
        !client_name ||
        !client_phone ||
        !start_time ||
        !end_time ||
        !studio_id ||
        !hours
      ) {
        res.status(400).json({ error: "Missing required fields" });
        return;
      }

      const conflictingBooking = await AppDataSource.getRepository(
        Session
      ).findOne({
        where: {
          studio: { id: studio_id },
          start_time: Between(new Date(start_time), new Date(end_time)),
        },
      });

      if (conflictingBooking) {
        res.status(400).json({ error: "Time slot is already booked" });
        return;
      }

      const studio = await AppDataSource.getRepository(Studio).findOneBy({
        id: studio_id,
      });
      if (!studio) {
        res.status(404).json({ error: "Studio not found" });
        return;
      }

      let total_price = studio.price_per_hour * hours;

      const sessionRepository = AppDataSource.getRepository(Session);
      const session = await sessionRepository.save({
        client_name,
        client_phone,
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        studio,
        total_price,
      });

      if (equipment_ids && equipment_ids.length > 0) {
        const equipmentRepository = AppDataSource.getRepository(Equipment);
        const sessionEquipmentRepository =
          AppDataSource.getRepository(SessionEquipment);

        for (const equipmentId of equipment_ids) {
          const equipment = await equipmentRepository.findOneBy({
            id: equipmentId,
          });
          if (equipment) {
            await sessionEquipmentRepository.save({
              session,
              equipment,
              hours,
            });
            total_price += equipment.price_per_hour * hours;
          }
        }

        await sessionRepository.update(session.id, { total_price });
      }

      res.status(201).json({
        message: "Booking created successfully",
        total_price,
        session_id: session.id,
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ error: "Failed to create booking" });
    }
  }
}
