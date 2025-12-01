export interface Trip {
  id?: string;
  name: string;
  startDate: Date;
  creator: string;
  creatorName?: string;
  creatorPhoto?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTripData {
  name: string;
  startDate: Date;
  creator: string;
  creatorName?: string;
  creatorPhoto?: string;
}
