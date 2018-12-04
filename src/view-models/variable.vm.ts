/**
 * 各個等級資訊
 */
export interface LevelUpInformation {
    /**
     * 目前等級
     */
    level: number
    /**
     * 升到該級所需經驗值
     */
    experience: number
    /**
     * 升到該及可以獲得多少（ client side 應該用不到）
     */
    levelUpGetGamePoint: number
}