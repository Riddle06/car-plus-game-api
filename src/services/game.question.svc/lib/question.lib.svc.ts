import { BaseConnection } from '@services/base-connection';
import { ListResult } from '@view-models/common.vm';
import { GameQuestionVM } from '@view-models/game-question.vm';
import { GameQuestionEntity } from '@entities/game-question.entity';
export class QuestionLibSvc extends BaseConnection {

    async getQuestions(): Promise<ListResult<GameQuestionVM>> {
        const ret = new ListResult<GameQuestionVM>();

        const questionEntities = await this.entityManager.getRepository(GameQuestionEntity).find({
            order: {
                sort: "ASC"
            }
        })

        ret.items = questionEntities.map(question => {
            return {
                id: question.id,
                question: question.question,
                answer: question.answer
            }
        })

        return ret.setResultValue(true);
    }
}