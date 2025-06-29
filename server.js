const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

let items = [];
let travelItems = [];

let localRecommendations = [];
let eventInterestGroups = [];
let skillSwapMentorships = [];

app.get('/items', (req, res) => {
  res.json(items);
});

app.post('/items', (req, res) => {
  const { title, description, price, pics, address, city, category } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newItem = { id: Date.now(), title, description, price, pics, address, city, category };
  items.push(newItem);
  res.status(201).json(newItem);
});

app.get('/travel-items', (req, res) => {
  res.json(travelItems);
});

app.post('/travel', (req, res) => {
  const { travelFrom, travelTo, date, numberOfPassengers } = req.body;
  if (!travelFrom || !travelTo) {
    return res.status(400).json({ error: 'Travel from and to are required' });
  }
  const newTravelItem = { id: Date.now(), travelFrom, travelTo, date, numberOfPassengers };
  travelItems.push(newTravelItem);
  res.status(201).json(newTravelItem);
});

app.get('/local-recommendations', (req, res) => {
  res.json(localRecommendations);
});

app.post('/local-recommendations', (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newLocalRecommendation = { id: Date.now(), title, description };
  localRecommendations.push(newLocalRecommendation);
  res.status(201).json(newLocalRecommendation);
});

app.get('/event-interest-groups', (req, res) => {
  res.json(eventInterestGroups);
});

app.post('/event-interest-groups', (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newEventInterestGroup = { id: Date.now(), title, description };
  eventInterestGroups.push(newEventInterestGroup);
  res.status(201).json(newEventInterestGroup);
});

app.get('/skill-swap-mentorship', (req, res) => {
  res.json(skillSwapMentorships);
});

app.post('/skill-swap-mentorship', (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newSkillSwapMentorship = { id: Date.now(), title, description };
  skillSwapMentorships.push(newSkillSwapMentorship);
  res.status(201).json(newSkillSwapMentorship);
});

app.delete('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = items.findIndex(item => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  items.splice(index, 1);
  res.status(204).send();
});

app.delete('/travel/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = travelItems.findIndex(item => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Travel item not found' });
  }
  travelItems.splice(index, 1);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Bondly backend server running at http://localhost:${port}`);
});
