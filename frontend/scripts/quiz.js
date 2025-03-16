document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('id');

    if (!quizId) {
        alert('Quiz ID is missing!');
        return;
    }

    fetch(`http://localhost:5502/quizzes/all`)
        .then(response => response.json())
        .then(quizzes => {
            const quiz = quizzes.find(q => q.id == quizId);

            if (!quiz) {
                alert('Quiz not found!');
                return;
            }

            const quizContainer = document.getElementById('quiz-container');
            const quizTitle = document.createElement('h3');
            quizTitle.textContent = quiz.name;
            const quizDescription = document.createElement('p');
            quizDescription.textContent = quiz.description;

            quizContainer.appendChild(quizTitle);
            quizContainer.appendChild(quizDescription);

        })
        .catch(error => {
            console.error('Error fetching quizzes:', error);
            alert('There was an error loading quizzes.');
        });

    fetch(`http://localhost:5502/quizzes/${quizId}`)
        .then(
            response => response.json()
        )
        .then(questions => {
            if (questions) {
                const quizContainer = document.getElementById('quiz-container');

                questions.forEach((question, index) => {
                    const questionElement = document.createElement('div');
                    questionElement
                        .classList
                        .add('question');
                    questionElement.innerHTML = `<h4>Question ${index + 1}: ${question.text}</h4>`;

                    const questionField = document.createElement('div');
                    questionField
                        .classList
                        .add('answer__field');

                    if (question.type === 'text') {
                        questionField.innerHTML += `<input type="text" placeholder="Your answer" class="form__field" data-question-id="${question.id}">`;
                    } else if (question.type === 'single' || question.type === 'multiple') {
                        let options = question.options;

                            // Если options — строка, распарсим её в массив
                            if (typeof options === 'string') {
                                try {
                                    options = JSON.parse(options);
                                } catch (error) {
                                    console.error("Error parsing options:", error);
                                    options = []; // Если не удалось распарсить, делаем пустым массивом
                                }
                            }

                        console.log(`Question ${index + 1}:`, question);
                        console.log("Options:", question.options);
                        if (Array.isArray(options)) {
                            options.forEach(option => {
                                const inputType = question.type === 'single' ? 'radio' : 'checkbox';
                                questionField.innerHTML += `<label><input type="${inputType}" name="question-${index}" value="${option}"> ${option}</label><br>`;
                            });
                        } else {
                            console.warn(`Options for question ${index + 1} is not an array:`, options);
                        }
                    }

                    // questionElement.innerHTML = `     <h4>Question ${index + 1}:
                    // ${question.text}</h4>     <input type="text" placeholder="Your answer"
                    // id="answer-${index}" data-question-id="${question.id}"> `;
                    console.log(questions);

                    quizContainer.appendChild(questionElement);
                    questionElement.appendChild(questionField);
                });

            } else {
                alert("No questions found for this quiz!");
            }

        })
        .catch(error => {
            console.error('Error fetching questions:', error);
            alert('There was an error loading questions.');
        });

    document
        .getElementById('submit-quiz')
        .addEventListener('click', () => {
            const answers = [];
            const allQuestions = document.querySelectorAll('.question input');

            allQuestions.forEach((input, index) => {
                answers.push({
                    question_id: index + 1,
                    answer_text: input.value
                });
            });

            console.log('Submitted answers:', answers);
            fetch('http://localhost:5502/quizzes/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({answers})
            })
                .then(response => response.json())
                .then(data => console.log('Server response:', data))
                .catch(error => console.error('Error submitting answers:', error));
        });
});
