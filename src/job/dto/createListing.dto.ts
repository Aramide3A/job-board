import { IsDate, IsNumber, IsString } from "class-validator"

export class ListingDto{
    @IsString()
    title : string

    @IsString()
    company_name : string

    @IsString()
    description : string

    type : 'Fulltime'|'Parttime'|'Contract'

    @IsString()
    location : string

    @IsNumber()
    salary : number

    @IsString()
    deadline :  Date
}