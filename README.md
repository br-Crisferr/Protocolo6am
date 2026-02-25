```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="theme-color" content="#0a0a0a">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <title>PROTOCOLO 6AM</title>
    <style>
        :root {
            --bg: #000000;
            --bg-card: #0a0a0a;
            --border: #1a1a1a;
            --text: #ffffff;
            --accent: #ff3b30;
            --success: #30d158;
            --gold: #ffd60a;
            --blue: #0a84ff;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: var(--bg); color: var(--text); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .container { max-width: 100%; padding: 20px; padding-bottom: 120px; }
        .header { background: var(--bg-card); padding: 20px; border-radius: 12px; margin-bottom: 20px; border: 1px solid var(--border); }
        .title { font-size: 28px; font-weight: 900; background: linear-gradient(135deg, var(--accent), var(--gold)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 12px; }
        .stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-top: 12px; }
        .stat { background: var(--bg-card); padding: 12px; border-radius: 8px; text-align: center; border: 1px solid var(--border); }
        .stat-value { font-size: 20px; font-weight: 700; color: var(--gold); }
        .stat-label { font-size: 10px; color: #888; margin-top: 4px; }
        .notification { position: fixed; top: 20px; left: 20px; right: 20px; background: var(--bg-card); border: 1px solid var(--border); padding: 12px; border-radius: 8px; z-index: 1000; display: none; }
        .notification.show { display: block; animation: slideDown 0.3s ease; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .notification.success { border-color: var(--success); color: var(--success); }
        .task-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin-bottom: 12px; }
        .task-card.active { border-color: var(--success); box-shadow: 0 0 15px rgba(48, 209, 88, 0.2); }
        .task-title { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
        .task-time { font-size: 12px; color: #888; margin-bottom: 12px; }
        .task-xp { display: inline-block; background: rgba(255, 214, 10, 0.2); color: var(--gold); padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; margin-bottom: 12px; }
        .task-progress { background: #141414; height: 6px; border-radius: 3px; margin: 12px 0; overflow: hidden; }
        .task-progress-bar { height: 100%; background: linear-gradient(90deg, var(--blue), var(--success)); width: 0%; transition: width 0.3s; }
        .btn { width: 100%; padding: 12px; border: none; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.3s; margin-top: 8px; }
        .btn-success { background: var(--success); color: #000; }
        .btn-primary { background: var(--blue); color: #fff; }
        .btn-secondary { background: #141414; color: var(--text); border: 1px solid var(--border); }
        .btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; background: rgba(10, 10, 10, 0.98); border-top: 1px solid var(--border); display: grid; grid-template-columns: repeat(4, 1fr); padding: 12px 0 20px; }
        .nav-item { display: flex; flex-direction: column; align-items: center; gap: 6px; border: none; background: none; color: #888; font-size: 10px; cursor: pointer; text-transform: uppercase; font-weight: 600; }
        .nav-item.active { color: var(--blue); }
        .nav-icon { font-size: 20px; }
        .section { display: none; }
        .section.active { display: block; }
        .modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.9); display: none; align-items: center; justify-content: center; z-index: 2000; padding: 20px; }
        .modal.active { display: flex; }
        .modal-content { background: var(--bg-card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; width: 100%; max-width: 400px; max-height: 80vh; overflow-y: auto; }
        .modal-header { font-size: 18px; font-weight: 700; margin-bottom: 16px; }
        .form-input { width: 100%; padding: 12px; background: #141414; border: 1px solid var(--border); border-radius: 8px; color: var(--text); margin-bottom: 12px; }
        .empty-state { text-align: center; padding: 40px 20px; color: #888; }
    </style>
</head>
<body>
    <div class="notification" id="notification"></div>

    <div class="container">
        <div class="header">
            <div class="title">6AM</div>
            <div class="stats">
                <div class="stat">
                    <div class="stat-value" id="xpDisplay">0</div>
                    <div class="stat-label">XP</div>
                </div>
                <div class="stat">
                    <div class="stat-value" id="levelDisplay">1</div>
                    <div class="stat-label">Nível</div>
                </div>
                <div class="stat">
                    <div class="stat-value" id="streakDisplay">0</div>
                    <div class="stat-label">Streak</div>
                </div>
            </div>
        </div>

        <!-- SEÇÃO TAREFAS -->
        <div class="section active" id="sectionTarefas">
            <div id="tasksContainer"></div>
        </div>

        <!-- SEÇÃO PERFIL -->
        <div class="section" id="sectionPerfil">
            <div id="profileContainer"></div>
        </div>

        <!-- SEÇÃO CONFIG -->
        <div class="section" id="sectionConfig">
            <div id="configContainer"></div>
        </div>
    </div>

    <!-- NAVEGAÇÃO -->
    <nav class="bottom-nav">
        <button class="nav-item active" onclick="showTab('tarefas')">
            <span class="nav-icon">⚡</span>
            <span>Tarefas</span>
        </button>
        <button class="nav-item" onclick="showTab('perfil')">
            <span class="nav-icon">👤</span>
            <span>Perfil</span>
        </button>
        <button class="nav-item" onclick="showTab('config')">
            <span class="nav-icon">⚙️</span>
            <span>Config</span>
        </button>
        <button class="nav-item">
            <span class="nav-icon">ℹ️</span>
            <span>Info</span>
        </button>
    </nav>

    <!-- MODAL CONFIG -->
    <div class="modal" id="configModal">
        <div class="modal-content">
            <div class="modal-header">⚙️ Configurações</div>
            <input type="text" class="form-input" id="nameInput" placeholder="Seu nome" maxlength="20">
            <input type="time" class="form-input" id="wakeTimeInput">
            <button class="btn btn-success" onclick="saveConfig()">💾 Salvar</button>
            <button class="btn btn-secondary" onclick="closeConfig()">✕ Fechar</button>
        </div>
    </div>

    <script>
        // DADOS
        let data = JSON.parse(localStorage.getItem('protocolo6am')) || {
            name: 'Operador',
            xp: 0,
            level: 1,
            streak: 0,
            wakeTime: '06:00',
            completedToday: {},
            history: [],
            lastDate: new Date().toDateString()
        };

        const TASKS = {
            wake: { name: '🌅 Acordar', time: '06:00', window: 60, xp: 20 },
            workout: { name: '💪 Treino', time: '07:00', window: 120, xp: 40 },
            focus: { name: '🎯 Foco', time: '09:00', window: 180, xp: 60 },
            read: { name: '📚 Leitura', time: '20:00', window: 120, xp: 30 },
            meditate: { name: '🧘 Meditação', time: '21:30', window: 60, xp: 20 }
        };

        function saveData() {
            localStorage.setItem('protocolo6am', JSON.stringify(data));
        }

        function showNotif(msg, type = 'success') {
            const notif = document.getElementById('notification');
            notif.textContent = msg;
            notif.className = `notification ${type} show`;
            setTimeout(() => notif.classList.remove('show'), 3000);
        }

        function updateStats() {
            document.getElementById('xpDisplay').textContent = data.xp;
            document.getElementById('levelDisplay').textContent = data.level;
            document.getElementById('streakDisplay').textContent = data.streak;
        }

        function completeTask(taskId) {
            if (data.completedToday[taskId]) {
                showNotif('Já foi completa hoje!', 'success');
                return;
            }

            const task = TASKS[taskId];
            data.xp += task.xp;
            data.level = Math.floor(data.xp / 100) + 1;
            if (taskId === 'wake') data.streak++;
            
            data.completedToday[taskId] = true;
            saveData();
            updateStats();
            renderTasks();
            showNotif(`✅ +${task.xp} XP`, 'success');
        }

        function renderTasks() {
            const container = document.getElementById('tasksContainer');
            container.innerHTML = Object.entries(TASKS).map(([id, task]) => {
                const isCompleted = data.completedToday[id];
                return `
                    <div class="task-card ${isCompleted ? 'active' : ''}">
                        <div class="task-title">${task.name}</div>
                        <div class="task-time">${task.time} (±${task.window}min)</div>
                        <div class="task-xp">+${task.xp} XP</div>
                        <button class="btn btn-success" ${isCompleted ? 'disabled' : ''} onclick="completeTask('${id}')">
                            ${isCompleted ? '✓ Completo' : '✓ Marcar'}
                        </button>
                    </div>
                `;
            }).join('');
        }

        function renderProfile() {
            const container = document.getElementById('profileContainer');
            container.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 60px; margin-bottom: 12px;">${data.name.charAt(0).toUpperCase()}</div>
                    <div style="font-size: 24px; font-weight: 700; margin-bottom: 4px;">${data.name}</div>
                    <div style="color: var(--gold); font-size: 14px; margin-bottom: 24px;">Nível ${data.level}</div>
                    
                    <div style="background: var(--bg-card); padding: 16px; border-radius: 12px; margin-bottom: 12px; border: 1px solid var(--border);">
                        <div style="color: var(--gold); font-size: 20px; font-weight: 700;">${data.xp}</div>
                        <div style="font-size: 12px; color: #888;">XP Total</div>
                    </div>
                    
                    <div style="background: var(--bg-card); padding: 16px; border-radius: 12px; border: 1px solid var(--border);">
                        <div style="color: var(--success); font-size: 20px; font-weight: 700;">${data.streak}</div>
                        <div style="font-size: 12px; color: #888;">Dias em Sequência</div>
                    </div>
                </div>
            `;
        }

        function renderConfig() {
            const container = document.getElementById('configContainer');
            container.innerHTML = `
                <div style="background: var(--bg-card); padding: 16px; border-radius: 12px; border: 1px solid var(--border);">
                    <button class="btn btn-primary" onclick="openConfig()">⚙️ Editar Config</button>
                    <button class="btn btn-secondary" onclick="exportData()" style="margin-top: 8px;">📥 Exportar Dados</button>
                </div>
            `;
        }

        function openConfig() {
            document.getElementById('nameInput').value = data.name;
            document.getElementById('wakeTimeInput').value = data.wakeTime;
            document.getElementById('configModal').classList.add('active');
        }

        function closeConfig() {
            document.getElementById('configModal').classList.remove('active');
        }

        function saveConfig() {
            data.name = document.getElementById('nameInput').value || 'Operador';
            data.wakeTime = document.getElementById('wakeTimeInput').value;
            saveData();
            closeConfig();
            updateStats();
            showNotif('✅ Configurações salvas!', 'success');
        }

        function exportData() {
            const json = JSON.stringify(data, null, 2);
            alert('Seus dados:\n\n' + json);
        }

        function showTab(tab) {
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            
            document.getElementById(`section${tab.charAt(0).toUpperCase() + tab.slice(1)}`).classList.add('active');
            event.target.closest('.nav-item').classList.add('active');

            if (tab === 'tarefas') renderTasks();
            else if (tab === 'perfil') renderProfile();
            else if (tab === 'config') renderConfig();
        }

        updateStats();
        renderTasks();

        document.getElementById('configModal').addEventListener('click', (e) => {
            if (e.target.id === 'configModal') closeConfig();
        });
    </script>
</body>
</html>
```