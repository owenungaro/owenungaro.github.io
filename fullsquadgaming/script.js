const loadBtn = document.getElementById('load');
const guildInput = document.getElementById('guild');
const usersContainer = document.getElementById('users');
const userCount = document.getElementById('userCount');
const selectionSummary = document.getElementById('selectionSummary');
const selectedCount = selectionSummary.querySelector('.selected-count');
const chooseRandomBtn = document.getElementById('chooseRandom');
const selectedSpan = document.getElementById('selectedUser');
const selectedUserDisplay = document.getElementById('selectedUserDisplay');
const selectedUserAvatar = document.getElementById('selectedUserAvatar');
const confirmBtn = document.getElementById('confirmBtn');
const serverStatus = document.getElementById('serverStatus');
const statusDot = serverStatus.querySelector('.status-dot');
const statusText = serverStatus.querySelector('.status-text');

// Navigation buttons
const backToUsers = document.getElementById('backToUsers');
const nextToRandom = document.getElementById('nextToRandom');
const backToPrompting = document.getElementById('backToPrompting');
const backToRandom = document.getElementById('backToRandom');
const nextToConfirmation = document.getElementById('nextToConfirmation');

// Selected user preview elements
const selectedUserPreview = document.getElementById('selectedUserPreview');
const selectedUserPreviewAvatar = document.getElementById('selectedUserPreviewAvatar');
const selectedUserPreviewName = document.getElementById('selectedUserPreviewName');

// Message inputs
const input1 = document.getElementById('input1');
const input2 = document.getElementById('input2');

// Success animation
const successOverlay = document.getElementById('successOverlay');

// History elements
const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
const historyModalClose = document.getElementById('historyModalClose');
const historyList = document.getElementById('historyList');

// Workflow stages
const stages = {
  stage1: document.getElementById('stage1'),
  stage2: document.getElementById('stage2'),
  stage3: document.getElementById('stage3'),
  stage4: document.getElementById('stage4')
};

// Progress indicators
const stepIndicators = {
  step1: document.getElementById('step1-indicator'),
  step2: document.getElementById('step2-indicator'),
  step3: document.getElementById('step3-indicator'),
  step4: document.getElementById('step4-indicator')
};

let selectedUserId = null;
let currentStage = 1;
let loadedUsers = [];
let executionHistory = [];

// Helper functions
function updateProgressStep(step, status) {
  const indicator = stepIndicators[`step${step}`];
  if (indicator) {
    indicator.className = `step ${status}`;
  }
}

function showStage(stageNumber) {
  // Hide all stages
  Object.values(stages).forEach(stage => {
    stage.classList.remove('active');
  });
  
  // Show current stage
  const currentStageElement = stages[`stage${stageNumber}`];
  if (currentStageElement) {
    currentStageElement.classList.add('active');
  }
  
  currentStage = stageNumber;
}

function goToStage(stageNumber) {
  showStage(stageNumber);
  
  // Update progress indicators
  for (let i = 1; i <= 4; i++) {
    if (i < stageNumber) {
      updateProgressStep(i, 'completed');
    } else if (i === stageNumber) {
      updateProgressStep(i, 'active');
    } else {
      updateProgressStep(i, '');
    }
  }
  
  // Update continue button visibility when on stage 1
  if (stageNumber === 1) {
    updateContinueButtonVisibility();
  }
  
  // Update message validation when on stage 2
  if (stageNumber === 2) {
    updateMessageValidation();
  }
  
  // Reset selected user preview when leaving stage 3
  if (stageNumber !== 3) {
    if (selectedUserPreview) {
      selectedUserPreview.classList.add('hidden');
    }
    if (nextToConfirmation) {
      nextToConfirmation.classList.add('hidden');
    }
  } else {
    // When entering stage 3, show preview if user is already selected
    if (selectedUserId && selectedUserPreview) {
      selectedUserPreview.classList.remove('hidden');
      nextToConfirmation.classList.remove('hidden');
    }
  }
}

function updateUserCount(count) {
  userCount.textContent = `${count} users loaded`;
}

function updateSelectionCount(count) {
  selectedCount.textContent = count;
}

function updateContinueButtonVisibility() {
  const selected = document.querySelectorAll('.user-entry.selected');
  const continueContainer = document.getElementById('continueToPromptingContainer');
  
  if (!continueContainer) return;
  
  if (selected.length >= 3) {
    continueContainer.classList.remove('hidden');
  } else {
    continueContainer.classList.add('hidden');
  }
}

// Validation function to check if both messages are filled
function validateMessages() {
  const messageA = input1.value.trim();
  const messageB = input2.value.trim();
  return messageA.length > 0 && messageB.length > 0;
}

// Update navigation button states based on message validation
function updateMessageValidation() {
  const isValid = validateMessages();
  nextToRandom.disabled = !isValid;
  
  // Add visual feedback
  if (isValid) {
    input1.classList.remove('input-error');
    input2.classList.remove('input-error');
  } else {
    // Only show error if user has interacted with the fields
    if (input1.value.trim().length === 0 && input1.dataset.touched === 'true') {
      input1.classList.add('input-error');
    }
    if (input2.value.trim().length === 0 && input2.dataset.touched === 'true') {
      input2.classList.add('input-error');
    }
  }
}

function updateServerStatus(connected) {
  if (connected) {
    statusDot.style.backgroundColor = '#43b581';
    statusText.textContent = 'Connected';
  } else {
    statusDot.style.backgroundColor = '#f04747';
    statusText.textContent = 'Disconnected';
  }
}

function showSuccessAnimation() {
  successOverlay.classList.add('show');
  
  // Hide animation after 3 seconds and reset
  setTimeout(() => {
    successOverlay.classList.remove('show');
    resetForm();
  }, 3000);
}

function resetForm() {
  // Clear user selections
  const selectedUsers = document.querySelectorAll('.user-entry.selected');
  selectedUsers.forEach(user => user.classList.remove('selected'));
  
  // Clear form inputs
  input1.value = '';
  input2.value = '';
  
  // Reset touched state and error styling
  input1.dataset.touched = '';
  input2.dataset.touched = '';
  input1.classList.remove('input-error');
  input2.classList.remove('input-error');
  
  // Reset selected user
  selectedUserId = null;
  selectedSpan.textContent = 'No user selected';
  selectedUserAvatar.style.backgroundImage = '';
  
  // Reset preview display
  if (selectedUserPreview) {
    selectedUserPreview.classList.add('hidden');
    selectedUserPreviewName.textContent = 'No user selected';
    selectedUserPreviewAvatar.style.backgroundImage = '';
  }
  if (nextToConfirmation) {
    nextToConfirmation.classList.add('hidden');
  }
  
  // Reset buttons
  chooseRandomBtn.disabled = true;
  confirmBtn.disabled = true;
  
  // Update counts
  updateSelectionCount(0);
  
  // Go back to prompting stage
  goToStage(2);
}

// History management functions
function loadHistory() {
  const saved = localStorage.getItem('fullsquad-execution-history');
  if (saved) {
    executionHistory = JSON.parse(saved);
  }
  renderHistory();
}

function saveHistory() {
  localStorage.setItem('fullsquad-execution-history', JSON.stringify(executionHistory));
}

function addToHistory(executionData) {
  const historyEntry = {
    id: Date.now(),
    timestamp: new Date().toLocaleString(),
    guildId: executionData.guild_id,
    userIds: executionData.user_ids,
    selectedUser: executionData.selected_user,
    promptA: executionData.promptA,
    promptB: executionData.promptB,
    userNames: getUserNamesFromIds(executionData.user_ids),
    selectedUserName: getUserNameFromId(executionData.selected_user)
  };
  
  executionHistory.unshift(historyEntry); // Add to beginning
  if (executionHistory.length > 20) { // Keep only last 20 executions
    executionHistory = executionHistory.slice(0, 20);
  }
  
  saveHistory();
  renderHistory();
}

function getUserNamesFromIds(userIds) {
  return userIds.map(id => {
    const user = loadedUsers.find(u => u.id === id);
    return user ? user.name : `Unknown User (${id})`;
  });
}

function getUserNameFromId(userId) {
  const user = loadedUsers.find(u => u.id === userId);
  return user ? user.name : `Unknown User (${userId})`;
}

function renderHistory() {
  if (executionHistory.length === 0) {
    historyList.innerHTML = '<div class="history-empty"><p>No executions yet</p></div>';
    return;
  }
  
  historyList.innerHTML = executionHistory.map(entry => `
    <div class="history-item">
      <div class="history-item-header">
        <span class="history-item-time">${entry.timestamp}</span>
        <button class="history-item-redo" onclick="redoExecution(${entry.id})">Redo</button>
      </div>
      <div class="history-item-details">
        <div class="history-detail-row">
          <span class="history-detail-label">Server:</span>
          <span class="history-detail-value">${entry.guildId}</span>
        </div>
        <div class="history-detail-row">
          <span class="history-detail-label">Selected:</span>
          <span class="history-detail-value">${entry.selectedUserName}</span>
        </div>
        <div class="history-detail-row">
          <span class="history-detail-label">Message A:</span>
          <span class="history-detail-value">${entry.promptA || 'None'}</span>
        </div>
        <div class="history-detail-row">
          <span class="history-detail-label">Message B:</span>
          <span class="history-detail-value">${entry.promptB || 'None'}</span>
        </div>
        <div class="history-detail-row">
          <span class="history-detail-label">Users:</span>
          <div class="history-user-list">
            ${entry.userNames.map(name => `<span class="history-user-tag">${name}</span>`).join('')}
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

async function redoExecution(entryId) {
  const entry = executionHistory.find(e => e.id === entryId);
  if (!entry) return;
  
  // Set the guild ID
  guildInput.value = entry.guildId;
  
  try {
    // Load users first
    await loadUsers();
    
    // Wait a bit for the UI to update
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Select the users
    const userEntries = document.querySelectorAll('.user-entry');
    userEntries.forEach(userEntry => {
      if (entry.userIds.includes(userEntry.dataset.id)) {
        userEntry.classList.add('selected');
      }
    });
    
    // Set the messages
    document.getElementById('input1').value = entry.promptA || '';
    document.getElementById('input2').value = entry.promptB || '';
    
    // Update selection count
    updateSelectionCount(entry.userIds.length);
    
    // Update continue button visibility (though it won't matter since we auto-send)
    const continueContainer = document.getElementById('continueToPromptingContainer');
    if (continueContainer && entry.userIds.length >= 3) {
      continueContainer.style.display = 'flex';
    }
    
    // Set the selected user (from history)
    selectedUserId = entry.selectedUser;
    
    // Create payload with the exact same data
    const payload = {
      guild_id: entry.guildId,
      user_ids: entry.userIds,
      selected_user: entry.selectedUser,
      promptA: entry.promptA,
      promptB: entry.promptB
    };
    
    // Automatically send the message
    await sendMessages(payload);
    
  } catch (error) {
    console.error('Failed to redo execution:', error);
    alert('Failed to redo execution: ' + error.message);
  }
}

// Extract the load users logic into a separate function
async function loadUsers() {
  const guildId = guildInput.value.trim();

  if (!guildId) {
    throw new Error('Please enter a guild ID');
  }

  updateServerStatus(false);
  loadBtn.disabled = true;
  loadBtn.innerHTML = '<span class="btn-icon">⏳</span>Loading...';

  try {
    const response = await fetch(`https://fullsquad-bot.fly.dev/api/users/${guildId}`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const users = await response.json();
    loadedUsers = users;
    usersContainer.innerHTML = '';
    selectedUserId = null;

    // Update user count
    updateUserCount(users.length);

    // Render Discord-style user entries
    for (let u of users) {
      const div = document.createElement('div');
      div.className = 'user-entry';
      div.dataset.id = u.id;

      const avatar = document.createElement('div');
      avatar.className = 'avatar';
      avatar.style.backgroundImage = `url(${u.avatar_url})`;
      avatar.style.backgroundSize = 'cover';
      avatar.style.backgroundPosition = 'center';

      const name = document.createElement('span');
      name.className = 'username';
      name.textContent = u.name;

      div.appendChild(avatar);
      div.appendChild(name);
      usersContainer.appendChild(div);

      div.onclick = function () {
        div.classList.toggle('selected');
        const selected = document.querySelectorAll('.user-entry.selected');
        updateSelectionCount(selected.length);
        updateContinueButtonVisibility();
        
        // Always keep chooseRandomBtn state based on selection
        chooseRandomBtn.disabled = selected.length < 3;
        confirmBtn.disabled = true;
      };
    }

    updateServerStatus(true);
    goToStage(1);
    
    // Update continue button visibility
    updateContinueButtonVisibility();

  } catch (err) {
    console.log('Error loading users: ' + err.message);
    updateServerStatus(false);
    throw err;
  } finally {
    loadBtn.disabled = false;
    loadBtn.innerHTML = '<span class="btn-icon">👥</span>Load Users';
  }
}

function openHistoryModal() {
  historyModal.classList.add('show');
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden';
}

function closeHistoryModal() {
  historyModal.classList.remove('show');
  // Restore body scroll
  document.body.style.overflow = '';
}

// Initialize the app
function init() {
  showStage(1);
  updateProgressStep(1, 'active');
  updateServerStatus(false);
}

// 1: Load users
loadBtn.onclick = async function () {
  try {
    await loadUsers();
  } catch (err) {
    alert('Failed to load users: ' + err.message);
  }
};

// Search functionality
const userSearchInput = document.getElementById('userSearch');

userSearchInput.addEventListener('input', () => {
  const query = userSearchInput.value.toLowerCase();
  const allUsers = usersContainer.querySelectorAll('.user-entry');

  allUsers.forEach(user => {
    const name = user.querySelector('.username').textContent.toLowerCase();
    user.style.display = name.includes(query) ? '' : 'none';
  });
});

// 2: Choose a random user
chooseRandomBtn.onclick = function () {
  const options = Array.from(document.querySelectorAll('.user-entry.selected'));
  if(options.length === 0) {
    console.log("No users selected");
    return;
  }

  const randomIndex = Math.floor(Math.random() * options.length);
  const chosen = options[randomIndex];

  selectedUserId = chosen.dataset.id;
  const chosenName = chosen.querySelector('.username').textContent;
  
  // Update preview display on stage 3
  selectedUserPreviewName.textContent = chosenName;
  const chosenAvatar = chosen.querySelector('.avatar');
  selectedUserPreviewAvatar.style.backgroundImage = chosenAvatar.style.backgroundImage;
  selectedUserPreviewAvatar.style.backgroundSize = 'cover';
  selectedUserPreviewAvatar.style.backgroundPosition = 'center';
  
  // Show preview and next button
  selectedUserPreview.classList.remove('hidden');
  nextToConfirmation.classList.remove('hidden');
  
  // Also update the final result display for when we go to stage 4
  selectedSpan.textContent = chosenName;
  selectedUserAvatar.style.backgroundImage = chosenAvatar.style.backgroundImage;
  selectedUserAvatar.style.backgroundSize = 'cover';
  selectedUserAvatar.style.backgroundPosition = 'center';
  
  // Enable confirm button for when we reach stage 4
  confirmBtn.disabled = false;
};

// Extract send message logic into reusable function
async function sendMessages(payload, buttonElement = null) {
  try {
    if (buttonElement) {
      buttonElement.disabled = true;
      const originalHTML = buttonElement.innerHTML;
      buttonElement.innerHTML = '<span class="btn-icon">⏳</span>Sending...';

      const response = await fetch('https://fullsquad-bot.fly.dev/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || response.statusText);
      }

      // Add to history
      addToHistory(payload);
      
      // Show success animation instead of alert
      showSuccessAnimation();
      updateProgressStep(4, 'completed');
      
      buttonElement.disabled = false;
      buttonElement.innerHTML = originalHTML;
    } else {
      // For redo, no button to update
      const response = await fetch('https://fullsquad-bot.fly.dev/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || response.statusText);
      }

      // Add to history
      addToHistory(payload);
      
      // Show success animation
      showSuccessAnimation();
      updateProgressStep(4, 'completed');
    }
  } catch (err) {
    if (buttonElement) {
      buttonElement.disabled = false;
      buttonElement.innerHTML = '<span class="btn-icon">🚀</span>Send Messages';
    }
    alert('Failed to send messages: ' + err.message);
    throw err;
  }
}

// 3: Send prompts
confirmBtn.onclick = async function () {
  if (!selectedUserId) {
    alert('No user chosen!');
    return;
  }

  // Validate messages before submitting
  if (!validateMessages()) {
    alert('Please fill in both Message A and Message B before submitting.');
    // Go back to prompting stage to show the inputs
    goToStage(2);
    return;
  }

  const promptA = input1.value.trim();
  const promptB = input2.value.trim();
  const userIds = Array.from(document.querySelectorAll('.user-entry.selected'))
    .map(el => el.dataset.id);

  const payload = {
    guild_id: guildInput.value.trim(),
    user_ids: userIds,
    selected_user: selectedUserId,
    promptA: promptA,
    promptB: promptB
  };

  await sendMessages(payload, confirmBtn);
};

// Navigation button event listeners
const continueToPrompting = document.getElementById('continueToPrompting');

continueToPrompting.onclick = function() {
  goToStage(2);
};

backToUsers.onclick = function() {
  goToStage(1);
};

nextToRandom.onclick = function() {
  if (!validateMessages()) {
    // Mark inputs as touched to show errors
    input1.dataset.touched = 'true';
    input2.dataset.touched = 'true';
    updateMessageValidation();
    
    // Show alert
    alert('Please fill in both Message A and Message B before proceeding.');
    return;
  }
  goToStage(3);
};

backToPrompting.onclick = function() {
  goToStage(2);
};

backToRandom.onclick = function() {
  goToStage(3);
};

nextToConfirmation.onclick = function() {
  if (!selectedUserId) {
    alert('Please select a random user first.');
    return;
  }
  goToStage(4);
};

// History modal event listeners
historyBtn.onclick = openHistoryModal;
historyModalClose.onclick = closeHistoryModal;

// Close modal when clicking on overlay
historyModal.querySelector('.history-modal-overlay').onclick = closeHistoryModal;

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && historyModal.classList.contains('show')) {
    closeHistoryModal();
  }
});

// Add event listeners for real-time message validation
input1.addEventListener('input', function() {
  this.dataset.touched = 'true';
  updateMessageValidation();
});

input2.addEventListener('input', function() {
  this.dataset.touched = 'true';
  updateMessageValidation();
});

// Initialize the application
function init() {
  showStage(1);
  updateProgressStep(1, 'active');
  updateServerStatus(false);
  loadHistory();
  
  // Initialize message validation (disable next button initially)
  nextToRandom.disabled = true;
}

// Initialize the application
init();