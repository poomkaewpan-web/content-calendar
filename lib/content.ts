export type Platform =
  | "tiktok"
  | "instagram"
  | "facebook"
  | "all";

export type Status =
  | "not_cut"
  | "editing"
  | "waiting"
  | "published"
  | "cannot_publish";

export type Responsible = "ภูมิ" | "จอม" | "";

export type ContentItem = {
  id: number;
  title: string;
  date: string;
  platform: Platform;
  status: Status;
  responsible: Responsible;
  time: string;
  shootDate: string;
  description: string;
};
