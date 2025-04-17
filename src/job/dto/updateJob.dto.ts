import {PartialType} from "@nestjs/swagger"
import { CreateJobDto } from "./createJob.dto"

export class updateJobDto extends PartialType(CreateJobDto){
}