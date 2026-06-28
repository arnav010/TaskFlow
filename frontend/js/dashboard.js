const API_URL = "http://localhost:5000";

const boardForm = document.getElementById("boardForm");
const boardTitleInput = document.getElementById("boardTitle");
const boardDescriptionInput = document.getElementById("boardDescription");
const boardsContainer = document.getElementById("boardsContainer");
const boardMessage = document.getElementById("boardMessage");

// Load boards when the dashboard page opens.
document.addEventListener("DOMContentLoaded", getBoards);

boardForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const title = boardTitleInput.value.trim();
  const description = boardDescriptionInput.value.trim();

  if (title === "") {
    boardMessage.textContent = "Please enter a board title.";
    return;
  }

  try {
    await fetch(`${API_URL}/boards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        description: description
      })
    });

    boardForm.reset();
    boardMessage.textContent = "Board created successfully.";
    getBoards();
  } catch (error) {
    boardMessage.textContent = "Could not create board.";
  }
});

async function getBoards() {
  try {
    const response = await fetch(`${API_URL}/boards`);
    const boards = await response.json();

    boardsContainer.innerHTML = "";

    if (boards.length === 0) {
      boardMessage.textContent = "No boards yet. Create your first board above.";
      return;
    }

    boardMessage.textContent = "";

    boards.forEach(function (board) {
      const boardCard = document.createElement("div");
      boardCard.className = "board-card";

      const title = document.createElement("h3");
      title.textContent = board.title;

      const description = document.createElement("p");
      description.textContent = board.description || "No description added.";

      const actions = document.createElement("div");
      actions.className = "board-actions";

      const openLink = document.createElement("a");
      openLink.href = "board.html";
      openLink.className = "button secondary-button";
      openLink.textContent = "Open Board";

      const deleteButton = document.createElement("button");
      deleteButton.className = "button danger-button";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", function () {
        deleteBoard(board._id);
      });

      actions.appendChild(openLink);
      actions.appendChild(deleteButton);

      boardCard.appendChild(title);
      boardCard.appendChild(description);
      boardCard.appendChild(actions);

      boardsContainer.appendChild(boardCard);
    });
  } catch (error) {
    boardMessage.textContent = "Could not load boards.";
  }
}

async function deleteBoard(boardId) {
  try {
    await fetch(`${API_URL}/boards/${boardId}`, {
      method: "DELETE"
    });

    boardMessage.textContent = "Board deleted.";
    getBoards();
  } catch (error) {
    boardMessage.textContent = "Could not delete board.";
  }
}
