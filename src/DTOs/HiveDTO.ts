export interface IHiveReport {
  Pests: boolean;
  sawQueen: boolean;
  occupied: boolean;
  presenceOfQueenCells: boolean;
  exccessiveDroneCells: boolean;
  harvested: boolean;
  broodType: string;
  beePopulation: string;
  hiveTemperament: string;
  honeyStores: string;
  Produce: number;
  InspectionDate: string;
  generalApiaryObservations: string;
  Hive_id?: string;
}

export class HiveDTO {
  constructor(
    public Name: string,
    public Type: string,
    public Apiary_id: string,
    public HiveReport?: IHiveReport[],
    public Hive_id?: string
  ) {}
}
