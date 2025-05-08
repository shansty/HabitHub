import { NotificationType } from "../notification_enums";

export class NotificationPreviewDto {
    id: number;
    senderId: number;
    message: string;
    type: NotificationType;
    createdAt: Date;
  }