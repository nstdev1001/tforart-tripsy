export interface Trip {
  id?: string;
  name: string;
  startDate: Date;
  creator: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTripData {
  name: string;
  startDate: Date;
  creator: string;
}
