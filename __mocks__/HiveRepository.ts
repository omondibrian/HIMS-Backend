import { ApiaryDto } from "@HIHM/src/DTOs/ApiaryDTO";
import { HiveDTO, IHiveReport } from "@HIHM/src/DTOs/HiveDTO";
import ApiaryEntity from "@HIHM/src/entities/Apiary.entity";
import HiveEntity from "@HIHM/src/entities/Hive.entity";
import HiveReportEntity from "@HIHM/src/entities/HiveReport.entity";
import {IHiveRepository} from "@Repositories/HiveRepository";

export class MockHiveRepository implements IHiveRepository {
    public createApiary(data: ApiaryDto): Promise<ApiaryEntity> {
        throw new Error("Method not implemented.");
    }
    public createHive(data: Omit<HiveDTO, "HiveReport">): Promise<Omit<HiveDTO, "HiveReport">> {
        throw new Error("Method not implemented.");
    }
    public modifyApiary(id: string, data: Partial<ApiaryDto>): Promise<ApiaryEntity> {
        throw new Error("Method not implemented.");
    }
    public getApiary(ownerId: string): Promise<ApiaryEntity[]> {
        throw new Error("Method not implemented.");
    }
    public DeleteApiary(id: string): Promise<ApiaryEntity> {
        throw new Error("Method not implemented.");
    }
    public GetHives(ApiaryId: string): Promise<HiveEntity[]> {
        throw new Error("Method not implemented.");
    }
    public GetHiveDetails(hiveId: string): Promise<HiveDTO> {
        throw new Error("Method not implemented.");
    }
    public RemoveHive(id: string): Promise<HiveEntity> {
        throw new Error("Method not implemented.");
    }
    public insertHiveReport(hiveId: string, report: IHiveReport): Promise<HiveReportEntity> {
        throw new Error("Method not implemented.");
    }
    public updateHive(hiveId: string, data: Omit<HiveDTO, "HiveReport">): Promise<Omit<HiveDTO, "HiveReport">> {
        throw new Error("Method not implemented.");
    }
    public fetchInspectionSites(userId: string): Promise<ApiaryDto[]> {
        throw new Error("Method not implemented.");
    }

}
