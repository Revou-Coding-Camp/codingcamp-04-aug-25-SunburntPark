
        let tasks = [];
        let currentFilter = 'all'; // 'all', 'pending', 'completed'
        let editingTaskId = null;

        function generateId() {
            return Date.now().toString();
        }

        function addTask() {
            const taskName = document.getElementById('taskName').value.trim();
            const taskDate = document.getElementById('taskDate').value;

            if (!taskName || !taskDate) {
                alert('Please fill in both task name and date');
                return;
            }

            const task = {
                id: generateId(),
                name: taskName,
                date: taskDate,
                status: 'pending'
            };

            tasks.push(task);
            
            // Clear inputs
            document.getElementById('taskName').value = '';
            document.getElementById('taskDate').value = '';

            updateDisplay();
        }

        function deleteTask(id) {
            tasks = tasks.filter(task => task.id !== id);
            updateDisplay();
        }

        function toggleTaskStatus(id) {
            const task = tasks.find(task => task.id === id);
            if (task) {
                task.status = task.status === 'pending' ? 'completed' : 'pending';
                updateDisplay();
            }
        }

        function editTask(id) {
            const task = tasks.find(task => task.id === id);
            if (task) {
                editingTaskId = id;
                document.getElementById('editTaskName').value = task.name;
                document.getElementById('editTaskDate').value = task.date;
                document.getElementById('editModal').style.display = 'block';
            }
        }

        function saveEditTask() {
            const taskName = document.getElementById('editTaskName').value.trim();
            const taskDate = document.getElementById('editTaskDate').value;

            if (!taskName || !taskDate) {
                alert('Please fill in both task name and date');
                return;
            }

            const task = tasks.find(task => task.id === editingTaskId);
            if (task) {
                task.name = taskName;
                task.date = taskDate;
                updateDisplay();
                hideEditModal();
            }
        }

        function hideEditModal() {
            document.getElementById('editModal').style.display = 'none';
            editingTaskId = null;
        }

        function toggleFilter() {
            if (currentFilter === 'all') {
                currentFilter = 'pending';
                document.getElementById('filterBtn').textContent = 'Show Pending';
            } else if (currentFilter === 'pending') {
                currentFilter = 'completed';
                document.getElementById('filterBtn').textContent = 'Show Completed';
            } else {
                currentFilter = 'all';
                document.getElementById('filterBtn').textContent = 'Filter';
            }
            
            // Toggle active class
            const filterBtn = document.getElementById('filterBtn');
            if (currentFilter === 'all') {
                filterBtn.classList.remove('filter-active');
            } else {
                filterBtn.classList.add('filter-active');
            }
            
            updateDisplay();
        }

        function toggleSort() {
            tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
            updateDisplay();
        }

        function showDeleteAllModal() {
            if (tasks.length === 0) {
                alert('No tasks to delete');
                return;
            }
            document.getElementById('deleteAllModal').style.display = 'block';
        }

        function hideDeleteAllModal() {
            document.getElementById('deleteAllModal').style.display = 'none';
        }

        function deleteAllTasks() {
            tasks = [];
            hideDeleteAllModal();
            updateDisplay();
        }

        function updateStats() {
            const total = tasks.length;
            const completed = tasks.filter(task => task.status === 'completed').length;
            const pending = tasks.filter(task => task.status === 'pending').length;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

            document.getElementById('totalTasks').textContent = total;
            document.getElementById('completedTasks').textContent = completed;
            document.getElementById('pendingTasks').textContent = pending;
            document.getElementById('progressPercent').textContent = progress + '%';
            document.getElementById('progressBar').style.width = progress + '%';
        }

        function updateTasksTable() {
            const tbody = document.getElementById('tasksTable');
            const noTasks = document.getElementById('noTasks');
            
            // Filter tasks based on current filter
            let filteredTasks = tasks;
            if (currentFilter === 'pending') {
                filteredTasks = tasks.filter(task => task.status === 'pending');
            } else if (currentFilter === 'completed') {
                filteredTasks = tasks.filter(task => task.status === 'completed');
            }

            if (filteredTasks.length === 0) {
                tbody.innerHTML = '';
                noTasks.style.display = 'block';
            } else {
                noTasks.style.display = 'none';
                tbody.innerHTML = filteredTasks.map(task => `
                    <tr>
                        <td>${task.name}</td>
                        <td>${formatDate(task.date)}</td>
                        <td><span class="status-badge ${task.status}">${task.status === 'completed' ? 'Completed' : 'Pending'}</span></td>
                        <td>
                            <div class="actions">
                                <button class="action-btn edit-btn" onclick="editTask('${task.id}')"><i class="fa-solid fa-pen" style="color: black;"></i></button>
                                <button class="action-btn complete-btn" onclick="toggleTaskStatus('${task.id}')">${task.status === 'completed' ? '<i class="fa-solid fa-arrow-rotate-left"></i>' : '<i class="fa-solid fa-check"></i>'}</button>
                                <button class="action-btn delete-btn" onclick="deleteTask('${task.id}')"><i class="fa-solid fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            }
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        }

        function updateDisplay() {
            updateStats();
            updateTasksTable();
        }

        // Event listeners
        document.getElementById('taskName').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });

        document.getElementById('taskDate').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addTask();
            }
        });

        // Close modals when clicking outside
        window.onclick = function(event) {
            const deleteModal = document.getElementById('deleteAllModal');
            const editModal = document.getElementById('editModal');
            
            if (event.target === deleteModal) {
                hideDeleteAllModal();
            }
            if (event.target === editModal) {
                hideEditModal();
            }
        }

        // Initialize display
        updateDisplay();