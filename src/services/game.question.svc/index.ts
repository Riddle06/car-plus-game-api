import { ListResult } from '@view-models/common.vm';
import { GameQuestionVM } from '@view-models/game-question.vm';
import { dbProvider } from '@utilities';
import { QuestionLibSvc } from './lib/question.lib.svc';
class GameQuestionSvc {

    async getQuestions(): Promise<ListResult<GameQuestionVM>> {
        const queryRunner = await dbProvider.createQueryRunner();
        const questionLibSvc = new QuestionLibSvc(queryRunner);
        return questionLibSvc.getQuestions()
    }   


}
export const gameQuestionSvc = new GameQuestionSvc()