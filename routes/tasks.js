const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const User = require('../models/user')

// All Tasks Route
router.get('/', async (req, res) => {
  let query = Task.find()
  if (req.query.taskName != null && req.query.taskName != '') {
    query = query.regex('taskName', new RegExp(req.query.taskName, 'i'))
  }
  if (req.query.scheduledDate != null && req.query.scheduledDate != '') {
    query = query.lte('scheduledDate', req.query.scheduledDate)
  }
  try {
    const tasks = await query.exec()
    res.render('tasks/index', {
      tasks: tasks,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Task Route
router.get('/new', async (req, res) => {
  renderNewTask(res, new Task())
})

// Create Task Route
router.post('/', async (req, res) => {
  const task = new Task({
    taskName: req.body.taskName,
    user: req.body.user,
    scheduledDate: new Date(req.body.scheduledDate),
    description: req.body.description
  })

  try {
    const newTask = await task.save()
    res.redirect(`tasks/${newTask.id}`)
  } catch {
    renderNewTask(res, task, true)
  }
})

// Show Task Route
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
                           .populate('user')
                           .exec()
    res.render('tasks/show', { task: task })
  } catch {
    res.redirect('/')
  }
})

// Edit Task Route
router.get('/:id/edit', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    renderEditPage(res, task)
  } catch {
    res.redirect('/')
  }
})

// Update Task Route
router.put('/:id', async (req, res) => {
  let task

  try {
    task = await Task.findById(req.params.id)
    task.taskName = req.body.taskName
    task.user = req.body.user
    task.scheduledDate = new Date(req.body.scheduledDate)
    task.description = req.body.description
    await task.save()
    res.redirect(`/tasks/${task.id}`)
  } catch {
    if (task != null) {
      renderEditPage(res, task, true)
    } else {
      redirect('/')
    }
  }
})

// Delete Task Page
router.delete('/:id', async (req, res) => {
  let task
  try {
    task = await Task.findById(req.params.id)
    await task.remove()
    res.redirect('/tasks')
  } catch {
    if (task != null) {
      res.render('tasks/show', {
        task: task,
        errorMessage: 'Could not remove task'
      })
    } else {
      res.redirect('/')
    }
  }
})

async function renderNewTask(res, task, hasError = false) {
  renderFormPage(res, task, 'new', hasError)
}

async function renderEditPage(res, task, hasError = false) {
  renderFormPage(res, task, 'edit', hasError)
}

async function renderFormPage(res, task, form, hasError = false) {
  try {
    const users = await User.find({})
    const params = {
      users: users,
      task: task
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Task'
      } else {
        params.errorMessage = 'Error Creating Task'
      }
    }
    res.render(`tasks/${form}`, params)
  } catch {
    res.redirect('/tasks')
  }
}


module.exports = router;