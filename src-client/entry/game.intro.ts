import { UseGameItemVM } from '@view-models/game.vm';
import { BasePage, PlusItem } from "./base.page";



class GameIntroPage extends BasePage {
    private gameCode: string
    private gameId: string
    private $content: JQuery<HTMLElement>;
    private items: UseGameItemVM[] = [];

    private isProcessing: boolean = false;

    async domEventBinding() {
        this.$content = this.$("#js-content");
        this.$('#js-go').click(() => { this.startGameHandler(this.gameId) })

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
        this.$content.html('');
        for (const item of useGameItems) {

            const { totalGameItemCount, isUsing, gameItem, usingRemainTimes } = item;
            const { name, spriteFolderPath } = gameItem;
            const className = totalGameItemCount <= 0 ? 'item-prop--lock' : isUsing ? 'item-prop--select' : 'item-prop';

            let useStatusHtml = '';
            if (isUsing) {
                let twoTimes = usingRemainTimes === 2;

                useStatusHtml = `
                    <!-- 使用中會有兩次： 1:未使用 | 0:已使用 | select:目前狀態(閃爍) -->
                    <div class="item ${twoTimes ? '' : 'select'}"><img src="/static/images/img_itemrate_1.png" alt=""></div>
                    <div class="item ${twoTimes ? 'select' : ''}"><img src="/static/images/img_itemrate_${twoTimes ? '1' : '0'}.png" alt=""></div>
                `
            }

            const $item = this.$(`
                <div class="type-btn item ${className}" data-id="${item.gameItemId}" data-btn="attrBox">
                    <div class="item-icon"><img src="${spriteFolderPath}list.png" alt=""></div>
                    <div class="item-info">
                        <div class="item-name">${name}</div>
                        <div class="item-possess"><span>${totalGameItemCount}</span></div>
                        <div class="item-objects">
                            ${useStatusHtml}
                        </div>
                    </div>
                </div>
            `)

            $item.click(() => { this.useGameItemPopup(item.gameItemId) })

            this.$content.append($item);
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
        if (this.isProcessing) return;
        this.closeZoneMask();
        this.toggleLoader(true);

        this.isProcessing = true;

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
