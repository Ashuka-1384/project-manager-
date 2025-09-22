// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', () => {

    // ==================== Enhanced Theme Switcher with localStorage ====================
    const themeSwitcher = document.getElementById('theme-switcher');
    const body = document.body;

    // Load saved theme or detect system preference
    const savedTheme = localStorage.getItem('dashboard-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        body.classList.add('dark-mode');
        updateThemeIcon(true);
    }

    themeSwitcher.addEventListener('click', () => {
        const isDark = body.classList.contains('dark-mode');
        body.classList.toggle('dark-mode');
        
        // Save theme preference
        localStorage.setItem('dashboard-theme', isDark ? 'light' : 'dark');
        
        // Update icon and chart
        updateThemeIcon(!isDark);
        updateChartTheme(!isDark);
        
        // Add smooth transition effect
        body.style.transition = 'all 0.3s ease';
        setTimeout(() => body.style.transition = '', 300);
    });

    function updateThemeIcon(isDark) {
        const icon = themeSwitcher.querySelector('i');
        if (isDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // ==================== Enhanced Data Management ====================
    let projectData = {
        activeProjects: 12,
        hoursLogged: 145,
        tasksCompleted: 89,
        projectStatus: {
            completed: 65,
            inProgress: 25,
            pending: 10
        }
    };

    // Load saved data or use default
    const savedData = localStorage.getItem('dashboard-data');
    if (savedData) {
        projectData = { ...projectData, ...JSON.parse(savedData) };
    }

    // Update stats cards with animation
    function updateStatsWithAnimation() {
        const elements = {
            'active-projects': projectData.activeProjects,
            'hours-logged': projectData.hoursLogged,
            'tasks-completed': projectData.tasksCompleted
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            animateNumber(element, 0, value, 1000);
        });
    }

    function animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        const difference = end - start;

        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (difference * progress));
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        }
        
        requestAnimationFrame(updateNumber);
    }

    updateStatsWithAnimation();

    // ==================== Enhanced Chart.js Implementation ====================
    const ctx = document.getElementById('projectStatusChart').getContext('2d');
    let projectStatusChart;

    function createChart() {
        projectStatusChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['تکمیل شده', 'در حال انجام', 'در انتظار'],
                datasets: [{
                    label: 'وضعیت پروژه‌ها',
                    data: [
                        projectData.projectStatus.completed, 
                        projectData.projectStatus.inProgress, 
                        projectData.projectStatus.pending
                    ],
                    backgroundColor: [
                        '#4caf50', // Green for completed
                        '#2196f3', // Blue for in-progress
                        '#ffc107'  // Yellow for pending
                    ],
                    borderColor: body.classList.contains('dark-mode') ? '#1e1e1e' : '#ffffff',
                    borderWidth: 4,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 2000,
                    easing: 'easeInOutQuart'
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: getComputedStyle(body).getPropertyValue('--text-color'),
                            font: {
                                family: "'Vazirmatn', sans-serif",
                                size: 12
                            },
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: body.classList.contains('dark-mode') ? '#2d2d2d' : '#ffffff',
                        titleColor: getComputedStyle(body).getPropertyValue('--text-color'),
                        bodyColor: getComputedStyle(body).getPropertyValue('--text-color'),
                        borderColor: getComputedStyle(body).getPropertyValue('--border-color'),
                        borderWidth: 1,
                        cornerRadius: 8
                    }
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const index = elements[0].index;
                        const labels = ['تکمیل شده', 'در حال انجام', 'در انتظار'];
                        showProjectDetails(labels[index], projectData.projectStatus[Object.keys(projectData.projectStatus)[index]]);
                    }
                }
            }
        });
    }

    function updateChartTheme(isDark) {
        if (projectStatusChart) {
            projectStatusChart.data.datasets[0].borderColor = isDark ? '#1e1e1e' : '#ffffff';
            projectStatusChart.options.plugins.legend.labels.color = isDark ? '#e0e0e0' : '#333';
            projectStatusChart.options.plugins.tooltip.backgroundColor = isDark ? '#2d2d2d' : '#ffffff';
            projectStatusChart.options.plugins.tooltip.titleColor = isDark ? '#e0e0e0' : '#333';
            projectStatusChart.options.plugins.tooltip.bodyColor = isDark ? '#e0e0e0' : '#333';
            projectStatusChart.update();
        }
    }

    createChart();

    // ==================== Enhanced Task Management ====================
    const taskList = document.querySelector('.task-list');
    const tasks = [
        { id: 1, text: 'طراحی صفحه اصلی', completed: false, status: 'in-progress' },
        { id: 2, text: 'پیاده‌سازی API ورود', completed: true, status: 'completed' },
        { id: 3, text: 'تست واکنش‌گرایی', completed: false, status: 'pending' },
        { id: 4, text: 'رفع باگ‌های گزارش شده', completed: false, status: 'in-progress' }
    ];

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            li.innerHTML = `
                <label>
                    <input type="checkbox" ${task.completed ? 'checked' : ''} data-task-id="${task.id}">
                    <span>${task.text}</span>
                </label>
                <div class="task-actions">
                    <span class="task-tag ${task.status}">${getStatusText(task.status)}</span>
                    <button class="delete-task-btn" data-task-id="${task.id}" title="حذف تسک">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            taskList.appendChild(li);
        });

        // Add event listeners for checkboxes
        taskList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', handleTaskToggle);
        });

        // Add event listeners for delete buttons
        taskList.querySelectorAll('.delete-task-btn').forEach(btn => {
            btn.addEventListener('click', handleTaskDelete);
        });
    }

    function getStatusText(status) {
        const statusMap = {
            'completed': 'تکمیل شده',
            'in-progress': 'در حال انجام',
            'pending': 'در انتظار'
        };
        return statusMap[status] || status;
    }

    function handleTaskToggle(event) {
        const taskId = parseInt(event.target.dataset.taskId);
        const task = tasks.find(t => t.id === taskId);
        
        if (task) {
            task.completed = event.target.checked;
            task.status = task.completed ? 'completed' : 'in-progress';
            
            // Update task display
            const taskItem = event.target.closest('.task-item');
            const statusTag = taskItem.querySelector('.task-tag');
            statusTag.className = `task-tag ${task.status}`;
            statusTag.textContent = getStatusText(task.status);
            
            // Update project data
            updateProjectStats();
            saveData();
        }
    }

    function handleTaskDelete(event) {
        const taskId = parseInt(event.target.closest('.delete-task-btn').dataset.taskId);
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        
        if (taskIndex !== -1) {
            if (confirm('آیا مطمئن هستید که می‌خواهید این تسک را حذف کنید؟')) {
                tasks.splice(taskIndex, 1);
                renderTasks();
                updateProjectStats();
                saveData();
                showNotification('تسک با موفقیت حذف شد!', 'success');
            }
        }
    }

    function updateProjectStats() {
        const completedTasks = tasks.filter(t => t.completed).length;
        const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
        const pendingTasks = tasks.filter(t => t.status === 'pending').length;
        
        projectData.tasksCompleted = completedTasks;
        projectData.projectStatus = {
            completed: completedTasks,
            inProgress: inProgressTasks,
            pending: pendingTasks
        };

        // Update chart
        if (projectStatusChart) {
            projectStatusChart.data.datasets[0].data = [completedTasks, inProgressTasks, pendingTasks];
            projectStatusChart.update();
        }

        // Update stats display
        document.getElementById('tasks-completed').textContent = completedTasks;
    }

    function saveData() {
        localStorage.setItem('dashboard-data', JSON.stringify(projectData));
        localStorage.setItem('dashboard-tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const savedTasks = localStorage.getItem('dashboard-tasks');
        if (savedTasks) {
            tasks.splice(0, tasks.length, ...JSON.parse(savedTasks));
        }
    }

    // ==================== Project Details Modal ====================
    function showProjectDetails(title, count) {
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <h3>${title}</h3>
                    <p>تعداد: ${count} پروژه</p>
                    <button class="close-modal">بستن</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                modal.remove();
            }
        });
    }

    // ==================== Add Task Functionality ====================
    const addTaskBtn = document.getElementById('add-task-btn');
    
    addTaskBtn.addEventListener('click', () => {
        const taskText = prompt('لطفاً متن تسک جدید را وارد کنید:');
        if (taskText && taskText.trim()) {
            const newTask = {
                id: Date.now(), // Simple ID generation
                text: taskText.trim(),
                completed: false,
                status: 'pending'
            };
            tasks.push(newTask);
            renderTasks();
            updateProjectStats();
            saveData();
            showNotification('تسک جدید با موفقیت اضافه شد!', 'success');
        }
    });

    // ==================== Initialize Everything ====================
    loadTasks();
    renderTasks();
    updateProjectStats();

    // ==================== Add Loading Animation ====================
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // ==================== Notification System ====================
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fa-solid fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
    }

    // ==================== Add Keyboard Navigation ====================
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.querySelector('.project-modal');
            if (modal) modal.remove();
        }
    });

});