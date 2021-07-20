import UserRepository, {
  IUserRepository,
} from "@HIHM/src/Repositories/UserRepository";
import { HiveRepository, IHiveRepository } from "@Repositories/HiveRepository";
import { config } from "../../configuration/index";
import { AddInspector } from "./usecases/addInspector";
import { CreateApiary } from "./usecases/CreateApiary";
import { CreateHive } from "./usecases/CreateHive";
import { CreateHiveReport } from "./usecases/CreateHiveReport";
import { DeleteApiary } from "./usecases/DeleteApiary";
import { FetchHiveReport } from "./usecases/FetchHiveReports";
import { HiveAnalytics } from "./usecases/HiveAnalytics";
import { ModifyApiary } from "./usecases/ModifyApiary";
import { ModifyHive } from "./usecases/ModifyHive";
import { ViewApiary } from "./usecases/ViewApiary";
import { ViewHives } from "./usecases/ViewHives";

export class HiveServiceProvider {
  private readonly repo: IHiveRepository;
  private readonly userRepo: IUserRepository;
  // private readonly
  constructor() {
    this.repo = new HiveRepository();
    this.userRepo = new UserRepository();
  }

  /**
   * @description createApiary service
   */
  public get createApiary() {
    return new CreateApiary(this.repo, config);
  }

  /**
   * @description createHive service
   */
  public get createHive() {
    return new CreateHive(this.repo, config);
  }

  /**
   * @description createHiveReport service
   */
  public get createHiveReport() {
    return new CreateHiveReport(this.repo, config);
  }

  /**
   * @description deleteApiary service
   */
  public get deleteApiary() {
    return new DeleteApiary(this.repo, config);
  }

  /**
   * @description fetchHiveReport  service
   */
  public get fetchHiveReport() {
    return new FetchHiveReport(this.repo, config);
  }

  /**
   * @description hiveAnalytics  service
   */
  public get hiveAnalytics() {
    return new HiveAnalytics(this.repo);
  }

  /**
   * @description modifyApiary  service
   */
  public get modifyApiary() {
    return new ModifyApiary(this.repo, config);
  }

  /**
   * @description modifyHive  service
   */
  public get modifyHive() {
    return new ModifyHive(this.repo, config);
  }

  /**
   * @description veiwApiary  service
   */
  public get veiwApiary() {
    return new ViewApiary(this.repo);
  }

  /**
   * @description viewHives  service
   */
  public get viewHives() {
    return new ViewHives(this.repo, config);
  }

  /**
   * @description addInspector  service
   */
  public get addInspector() {
    return new AddInspector(this.userRepo, config);
  }
}
