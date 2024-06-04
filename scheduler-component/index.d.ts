// index.d.ts
declare module "schedules-rentalinaja" {
  import { FC } from "react";

  export interface SchedulerProps {
    apiKey: string; 
  }

  const Scheduler: FC<SchedulerProps>;
  export default Scheduler;
}
