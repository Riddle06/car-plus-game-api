import { UseGameItemVM } from '@view-models/game.vm';
import { BasePage } from "./base.page";

class GameIntroPage extends BasePage {
    private gameCode: string
    private gameId: string

    async didMount() {
        this.gameCode = this.$('#hidden_game_code').val() as string;
        this.gameId = this.$('#hidden_game_id').val() as string;

        const useableGameItemsRet = await this.webSvc.member.getUsableGameItems()
        console.log('[useableGameItemsRet]', useableGameItemsRet)
        this.loadGameItems(useableGameItemsRet.items)
        this.startGameHandler = this.startGameHandler.bind(this);
    }
    async domEventBinding() {
        this.$('#btn_go').click(() => { this.startGameHandler(this.gameId) })
        this.$('#block_game_items_container').on('click', 'li[data-game-item-id]', (e) => {
            alert(this.$(e.target).attr('data-game-item-id'))
        })
    }

    async startGameHandler(gameId: string): Promise<void> {
        const startGameRet = await this.webSvc.game.startGame({ gameId });

        if (startGameRet.success && startGameRet.item.id) {
            location.href = `/${this.gameCode}-game/${startGameRet.item.id}`;
        }
    }

    loadGameItems(useGameItems: UseGameItemVM[]): void {
        const items: string[] = []
        let index = 1;
        for (const item of useGameItems) {
            const htmlStr = this.$('#item_template_game_item').clone()
                .attr('id', `item_template_game_item_${index}`)
                .get(0).outerHTML
                .replace(/{gameItem.id}/g, item.gameItem.id)
                .replace(/{gameItem.name}/g, item.gameItem.name)
                .replace(/{totalGameItemCount}/g, item.totalGameItemCount.toString())
                .replace(/{isUsing}/g, item.isUsing ? '是' : '否')
                .replace(/{usingRemainTimes}/g, item.usingRemainTimes.toString())
            items.push(htmlStr);
            index += 1;
        }
        this.$('#block_game_items_container').html(items.join(''));
    }


}

const gameIntroPage = new GameIntroPage();
