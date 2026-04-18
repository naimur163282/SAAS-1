import './index.css';
import { createIcons, Layout, CheckCircle, PieChart, Settings, Plus, Trash2, Search, Bell, Moon, Sun, LogIn, ChevronRight, User, Star, Menu } from 'lucide';

// --- Types ---
type Priority = 'low' | 'medium' | 'high';
type Category = 'Math' | 'Science' | 'History' | 'Languages' | 'Other';

interface Task {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  completed: boolean;
  dueDate: string;
}

interface AppState {
  view: 'landing' | 'auth' | 'dashboard' | 'tasks' | 'analytics' | 'settings';
  user: { name: string } | null;
  tasks: Task[];
  theme: 'light' | 'dark';
  notifications: string[];
}

// --- Initial State ---
let state: AppState = {
  view: 'landing',
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'dark', // Default to dark for this theme
  notifications: []
};

// --- State Management ---
function setState(newState: Partial<AppState>) {
  state = { ...state, ...newState };
  if (newState.user !== undefined) localStorage.setItem('user', JSON.stringify(state.user));
  if (newState.tasks !== undefined) localStorage.setItem('tasks', JSON.stringify(state.tasks));
  if (newState.theme !== undefined) {
    localStorage.setItem('theme', state.theme);
    document.documentElement.setAttribute('data-theme', state.theme);
  }
  render();
}

// --- Icons Helper ---
function initIcons() {
  createIcons({
    icons: { Layout, CheckCircle, PieChart, Settings, Plus, Trash2, Search, Bell, Moon, Sun, LogIn, ChevronRight, User, Star, Menu }
  });
}

// --- Components ---

const Navbar = () => `
  <nav class="navbar animate-fade-in">
    <div class="container justify-between flex">
      <div class="nav-logo" style="cursor: pointer" onclick="window.navigate('landing')">
        <div class="logo-icon"></div> EduRoutine AI
      </div>
      <div class="nav-links mobile-hide">
        ${state.view === 'landing' ? `
          <a href="#features" class="nav-link">Features</a>
          <a href="#pricing" class="nav-link">Pricing</a>
          <a href="#testimonials" class="nav-link">Stories</a>
        ` : ''}
      </div>
      <div class="flex items-center gap-4">
        <button onclick="window.toggleTheme()" class="btn-outline" style="padding: 8px">
          <i data-lucide="${state.theme === 'light' ? 'moon' : 'sun'}"></i>
        </button>
        ${state.user ? `
          <button onclick="window.navigate('dashboard')" class="btn btn-primary">Dashboard</button>
        ` : `
          <button onclick="window.navigate('auth')" class="btn btn-primary">
            Get Started <i data-lucide="chevron-right"></i>
          </button>
        `}
      </div>
    </div>
  </nav>
`;

const Sidebar = () => `
  <aside class="sidebar">
    <div class="flex flex-col gap-2">
      <button onclick="window.navigate('dashboard')" class="sidebar-link ${state.view === 'dashboard' ? 'active' : ''}">
        <i data-lucide="layout"></i> Hub
      </button>
      <button onclick="window.navigate('tasks')" class="sidebar-link ${state.view === 'tasks' ? 'active' : ''}">
        <i data-lucide="check-circle"></i> Routines
      </button>
      <button onclick="window.navigate('analytics')" class="sidebar-link ${state.view === 'analytics' ? 'active' : ''}">
        <i data-lucide="pie-chart"></i> Progress
      </button>
      <button onclick="window.navigate('settings')" class="sidebar-link ${state.view === 'settings' ? 'active' : ''}">
        <i data-lucide="settings"></i> Settings
      </button>
    </div>
    <div style="margin-top: auto">
      <div class="sidebar-link" style="opacity: 0.7; cursor: default">
        <i data-lucide="user"></i> ${state.user?.name || 'Guest'}
      </div>
      <button onclick="window.logout()" class="sidebar-link" style="color: #f87171; background: rgba(248, 113, 113, 0.05); margin-top: 8px">
        <i data-lucide="log-in"></i> Logout
      </button>
    </div>
  </aside>
`;

// --- Views ---

const LandingView = () => `
  <div class="animate-fade-in">
    ${Navbar()}
    <section class="hero">
      <div class="container hero-content">
        <h1>Master Your <span>Learning</span>,<br>One Routine at a Time.</h1>
        <p>EduRoutine AI analyzes your learning goals and subjects to generate optimized, science-backed study schedules that fit your life.</p>
        <div class="flex justify-center gap-4">
          <button onclick="window.navigate('auth')" class="btn btn-primary">Start Learning</button>
          <button class="btn btn-outline">See How It Works</button>
        </div>
      </div>
    </section>

    <section id="features" class="container" style="padding: 100px 0">
      <h2 style="text-align: center; margin-bottom: 50px">Why Choice EduRoutine?</h2>
      <div class="grid grid-cols-3 gap-8">
        <div class="card">
          <div style="background: rgba(99, 102, 241, 0.1); width: 48px; height: 48px; border-radius: 12px; display: grid; place-items: center; margin-bottom: 20px">
            <i data-lucide="layout" style="color: var(--c-primary)"></i>
          </div>
          <h3>Goal Analysis</h3>
          <p style="color: var(--c-text-muted)">Tell us your 'motive' and we'll prioritize your hardest subjects first.</p>
        </div>
        <div class="card">
           <div style="background: rgba(244, 63, 94, 0.1); width: 48px; height: 48px; border-radius: 12px; display: grid; place-items: center; margin-bottom: 20px">
            <i data-lucide="bell" style="color: var(--c-accent)"></i>
          </div>
          <h3>Smart Intervals</h3>
          <p style="color: var(--c-text-muted)">Built-in Pomodoro and active recall alerts integrated into your routine.</p>
        </div>
        <div class="card">
           <div style="background: rgba(16, 185, 129, 0.1); width: 48px; height: 48px; border-radius: 12px; display: grid; place-items: center; margin-bottom: 20px">
            <i data-lucide="star" style="color: #10b981"></i>
          </div>
          <h3>AI Generation</h3>
          <p style="color: var(--c-text-muted)">Instant routines based on your available study time and syllabus.</p>
        </div>
      </div>
    <section id="pricing" class="container" style="padding: 100px 0; border-top: 1px solid var(--c-border)">
      <h2 style="text-align: center; margin-bottom: 50px">Simple Pricing</h2>
      <div class="grid grid-cols-3 gap-8">
        <div class="card">
          <h3>Free</h3>
          <div style="font-size: 2rem; font-weight: 700; margin: 20px 0">$0</div>
          <ul style="list-style: none; color: var(--c-text-muted); margin-bottom: 30px">
            <li>✓ 10 Tasks per day</li>
            <li>✓ Basic Analytics</li>
            <li>✓ Mobile Sync</li>
          </ul>
          <button onclick="window.navigate('auth')" class="btn btn-outline" style="width: 100%; justify-content: center">Get Started</button>
        </div>
        <div class="card" style="border-color: var(--c-primary); transform: scale(1.05); z-index: 10">
          <div style="background: var(--c-primary); color: white; font-size: 0.75rem; padding: 4px 12px; border-radius: 99px; display: inline-block; margin-bottom: 12px">MOST POPULAR</div>
          <h3>Pro</h3>
          <div style="font-size: 2rem; font-weight: 700; margin: 20px 0">$12</div>
          <ul style="list-style: none; color: var(--c-text-muted); margin-bottom: 30px">
            <li>✓ Unlimited Tasks</li>
            <li>✓ AI Smart Planning</li>
            <li>✓ Priority Support</li>
          </ul>
          <button onclick="window.navigate('auth')" class="btn btn-primary" style="width: 100%; justify-content: center">Go Pro</button>
        </div>
        <div class="card">
          <h3>Premium</h3>
          <div style="font-size: 2rem; font-weight: 700; margin: 20px 0">$29</div>
          <ul style="list-style: none; color: var(--c-text-muted); margin-bottom: 30px">
            <li>✓ Team Collaboration</li>
            <li>✓ API Access</li>
            <li>✓ Advanced Insights</li>
          </ul>
          <button onclick="window.navigate('auth')" class="btn btn-outline" style="width: 100%; justify-content: center">Contact Sales</button>
        </div>
      </div>
    </section>
  </div>
`;

const AuthView = () => `
  <div class="animate-fade-in">
    ${Navbar()}
    <div class="form-container">
      <div class="card">
        <h2 style="margin-bottom: 24px">Welcome Back</h2>
        <form id="auth-form" onsubmit="window.handleAuth(event)">
          <div class="input-group">
            <label class="input-label">Email Address</label>
            <input type="email" class="input-field" placeholder="you@example.com" required>
          </div>
          <div class="input-group">
            <label class="input-label">Password</label>
            <input type="password" class="input-field" placeholder="••••••••" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center">
            Sign In
          </button>
        </form>
        <p style="text-align: center; margin-top: 20px; font-size: 0.875rem; color: var(--c-text-muted)">
          Don't have an account? <a href="#" style="color: var(--c-primary)">Create one</a>
        </p>
      </div>
    </div>
  </div>
`;

const DashboardView = () => `
  <div class="flex flex-col animate-fade-in">
    ${Navbar()}
    <div class="dashboard-layout">
      ${Sidebar()}
      <main class="main-content">
        <header class="flex justify-between items-center" style="margin-bottom: 32px">
          <div>
            <h1>Learning Hub</h1>
            <p style="color: var(--c-text-muted)">Welcome back, ${state.user?.name}! Ready to study?</p>
          </div>
          <button onclick="window.navigate('tasks')" class="btn btn-primary">
            <i data-lucide="plus"></i> New Routine
          </button>
        </header>

        <div class="grid grid-cols-3 gap-6" style="margin-bottom: 32px">
          <div class="card">
            <div class="stat-label">Total Subjects</div>
            <div class="stat-value">${state.tasks.length}</div>
          </div>
          <div class="card">
            <div class="stat-label">Hours Studied</div>
            <div class="stat-value">12.5h</div>
          </div>
          <div class="card">
            <div class="stat-label">Mastery Level</div>
            <div class="stat-value" style="color: #10b981">Active</div>
          </div>
        </div>

        <div class="grid" style="grid-template-columns: 1.5fr 1fr; gap: 24px; min-height: 0;">
          <div class="flex flex-col gap-6">
            <div class="card" style="flex: 1">
              <div class="flex justify-between items-center" style="margin-bottom: 16px">
                <h3 style="font-size: 14px; font-weight: 600; color: var(--c-text-muted)">Active Subjects</h3>
                <span onclick="window.navigate('tasks')" style="font-size: 11px; color: var(--c-primary); cursor: pointer">Manage</span>
              </div>
              <div class="task-list">
                ${state.tasks.slice(0, 4).map(task => `
                  <div class="task-item">
                     <div class="flex items-center gap-4">
                      <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="window.toggleTask('${task.id}')" style="width: 18px; height: 18px; cursor: pointer">
                      <div style="${task.completed ? 'text-decoration: line-through; opacity: 0.6' : ''}">${task.title}</div>
                    </div>
                    <span class="tag">${task.category}</span>
                  </div>
                `).join('') || '<p style="color: var(--c-text-muted); font-size: 13px">No tasks found.</p>'}
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-6">
            <div class="ai-box" style="margin-bottom: 0">
              <h3 style="color: white; font-size: 14px; margin-bottom: 16px">AI Assistant</h3>
              <p style="font-size: 12px; opacity: 0.8; margin-bottom: 16px">You're on a roll! Completing 2 more tasks today will break your personal record.</p>
              <button onclick="window.navigate('tasks')" class="btn btn-primary" style="width: 100%; justify-content: center">
                Open Assistant
              </button>
            </div>
            
            <div class="card" style="flex: 1">
               <h3 style="font-size: 14px; font-weight: 600; color: var(--c-text-muted); margin-bottom: 16px">Study Intensity</h3>
               <div class="bar-chart" style="border: none; padding: 0; background: transparent">
                ${[40, 65, 85, 60, 95, 30, 20].map((val, i) => `
                  <div class="bar" style="height: ${val}%">
                    <span class="bar-label" style="bottom: -20px">${['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
`;

const TasksView = () => `
  <div class="flex flex-col animate-fade-in">
    ${Navbar()}
    <div class="dashboard-layout">
      ${Sidebar()}
      <main class="main-content">
        <div class="flex justify-between items-center" style="margin-bottom: 32px">
          <h1>Routine Maker</h1>
          <button onclick="window.showTaskModal()" class="btn btn-primary">
            <i data-lucide="plus"></i> Add Subject
          </button>
        </div>

        <div class="ai-box" style="margin-bottom: 32px">
          <h3 style="margin-bottom: 16px; font-size: 16px; color: white">AI Study Routine Generator</h3>
          <div class="flex flex-col gap-4">
            <div class="input-group">
              <label class="input-label" style="font-size: 12px">What is your learning goal? (Motive)</label>
              <input id="ai-goal" type="text" class="input-field" placeholder="e.g. Ace my Final Exams, Become a Data Scientist">
            </div>
            <div class="grid grid-cols-2 gap-4">
               <div class="input-group">
                <label class="input-label" style="font-size: 12px">Your subjects</label>
                <input id="ai-subjects" type="text" class="input-field" placeholder="e.g. Physics, Calculus, Python">
              </div>
              <div class="input-group">
                <label class="input-label" style="font-size: 12px">Available daily study time (Hours)</label>
                <input id="ai-time" type="number" class="input-field" placeholder="e.g. 4" min="1" max="16">
              </div>
            </div>
            <button onclick="window.generateSmartPlan()" class="btn btn-primary" style="width: 100%; justify-content: center">
              Generate My Routine
            </button>
          </div>
          <div id="ai-output" style="margin-top: 24px; display: none"></div>
        </div>

        <div class="task-list">
          <h3 style="font-size: 14px; margin-bottom: 16px; color: var(--c-text-muted)">Subject Management</h3>
          ${state.tasks.length === 0 ? `
            <div style="text-align: center; padding: 48px; color: var(--c-text-muted)">
              No subjects added. Add them to track your progress!
            </div>
          ` : state.tasks.map(task => `
            <div class="task-item">
              <div class="flex items-center gap-4">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="window.toggleTask('${task.id}')" style="width: 20px; height: 20px; cursor: pointer">
                <div>
                  <div style="${task.completed ? 'text-decoration: line-through; opacity: 0.6' : ''}">${task.title}</div>
                  <div style="font-size: 0.75rem; color: var(--c-text-muted)">${task.category} • ${task.dueDate || 'No exam date'}</div>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <span class="priority-badge priority-${task.priority}">${task.priority}</span>
                <button onclick="window.deleteTask('${task.id}')" style="color: var(--c-accent); padding: 4px">
                  <i data-lucide="trash-2"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </main>
    </div>
  </div>
`;

const AnalyticsView = () => `
  <div class="flex flex-col animate-fade-in">
    ${Navbar()}
    <div class="dashboard-layout">
      ${Sidebar()}
      <main class="main-content">
        <h1 style="margin-bottom: 32px">Analytics</h1>
        <div class="card" style="margin-bottom: 32px">
          <h3>Weekly Productivity</h3>
          <p style="color: var(--c-text-muted); margin-bottom: 32px">Tasks completed over the last 7 days</p>
          <div class="bar-chart">
            ${[4, 7, 5, 8, 3, 10, 6].map((val, i) => `
              <div class="bar" style="height: ${(val / 10) * 100}%">
                <span class="bar-label">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="grid grid-cols-2 gap-6">
          <div class="card">
            <h3>Focus Distribution</h3>
            <div style="margin-top: 20px">
              <div class="flex justify-between" style="margin-bottom: 8px">
                <span>Work</span>
                <span>65%</span>
              </div>
              <div style="height: 8px; background: var(--c-bg-subtle); border-radius: 4px; overflow: hidden">
                <div style="width: 65%; height: 100%; background: var(--c-primary)"></div>
              </div>
            </div>
          </div>
          <div class="card">
             <h3>Category Breakdown</h3>
             <div style="margin-top: 20px">
              <div class="flex justify-between" style="margin-bottom: 8px">
                <span>Personal</span>
                <span>20%</span>
              </div>
              <div style="height: 8px; background: var(--c-bg-subtle); border-radius: 4px; overflow: hidden">
                <div style="width: 20%; height: 100%; background: var(--c-accent)"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
`;

const SettingsView = () => `
  <div class="flex flex-col animate-fade-in">
    ${Navbar()}
    <div class="dashboard-layout">
      ${Sidebar()}
      <main class="main-content">
        <h1 style="margin-bottom: 32px">Settings</h1>
        <div class="card">
          <div class="flex justify-between items-center" style="padding-bottom: 20px; border-bottom: 1px solid var(--c-border)">
            <div>
              <div style="font-weight: 600">Dark Mode</div>
              <p style="font-size: 0.875rem; color: var(--c-text-muted)">Toggle between light and dark theme</p>
            </div>
            <button onclick="window.toggleTheme()" class="btn btn-outline">
              <i data-lucide="${state.theme === 'light' ? 'moon' : 'sun'}"></i> ${state.theme === 'light' ? 'Enable' : 'Disable'}
            </button>
          </div>
          <div style="padding: 20px 0; border-bottom: 1px solid var(--c-border)">
            <div style="font-weight: 600; margin-bottom: 12px">Profile Information</div>
            <div class="flex gap-2">
              <input id="new-username" type="text" class="input-field" placeholder="New username" value="${state.user?.name || ''}">
              <button onclick="window.updateUsername()" class="btn btn-primary" style="white-space: nowrap">Update Name</button>
            </div>
          </div>
          <div style="padding-top: 20px">
            <div style="font-weight: 600; margin-bottom: 12px">Account Data</div>
            <button onclick="window.resetData()" class="btn btn-outline" style="color: var(--c-accent); border-color: var(--c-accent); opacity: 0.7">
              Reset All Local Data
            </button>
          </div>
        </div>
      </main>
    </div>
  </div>
`;

// --- Global Handlers ---

(window as any).navigate = (view: string) => {
  setState({ view: view as any });
  window.scrollTo(0, 0);
};

(window as any).handleAuth = (e: Event) => {
  e.preventDefault();
  setState({ user: { name: 'Alex Miller' }, view: 'dashboard' });
  notify('Signed in successfully!');
};

(window as any).logout = () => {
  setState({ user: null, view: 'landing' });
  notify('Signed out.');
};

(window as any).toggleTheme = () => {
  setState({ theme: state.theme === 'light' ? 'dark' : 'light' });
};

(window as any).updateUsername = () => {
  const name = (document.getElementById('new-username') as HTMLInputElement).value;
  if (name) {
    setState({ user: { ...state.user!, name } });
    notify('Profile updated!');
  }
};

(window as any).toggleTask = (id: string) => {
  const tasks = state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  setState({ tasks });
};

(window as any).deleteTask = (id: string) => {
  const tasks = state.tasks.filter(t => t.id !== id);
  setState({ tasks });
  notify('Task deleted.');
};

(window as any).showTaskModal = () => {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content animate-fade-in">
      <h2 style="margin-bottom: 24px">Add Subject</h2>
      <form onsubmit="window.saveTask(event)">
        <div class="input-group">
          <label class="input-label">Subject Name</label>
          <input id="task-title" type="text" class="input-field" required placeholder="e.g. Advanced Calculus">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="input-group">
            <label class="input-label">Field</label>
            <select id="task-category" class="input-field">
              <option>Math</option>
              <option>Science</option>
              <option>History</option>
              <option>Languages</option>
              <option>Other</option>
            </select>
          </div>
          <div class="input-group">
            <label class="input-label">Target Exam Date</label>
            <input id="task-date" type="date" class="input-field" value="${new Date().toISOString().split('T')[0]}">
          </div>
        </div>
        <div class="input-group">
          <label class="input-label">Priority</label>
          <select id="task-priority" class="input-field">
            <option value="low">Low</option>
            <option value="medium" selected>Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div class="flex justify-end gap-2" style="margin-top: 24px">
          <button type="button" onclick="this.closest('.modal-overlay').remove()" class="btn btn-outline">Cancel</button>
          <button type="submit" class="btn btn-primary">Save Subject</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
};

(window as any).saveTask = (e: Event) => {
  e.preventDefault();
  const title = (document.getElementById('task-title') as HTMLInputElement).value;
  const category = (document.getElementById('task-category') as HTMLSelectElement).value as Category;
  const priority = (document.getElementById('task-priority') as HTMLSelectElement).value as Priority;
  const dueDate = (document.getElementById('task-date') as HTMLInputElement).value;
  
  const newTask: Task = {
    id: Math.random().toString(36).substr(2, 9),
    title,
    category,
    priority,
    completed: false,
    dueDate
  };
  
  setState({ tasks: [newTask, ...state.tasks] });
  document.querySelector('.modal-overlay')?.remove();
  notify('Task added!');
};

(window as any).generateSmartPlan = () => {
  const goal = (document.getElementById('ai-goal') as HTMLInputElement).value;
  const subjects = (document.getElementById('ai-subjects') as HTMLInputElement).value;
  const time = (document.getElementById('ai-time') as HTMLInputElement).value;
  
  if (!goal || !subjects || !time) {
    notify('Please fill in all layout fields.');
    return;
  }
  
  const output = document.getElementById('ai-output');
  if (output) {
    output.style.display = 'block';
    output.innerHTML = `<div style="opacity: 0.5; font-size: 13px">Analyzing focus areas for ${goal}...</div>`;
    
    setTimeout(() => {
      const subjectList = subjects.split(',').map(s => s.trim());
      const mainSubject = subjectList[0] || 'Core Subject';
      const secondSubject = subjectList[1] || 'Secondary Subject';
      
      output.innerHTML = `
        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px">
          <p style="font-size: 13px; font-weight: 600; margin-bottom: 12px; color: white">Routine: Optimized for ${goal}</p>
          <div class="ai-step" style="display: flex; gap: 8px; font-size: 12px; margin-bottom: 8px; color: var(--c-text-muted)">
            <span style="color: var(--c-primary); font-weight: bold">08:00</span>
            <span>Deep Work: ${mainSubject} - Problem Set Focus (90 mins)</span>
          </div>
          <div class="ai-step" style="display: flex; gap: 8px; font-size: 12px; margin-bottom: 8px; color: var(--c-text-muted)">
            <span style="color: var(--c-primary); font-weight: bold">09:30</span>
            <span>Active Recall: Flashcards & Summary (30 mins)</span>
          </div>
          <div class="ai-step" style="display: flex; gap: 8px; font-size: 12px; margin-bottom: 8px; color: var(--c-text-muted)">
            <span style="color: var(--c-primary); font-weight: bold">10:00</span>
            <span>Break & Hydro / Stretch (15 mins)</span>
          </div>
          <div class="ai-step" style="display: flex; gap: 8px; font-size: 12px; margin-bottom: 8px; color: var(--c-text-muted)">
            <span style="color: var(--c-primary); font-weight: bold">10:15</span>
            <span>Focused Session: ${secondSubject} - Concept Reading (60 mins)</span>
          </div>
          <div style="font-size: 11px; margin-top: 12px; color: var(--c-primary); font-style: italic">
            Configured for ${time}h Daily • Tips: Your goals suggest prioritize Spaced Repetition on ${mainSubject}.
          </div>
        </div>
      `;
    }, 1500);
  }
};

(window as any).resetData = () => {
  if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
    localStorage.clear();
    location.reload();
  }
};

function notify(msg: string) {
  const toast = document.createElement('div');
  toast.className = 'notification-toast';
  toast.innerHTML = `<i data-lucide="bell"></i> <span>${msg}</span>`;
  document.body.appendChild(toast);
  initIcons();
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// --- Main Render Loop ---
function render() {
  const app = document.getElementById('app');
  if (!app) return;

  let content = '';
  switch (state.view) {
    case 'landing': content = LandingView(); break;
    case 'auth': content = AuthView(); break;
    case 'dashboard': content = DashboardView(); break;
    case 'tasks': content = TasksView(); break;
    case 'analytics': content = AnalyticsView(); break;
    case 'settings': content = SettingsView(); break;
  }

  app.innerHTML = content;
  initIcons();
}

// Ensure theme is set immediately
document.documentElement.setAttribute('data-theme', state.theme);

// Initial Load
window.addEventListener('load', () => {
  render();
  setTimeout(() => {
    if (state.view === 'landing' && !localStorage.getItem('onboarded')) {
      showOnboarding();
    } else if (state.view === 'landing') {
      notify('Welcome back to SmartTask AI! 👋');
    }
  }, 1000);
});

function showOnboarding() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content animate-fade-in" style="text-align: center">
      <div style="font-size: 3rem; margin-bottom: 20px">📚</div>
      <h2 style="margin-bottom: 12px">Welcome to EduRoutine AI</h2>
      <p style="color: var(--c-text-muted); margin-bottom: 24px">Master your subjects with science-backed schedules. Let's create your first optimized study routine.</p>
      <button onclick="window.closeOnboarding(this)" class="btn btn-primary" style="width: 100%; justify-content: center">Start Learning</button>
    </div>
  `;
  document.body.appendChild(modal);
}

(window as any).closeOnboarding = (btn: HTMLElement) => {
  localStorage.setItem('onboarded', 'true');
  btn.closest('.modal-overlay')?.remove();
  notify("You're all set! Try generating a smart plan in the Tasks tab.");
};
