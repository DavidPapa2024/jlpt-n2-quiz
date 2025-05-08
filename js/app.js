class QuizApp {
    constructor() {
        this.questions = [];
        this.currentQuiz = [];
        this.score = 0;
        
        // DOM元素
        this.quizContainer = document.getElementById('quiz-container');
        this.scoreSummary = document.getElementById('score-summary');
        this.startBtn = document.getElementById('start-btn');
        this.retryBtn = document.getElementById('retry-btn');
        
        // 事件监听
        this.startBtn.addEventListener('click', () => this.startQuiz());
        this.retryBtn.addEventListener('click', () => this.startQuiz());
        
        // 加载题库
        this.loadQuestions();
    }
    
    async loadQuestions() {
        try {
            this.questions = window.questions
            console.log(`题库加载完成，共${this.questions.length}题`);
        } catch (error) {
            console.error('题库加载失败:', error);
        }
    }
    
    startQuiz() {
        const type = document.getElementById('question-type').value;
        const count = parseInt(document.getElementById('question-count').value);
        
        // 筛选题目
        this.currentQuiz = type === 'all' 
            ? this.getRandomQuestions(count) 
            : this.getRandomQuestions(count, type);
        
        this.renderQuiz();
        this.scoreSummary.style.display = 'none';
    }
    
    getRandomQuestions(count, type = null) {
        let pool = type 
            ? this.questions.filter(q => q.type === type) 
            : [...this.questions];
        
        // 随机选题
        return [...pool]
            .sort(() => 0.5 - Math.random())
            .slice(0, count);
    }
    
    renderQuiz() {
        this.quizContainer.innerHTML = '';
        this.currentQuiz.forEach((q, index) => {
            const questionHtml = `
                <div class="question" id="q${index}">
                    <p><strong>問題${index + 1}</strong> ${q.question}</p>
                    <div class="options">
                        ${q.options.map((opt, i) => `
                            <label>
                                <input type="radio" name="q${index}" value="${i}">
                                ${i + 1}. ${opt}
                            </label>
                        `).join('')}
                    </div>
                    <div class="result" id="result${index}" style="display:none;">
                        <p class="correct">正解: ${q.correct + 1}. ${q.options[q.correct]}</p>
                        <div class="explanation">${q.explanation}</div>
                    </div>
                </div>
            `;
            this.quizContainer.insertAdjacentHTML('beforeend', questionHtml);
        });
        
        // 添加提交按钮
        const submitBtn = document.createElement('button');
        submitBtn.textContent = '答えを確認する';
        submitBtn.addEventListener('click', () => this.checkAnswers());
        this.quizContainer.appendChild(submitBtn);
    }
    
    checkAnswers() {
        this.score = 0;
        this.currentQuiz.forEach((q, index) => {
            const selected = document.querySelector(`input[name="q${index}"]:checked`);
            const resultDiv = document.getElementById(`result${index}`);
            
            if (resultDiv) {
                resultDiv.style.display = 'block';
                
                if (selected && parseInt(selected.value) === q.correct) {
                    this.score++;
                } else {
                    resultDiv.querySelector('.correct').classList.add('incorrect');
                }
            }
        });
        
        // 显示结果
        document.getElementById('score-text').textContent = 
            `正解数: ${this.score}/${this.currentQuiz.length}`;
        document.getElementById('feedback').textContent = this.getFeedback();
        this.scoreSummary.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    getFeedback() {
        const percent = this.score / this.currentQuiz.length;
        if (percent >= 0.9) return '⭐️ 卓越した語彙力！ N1レベルに挑戦しましょう';
        if (percent >= 0.7) return '✅ 合格圏内！ 弱点をさらに強化しましょう';
        if (percent >= 0.5) return '⚠️ 要強化！ 『新完全マスター語彙N2』で復習を';
        return '❌ 基礎から体系的に学習が必要です';
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => new QuizApp());