export class updateListingDto{
    title : string
    company_name : string
    description : string
    type : 'Fulltime'|'Parttime'|'Contract'
    location : string
    salary : number
    deadline :  Date
}