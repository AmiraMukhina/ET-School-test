document.addEventListener("DOMContentLoaded", async () => {
    const quizList = document.getElementById("quiz-list");
    // let currentPage = 1;

    try {
        const response = await fetch("http://localhost:5502/quizzes/all");
        const quizzes = await response.json();

        quizzes.forEach(quiz => {
            const div = document.createElement("div");
            div.innerHTML = `<h2>${quiz.name}</h2>
            <p>${quiz.description}</p>
            <p>Questions: ${quiz.question_count}</p>
            <p>Completions: ${quiz.completions}</p>
            <div class="control-button-container">
                <button class="run-quiz button-46" data-id="${quiz.id}">Run</button>
                <a href="edit-quiz.html?id=${quiz.id}" class="edit-quiz button-46">Edit</a>
                <button class="delete-quiz button-46" data-id="${quiz.id}">Delete</button></div>`;
            quizList.appendChild(div);
        });

        quizList.addEventListener("click", async (event) => {
            if (event.target.classList.contains("run-quiz")) {
                const quizId = event.target.getAttribute("data-id");

                window.location.href = `quiz.html?id=${quizId}`;
            }

            if (event.target.classList.contains("delete-quiz")) {
                const quizId = event.target.getAttribute("data-id");
                console.log(`quiz num ${quizId}`);

                const confirmDelete = confirm("Are you sure you want to delete this quiz?");
                if (confirmDelete) {
                    console.log(`${quizId}`);
                    await fetch(`http://localhost:5502/quizzes/${quizId}`, {method: 'DELETE'});
                    alert("Quiz deleted!");
                    location.reload(); 
                }
            }
        });

    } catch (error) {
        console.error("Error loading quizzes:", error);
    }

});

