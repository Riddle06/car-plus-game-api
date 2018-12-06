import { UseGameItemVM } from '@view-models/game.vm';
import { BasePage } from "./base.page";

enum GameItem {
    pointPlus = "920A9F93-102F-4B55-9ED5-A93F887DAF27",
    coinPlus = "28CCBE12-023B-42D9-97E0-23B1AFB56029"
}

class GameIntroPage extends BasePage {
    private gameCode: string
    private gameId: string
    private $pointPlusInfo: JQuery<HTMLElement>;
    private $coinPlusInfo: JQuery<HTMLElement>;
    private items: UseGameItemVM[] = [];

    async domEventBinding() {
        this.$pointPlusInfo = this.$("#js-pointPlus");
        this.$coinPlusInfo = this.$("#js-coinPlus");

        this.$('#js-go').click(() => { this.startGameHandler(this.gameId) })
        this.$pointPlusInfo.click(() => { this.useGameItemPopup(GameItem.pointPlus) })
        this.$coinPlusInfo.click(() => { this.useGameItemPopup(GameItem.coinPlus) })
    }
    didMount() {
        this.gameCode = this.$('#hidden_game_code').val() as string;
        this.gameId = this.$('#hidden_game_id').val() as string;
        

        this.getUsableGameItems();
    }   
    

    async startGameHandler(gameId: string): Promise<void> {
        const startGameRet = await this.webSvc.game.startGame({ gameId });
        console.log('[startGameRet]', startGameRet);

        if (startGameRet.success && startGameRet.item.id) {
            location.href = `/${this.gameCode}-game/${startGameRet.item.id}`;
        }
    }

    async getUsableGameItems(): Promise<void> {
        this.toggleLoader(true);

        const useableGameItemsRet = await this.webSvc.member.getUsableGameItems()
        console.log('[useableGameItemsRet]', useableGameItemsRet)
        this.items = useableGameItemsRet.items;
        this.loadGameItems(this.items)
        this.startGameHandler = this.startGameHandler.bind(this);
        
        this.toggleLoader(false);
    }

    loadGameItems(useGameItems: UseGameItemVM[]): void {

        for (const item of useGameItems) {
            let $target: JQuery<HTMLElement>;
            switch(item.gameItemId) {
                case GameItem.pointPlus:
                    $target = this.$pointPlusInfo;
                    break;
                case GameItem.coinPlus:
                    $target = this.$coinPlusInfo;
                    break;
            }
            const { totalGameItemCount, isUsing, gameItem, usingRemainTimes } = item;
            const { name } = gameItem;
            const className = totalGameItemCount <= 0 ? 'item-prop--lock' : isUsing ? 'item-prop--select' : 'item-prop';

            let useStatusHtml = '';
            if (isUsing) {
                let twoTimes = usingRemainTimes === 2;

                useStatusHtml = `
                    <div class="item ${twoTimes ? '' : 'select'}"><img src="/static/images/img_itemrate_1.png" alt=""></div>
                    <div class="item ${twoTimes ? 'select' : ''}"><img src="/static/images/img_itemrate_${twoTimes ? '1' : '0'}.png" alt=""></div>
                `
            }

            let tempHtml = $target
                .attr('class', 'type-btn item ' + className)
                .attr('data-id', item.gameItemId)
                .html()
                .replace('{itemName}', name)
                .replace('{totalGameItemCount}', totalGameItemCount.toString())

            $target.html(tempHtml);
            $target.find('.item-objects').html(useStatusHtml)
            $target.show();
        }
    }

    useGameItemPopup(id: string): void {
        this.$('[data-btn="accept"]').off('click');
        
        const item = this.items.find(obj => obj.gameItemId === id);
        const { totalGameItemCount, isUsing, gameItem, usingRemainTimes, memberGameItemIds } = item;
        const { name, description } = gameItem;

        // if (isUsing || totalGameItemCount <= 0 || !memberGameItemIds.length) return;

        this.$zoneMask.find('.title').text(name);
        this.$zoneMask.find('.tips').text(description);
        this.openZoneMask('attrBox')

        this.$('[data-btn="accept"]').click(() => {
            this.submitUseGameItem(memberGameItemIds[0]);
            this.$('[data-btn="accept"]').off('click');
        })
    }

    async submitUseGameItem(id: string) {
        const ret = await this.webSvc.member.useGameItem(id);
        if(!ret.success) {
            this.fakeAlert({
                title: 'Oops',
                text: ret.message
            });
            return;
        }
        this.getUsableGameItems();
    }
}

const gameIntroPage = new GameIntroPage();
