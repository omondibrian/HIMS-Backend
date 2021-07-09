import { ApiaryDto } from '@HIHM/src/DTOs/ApiaryDTO';
import { HiveDTO, IHiveReport } from '@HIHM/src/DTOs/HiveDTO';
import ApiaryEntity from '@HIHM/src/entities/Apiary.entity';
import HiveEntity from '@HIHM/src/entities/Hive.entity';
import HiveReportEntity from '@HIHM/src/entities/HiveReport.entity';
import {IRepository} from '@Repositories/HiveRepository'

export class MockHiveRepository implements IRepository {
    createApiary(data: ApiaryDto): Promise<ApiaryEntity> {
        throw new Error('Method not implemented.');
    }
    createHive(data: Omit<HiveDTO, 'HiveReport'>): Promise<Omit<HiveDTO, 'HiveReport'>> {
        throw new Error('Method not implemented.');
    }
    modifyApiary(id: string, data: Partial<ApiaryDto>): Promise<ApiaryEntity> {
        throw new Error('Method not implemented.');
    }
    getApiary(ownerId: string): Promise<ApiaryEntity[]> {
        throw new Error('Method not implemented.');
    }
    DeleteApiary(id: string): Promise<ApiaryEntity> {
        throw new Error('Method not implemented.');
    }
    GetHives(ApiaryId: string): Promise<HiveEntity[]> {
        throw new Error('Method not implemented.');
    }
    GetHiveDetails(hiveId: string): Promise<HiveDTO> {
        throw new Error('Method not implemented.');
    }
    RemoveHive(id: string): Promise<HiveEntity> {
        throw new Error('Method not implemented.');
    }
    insertHiveReport(hiveId: string, report: IHiveReport): Promise<HiveReportEntity> {
        throw new Error('Method not implemented.');
    }
    updateHive(hiveId: string, data: Omit<HiveDTO, 'HiveReport'>): Promise<Omit<HiveDTO, 'HiveReport'>> {
        throw new Error('Method not implemented.');
    }
    fetchInspectionSites(userId: string): Promise<ApiaryDto[]> {
        throw new Error('Method not implemented.');
    }
 
}