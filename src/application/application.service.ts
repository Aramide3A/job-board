// import { BadRequestException, Injectable } from '@nestjs/common';
// import { PrismaService } from 'src/prisma/prisma.service';

// @Injectable()
// export class ApplicationService {
//     constructor(private prisma:PrismaService){}

//     async newApplication(jobId,userId){
//         const findUser = await this.prisma.user.findUnique({where: {id: userId}})
//         const findJob = await this.prisma.job.findUnique({where: {id : jobId}})
//         const findApplication = await this.prisma.application.findFirst({where:{
//             userId,
//             jobId
//         }})
//         if (findApplication) {
//             throw new BadRequestException('Application already exists');
//         }
//         const createApplication = await  this.prisma.application.create({
//             data : {
//                 user: {
//                     connect: { id: userId }
//                 },
//                 job: {
//                     connect: { id: jobId }
//                 },
//                 name : findUser.name,
//                 jobTitle : findJob.title,
//                 accepted : null,
//             }
//         })
//         return {"msg": `Application for ${findJob.title} role successful `}
//     }

//     async rejectApplication(applicationId,userId){
//         const updateApplication = await  this.prisma.application.update({
//             where : {
//                 id: applicationId
//             },
//             data : {
//                 accepted : false,
//             }
//         })
//         return {"msg": `Application rejected successfully `}
//     }

//     async acceptApplication(applicationId,userId){
//         const updateApplication = await  this.prisma.application.update({
//             where : {
//                 id: applicationId
//             },
//             data : {
//                 accepted : true,
//             }
//         })
//         return {"msg": `Application accepted successfully `}
//     }
// }
