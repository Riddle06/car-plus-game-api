import { BaseConnection } from '../../base-connection';
import { MemberInformationVM } from '@view-models/member.vm';
import { MemberEntity } from '../../../entities/member.entity';
import { uniqueId } from '@utilities';
export class RegisterLibSvc extends BaseConnection {

    async createMember(carPlusId: string): Promise<MemberInformationVM> {

        // this.entityManager.getRepository(MemberEntity).create({
        //     id: uniqueId.generateV4UUID(),
        //     carPlusMemberId: carPlusId,
        //     gamePoint: 100,
        //     level: 1,
        //     dateCreated: new Date(),


        // })

        return null;
    }

} 