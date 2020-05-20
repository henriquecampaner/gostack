const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(cors());

app.use(express.json());

/**
 * Methods  HTTP
 * 
 * GET - Search information on backend
 * POST - Create something on backend
 * PUT - Change informations on backend
 * PATCH - Change only one information
 * DELETE - To delete some information
 */

 /**
  * Params
  * 
  * Query Params: Filters and pagination
  * (url/projects"?title=react&page=2")
  * 
  * Route Params: Identify resources (update / delete)
  * Body Params: Content on the body
  */

/**
 * Middleware
 * 
 * Intercep requestes
 */

const projects = [];

function logRequest(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
}

function validateProjectId(request, response, next) {
  const { id } = request.params;
  if(!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid project Id' });
  }

  return next();
}

app.use(logRequest);
app.use('/projects/:id', validateProjectId);

app.get('/projects', (request, response) => {
  const { title } = request.query;

  const results = title 
    ? projects.filter(project => project.title.includes(title))
    : projects;

  return response.json(results);
});

app.post('/projects', (request, response) => {
  const { title, owner } = request.body;

  const project = { title, owner, id: uuid() };

  projects.push(project)

  return response.json(project);
});

app.put('/projects/:id', (request, response) => {
  const {id} = request.params;
  const { title, owner } = request.body;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(404).json({ error: 'Project not found' });
  }

  const project = {
    id,
    title,
    owner,
  }

  projects[projectIndex] = project;

  return response.json(project);
});

app.delete('/projects/:id', (request, response) => {
  const {id} = request.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return response.status(404).json({ error: 'Project not found' });
  }

  projects.splice(projectIndex, 1);

  return response.status(204).send();
});

app.listen(3333, () => {
  console.log('✔ Back-end started!');
});