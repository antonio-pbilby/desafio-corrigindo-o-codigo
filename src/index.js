const express = require("express");

const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function updateLikes(repository) {
  repository.likes++;
  return repository.likes;
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const isUUID = validate(id);
  if (!isUUID) return response.status(404).json({ error: "Invalid ID" });

  const updatedRepository = request.body;
  console.log(updatedRepository);

  // const repositoryIndex = repositories.findindex(
  //   (repository) => repository.id === id
  // );

  // if (repositoryIndex < 0) {
  //   return response.status(404).json({ error: "Repository not found" });
  // }
  const repository = repositories.find((repository) => repository.id === id);

  if (!repository)
    return response.status(404).json({ error: "Repository not found" });

  for (attribute in updatedRepository) {
    if (attribute != "likes")
      repository[attribute] = updatedRepository[attribute];
  }

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const repository = repositories[repositoryIndex];
  const likes = updateLikes(repository);

  return response.json({ likes });
});

module.exports = app;
