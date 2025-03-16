document.getElementById('quiz-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const quizName = document.getElementById('quiz-name').value;
    const quizDescription = document.getElementById('quiz-description').value;
    const questions = [];

    document.querySelectorAll('.question').forEach((questionDiv, index) => {
        const questionText = questionDiv.querySelector('[name="question-text"]').value;
        const questionType = questionDiv.querySelector('.question-type').value;
        let options = [];

        if (questionType === 'single' || questionType === 'multiple') {
            options = [...questionDiv.querySelectorAll('[name="answer-option"]')].map(input => input.value);
        }

        questions.push({ text: questionText, type: questionType, options });
    });

    const quizData = {
        name: quizName,
        description: quizDescription,
        question_count: 5,
        questions
    };

    try {
        const createResponse = await fetch('http://localhost:5502/quizzes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quizData),
        });

        const result = await createResponse.json();
        if (createResponse.ok) {
            alert('Quiz created successfully!');
            window.location.href = "index.html";
        } else {
            alert('Error creating quiz: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('There was an error creating the quiz.');
    }
});



document.getElementById('add-question').addEventListener('click', function (event) {
    event.preventDefault();

    const questionContainer = document.createElement('div');
    questionContainer.classList.add('question');
    questionContainer.setAttribute('draggable', 'true');

    questionContainer.innerHTML = `
        <label>Question: <input class="form__field"  type="text" name="question-text" required></label>
        <br>
        <label>Type:
            <select class="question-type form__field">
                <option value="text">Text</option>
                <option value="single">Single choice</option>
                <option value="multiple">Multiple choices</option>
            </select>
        </label>
        <div class="answers"></div>
        <button type="button" class="add-answer button-46" style="display: none;">Add response option</button>
        <button type="button" class="remove-question button-46 delete-quiz">Delete question</button>
    `;

    document.getElementById('questions-container').appendChild(questionContainer);

    const questionTypeSelect = questionContainer.querySelector('.question-type');
    const answersContainer = questionContainer.querySelector('.answers');
    const addAnswerButton = questionContainer.querySelector('.add-answer');

    questionTypeSelect.addEventListener('change', function () {
        answersContainer.innerHTML = '';
        addAnswerButton.style.display = 'none';

        if (this.value === 'text') {
            answersContainer.innerHTML = '<input class="form__field"  type="text" disabled placeholder="Answer">';
        } else if (this.value === 'single' || this.value === 'multiple') {
            addAnswerButton.style.display = 'block';
        } 
    });

    addAnswerButton.addEventListener('click', function () {
        const answerInput = document.createElement('div');
        answerInput.innerHTML = `<input class="form__field"  type="text" name="answer-option" required> <button type="button" class="remove-answer button-46 delete-quiz">✖</button>`;
        answersContainer.appendChild(answerInput);

        answerInput.querySelector('.remove-answer').addEventListener('click', function () {
            answerInput.remove();
        });
    });

    questionContainer.querySelector('.remove-question').addEventListener('click', function () {
        questionContainer.remove();
    });

    //drag and drop
    questionContainer.addEventListener('dragstart', function (event) {
        event.dataTransfer.setData('text/plain', null);
        questionContainer.classList.add('dragging');
    });

    questionContainer.addEventListener('dragend', function () {
        questionContainer.classList.remove('dragging');
    });

    document.getElementById('questions-container').addEventListener('dragover', function (event) {
        event.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        const afterElement = getDragAfterElement(event.clientY);
        if (afterElement == null) {
            this.appendChild(draggingItem);
        } else {
            this.insertBefore(draggingItem, afterElement);
        }
    });

    function getDragAfterElement(y) {
        const draggableElements = [...document.querySelectorAll('.question:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            return offset < 0 && offset > closest.offset ? { offset, element: child } : closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});
