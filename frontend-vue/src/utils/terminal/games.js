export const guessGame = {
    active: false,
    targetNumber: null,
    attempts: 0,
    maxAttempts: 10,

    start() {
        this.active = true
        this.targetNumber = Math.floor(Math.random() * 100) + 1
        this.attempts = 0
        return `🎲 开始猜数字游戏！
我想了一个 1-100 之间的数字
你有 ${this.maxAttempts} 次机会，开始吧！

💡 直接输入数字进行猜测，输入 'exit' 退出游戏`
    },

    guess(number) {
        const num = parseInt(number)
        if (isNaN(num) || num < 1 || num > 100) {
            return '❌ 请输入 1-100 之间的数字'
        }

        this.attempts++

        if (num === this.targetNumber) {
            const result = `📊 第 ${this.attempts} 次尝试
🎯 太棒了！你猜对了！
数字是 ${this.targetNumber}，你用了 ${this.attempts} 次尝试

✨ 想再玩一次？输入 'guess'`
            this.active = false
            return result
        }

        if (this.attempts >= this.maxAttempts) {
            const result = `📊 第 ${this.attempts} 次尝试
😢 游戏结束！你用完了所有机会
正确答案是 ${this.targetNumber}

🔄 再试一次？输入 'guess'`
            this.active = false
            return result
        }

        const hint = num < this.targetNumber ? '太小了' : '太大了'
        const remaining = this.maxAttempts - this.attempts
        return `📊 第 ${this.attempts} 次尝试
${num < this.targetNumber ? '⬆️' : '⬇️'} ${hint}！再试试
剩余机会：${remaining}`
    },

    exit() {
        this.active = false
        return '👋 退出游戏'
    }
}
