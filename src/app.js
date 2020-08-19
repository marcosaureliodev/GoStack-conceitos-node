const express = require("express");
const cors = require("cors");
const { uuid, isUuid} = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;
  if (!isUuid()) {
    return response.status(400).json({ error: 'Invalid repository ID' });
  }
  return next();
}
app.use('/repositorios/id', validateRepositoryId);

  // ROTAS
app.get("/repositories", (request, response) => {
  // TUDO
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  // TUDO
  const { title, url, techs } = request.body;
  
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  // TUDO
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex =
    repositories.findIndex(repository => repository.id === id)

  const foundRepository =
    repositories.find(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: foundRepository.likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  // TODO
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  const foundRepository =  repositories.find(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  }

  const repository = {
      id,
      title: foundRepository.title,
      url: foundRepository.url,
      techs: foundRepository.techs,
      likes: foundRepository.likes + 1
  }

  repositories[repositoryIndex] = repository

  return response.json(repository)
});

module.exports = app;
