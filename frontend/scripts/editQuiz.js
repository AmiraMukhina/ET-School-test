document.addEventListener("DOMContentLoaded", async () => {
    const quizId = new URLSearchParams(window.location.search).get('id');
    const quizNameInput = document.getElementById('quiz-name');
    const quizDescriptionInput = document.getElementById('quiz-description');
    const questionsContainer = document.getElementById('questions-container');

    try {
        const quizResponse = await fetch(`http://localhost:5502/quizzes/${quizId}`);
        const quizData = await quizResponse.json();  

        console.log('Quiz data:', quizData);

        if (Array.isArray(quizData) && quizData.length > 0) {
            const quizInfo = quizData[0];  

            quizNameInput.value = quizInfo.quiz_name || ''; 
            quizDescriptionInput.value = quizInfo.quiz_description || '';

            quizData.forEach((question, index) => {
                console.log(`Adding question ${index + 1}: ${question.text}`);

                let options = [];
                try {
                    options = JSON.parse(question.options); 
                } catch (e) {
                    console.error('Error parsing options:', e);
                }

                const questionDiv = document.createElement('div');
                questionDiv.classList.add('question');
                questionDiv.setAttribute('data-id', question.id);

                questionDiv.innerHTML = `
                    <label>Question: <input class="form__field" type="text" name="question-text" value="${question.text}" required></label>
                    <br>
                    <label>Type:
                        <select class="question-type form__field">
                            <option value="text" ${question.type === 'text' ? 'selected' : ''}>Text</option>
                            <option value="single" ${question.type === 'single' ? 'selected' : ''}>Single choice</option>
                            <option value="multiple" ${question.type === 'multiple' ? 'selected' : ''}>Multiple choices</option>
                        </select>
                    </label>
                    <div class="answers">
                        ${options.map(option => `
                            <div>
                                <input class="form__field" type="text" name="answer-option" value="${option}" required>
                                <button type="button" class="remove-answer button-46 delete-quiz">✖</button>
                            </div>
                        `).join('')}
                    </div>
                    <button type="button" class="remove-question button-46 delete-quiz">Delete question</button>
                `;
                questionsContainer.appendChild(questionDiv);

                questionDiv.querySelector('.remove-question').addEventListener('click', () => {
                    if (confirm('Are you sure you want to delete this question?')) {
                        questionDiv.remove();
                    }
                });

                questionDiv.querySelectorAll('.remove-answer').forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.target.closest('div').remove();
                    });
                });
            });
        } else {
            console.error("Questions data is not an array:", quizData);
        }

        document.getElementById('add-question').addEventListener('click', (event) => {
            event.preventDefault();
            const newQuestion = document.createElement('div');
            newQuestion.classList.add('question');

            newQuestion.innerHTML = `
                <label>Question: <input class="form__field" type="text" name="question-text" required></label>
                <br>
                <label>Type:
                    <select class="question-type form__field">
                        <option value="text">Text</option>
                        <option value="single">Single choice</option>
                        <option value="multiple">Multiple choices</option>
                    </select>
                </label>
                <div class="answers"></div>
                <button type="button" class="remove-question button-46 delete-quiz">Delete question</button>
            `;
            questionsContainer.appendChild(newQuestion);
        });

        document.getElementById('quiz-form').addEventListener('submit', async (event) => {
            event.preventDefault();
        
            const quizData = {
                name: quizNameInput.value,
                description: quizDescriptionInput.value,
                questions: []
            };

            document.querySelectorAll('.question').forEach((questionDiv) => {
                const questionText = questionDiv.querySelector('[name="question-text"]').value;
                const questionType = questionDiv.querySelector('.question-type').value;
                const options = [...questionDiv.querySelectorAll('[name="answer-option"]')].map(input => input.value);
        
                quizData.questions.push({ text: questionText, type: questionType, options });
            });

           
    try {
        const updateResponse = await fetch(`http://localhost:5502/quizzes/${quizId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quizData),
        });

        if (updateResponse.ok) {
            alert('Quiz updated successfully!');
            window.location.href = 'index.html';
        } else {
            alert('Error updating quiz');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error updating the quiz.');
    }
});
    } catch (error) {
        console.error('Error loading quiz:', error);
    }
});
