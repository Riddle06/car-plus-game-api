class System {
    sleep(seconds: number): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, seconds * 1000);
        })
    }
}

export const system = new System();

