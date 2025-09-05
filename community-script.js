// Global variables
let currentDiscussionId = null;
let nextResponseId = 100; // Start with a high number to avoid conflicts

// Utility Functions
function timeAgo(date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
}

function updateTimeDisplay() {
  document.querySelectorAll('.discussion-item').forEach(discussionElement => {
    const timeSpan = discussionElement.querySelector('.discussion-meta span:nth-child(2)');
    if (timeSpan && timeSpan.dataset.timestamp) {
      const timestamp = parseInt(timeSpan.dataset.timestamp);
      const date = new Date(timestamp);
      timeSpan.textContent = `📅 ${timeAgo(date)}`;
    }
  });
}

function initializeTimestamps() {
  // Add timestamps to existing discussions that don't have them
  document.querySelectorAll('.discussion-item').forEach((discussionElement, index) => {
    const timeSpan = discussionElement.querySelector('.discussion-meta span:nth-child(2)');
    if (timeSpan && !timeSpan.dataset.timestamp) {
      // Create realistic timestamps for existing discussions
      const hoursAgo = [2, 5, 24][index] || 1; // 2 hours, 5 hours, 1 day ago
      const timestamp = Date.now() - (hoursAgo * 60 * 60 * 1000);
      timeSpan.dataset.timestamp = timestamp;
      
      // Update the display immediately
      const date = new Date(timestamp);
      timeSpan.textContent = `📅 ${timeAgo(date)}`;
    }
  });
}

// Update time displays every minute
setInterval(updateTimeDisplay, 60000);

function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  const messageSpan = document.getElementById('notification-message');
  
  messageSpan.textContent = message;
  notification.className = `notification ${type}`;
  notification.classList.remove('hidden');
  
  setTimeout(() => {
    notification.classList.add('hidden');
  }, 3000);
}

// SPA Navigation
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Remove active class from all tabs
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show selected section
  document.getElementById(sectionId).classList.add('active');
  
  // Add active class to corresponding tab
  const tabs = document.querySelectorAll('.nav-tab');
  if (sectionId === 'discussion' || sectionId === 'discussion-detail') {
    tabs[0].classList.add('active'); // "Discussions" tab
  } else if (sectionId === 'create') {
    tabs[1].classList.add('active'); // "Create Discussion" tab
  }
}

// Extract discussion data from HTML
function getDiscussionDataFromHTML(discussionElement) {
  const title = discussionElement.querySelector('.discussion-title h3').textContent;
  const author = discussionElement.querySelector('.discussion-meta span:first-child').textContent.replace('👤 ', '');
  const timeText = discussionElement.querySelector('.discussion-meta span:nth-child(2)').textContent.replace('📅 ', '');
  const category = discussionElement.querySelector('.discussion-category').textContent;
  const preview = discussionElement.querySelector('.discussion-preview').textContent;
  
  // Extract responses
  const responses = [];
  const responseElements = discussionElement.querySelectorAll('.expanded-content .response');
  responseElements.forEach(response => {
    const responseAuthor = response.querySelector('.response-author').textContent;
    const responseTime = response.querySelector('.response-time').textContent;
    const responseContent = response.querySelector('p').textContent;
    responses.push({
      author: responseAuthor,
      time: responseTime,
      content: responseContent
    });
  });
  
  return {
    title,
    author,
    timeText,
    category,
    content: preview,
    responses
  };
}

// Discussion Management
function openDiscussion(discussionId) {
  currentDiscussionId = discussionId;
  const discussionElement = document.querySelector(`.discussion-item[data-id="${discussionId}"]`);
  
  if (!discussionElement) {
    const allDiscussions = document.querySelectorAll('.discussion-item');
    const discussionIndex = discussionId - 1;
    if (discussionIndex >= 0 && discussionIndex < allDiscussions.length) {
      discussionElement = allDiscussions[discussionIndex];
    }
  }
  
  if (!discussionElement) return;
  
  const discussionData = getDiscussionDataFromHTML(discussionElement);
  
  // Update discussion detail view
  document.getElementById('detail-title').textContent = discussionData.title;
  document.getElementById('detail-author').textContent = `👤 ${discussionData.author}`;
  document.getElementById('detail-time').textContent = `📅 ${discussionData.timeText}`;
  document.getElementById('detail-category').textContent = discussionData.category;
  
  const fullContent = discussionData.content + " " + getExpandedContentFromHTML(discussionElement);
  document.getElementById('detail-content').textContent = fullContent;
  
  // Update like button
  const originalLikeBtn = discussionElement.querySelector('.like-btn');
  const likeText = originalLikeBtn.textContent.trim();
  const detailLikeBtn = document.getElementById('detail-like-btn');
  detailLikeBtn.innerHTML = likeText;
  detailLikeBtn.className = originalLikeBtn.className;
  
  // Render responses
  renderResponses(discussionData.responses);
  
  // Show discussion detail section
  showSection('discussion-detail');
}

function getExpandedContentFromHTML(discussionElement) {
  const preview = discussionElement.querySelector('.discussion-preview').textContent;
  return preview;
}

function renderResponses(responses) {
  const responsesList = document.getElementById('responses-list');
  
  if (responses.length === 0) {
    responsesList.innerHTML = '<p style="color: #666; text-align: center; padding: 2rem;">No responses yet. Be the first to respond!</p>';
    return;
  }
  
  responsesList.innerHTML = responses.map(response => `
    <div class="response">
      <div class="response-header">
        <span class="response-author">${response.author}</span>
        <span class="response-time">${response.time}</span>
      </div>
      <p>${response.content}</p>
    </div>
  `).join('');
}

// Like Functionality
function toggleLike(discussionId) {
  const discussionElement = document.querySelector(`.discussion-item[data-id="${discussionId}"]`);
  
  if (!discussionElement) {
    const allDiscussions = document.querySelectorAll('.discussion-item');
    const discussionIndex = discussionId - 1;
    if (discussionIndex >= 0 && discussionIndex < allDiscussions.length) {
      discussionElement = allDiscussions[discussionIndex];
    }
  }
  
  if (!discussionElement) return;
  
  const likeBtn = discussionElement.querySelector('.like-btn');
  const currentText = likeBtn.textContent.trim();
  const likeCount = parseInt(currentText.split(' ')[1]) || 0;
  const isLiked = currentText.includes('❤️');
  
  if (isLiked) {
    likeBtn.innerHTML = `🤍 ${Math.max(0, likeCount - 1)}`;
    likeBtn.classList.remove('liked');
    showNotification('Like removed');
  } else {
    likeBtn.innerHTML = `❤️ ${likeCount + 1}`;
    likeBtn.classList.add('liked');
    showNotification('Discussion liked!');
  }
}

// Toggle expansion for preview
function toggleExpansion(discussionItem) {
  const expandedContent = discussionItem.querySelector('.expanded-content');
  const expandBtn = discussionItem.querySelector('.expand-btn');
  const responses = discussionItem.querySelectorAll('.expanded-content .response');
  const responseCount = responses.length;
  
  if (expandedContent.classList.contains('show')) {
    expandedContent.classList.remove('show');
    expandBtn.textContent = `View Responses (${responseCount})`;
  } else {
    expandedContent.classList.add('show');
    expandBtn.textContent = 'Hide Responses';
  }
}

// Response Management
function addResponse() {
  if (!currentDiscussionId) return;
  
  const textarea = document.getElementById('reply-textarea');
  const content = textarea.value.trim();
  
  if (!content) {
    showNotification('Please write a response before submitting', 'error');
    return;
  }
  
  // Add to detail view
  const responsesList = document.getElementById('responses-list');
  const newResponseHTML = `
    <div class="response">
      <div class="response-header">
        <span class="response-author">Current User</span>
        <span class="response-time">Just now</span>
      </div>
      <p>${content}</p>
    </div>
  `;
  
  if (responsesList.innerHTML.includes('No responses yet')) {
    responsesList.innerHTML = newResponseHTML;
  } else {
    responsesList.innerHTML += newResponseHTML;
  }
  
  // Also add to the original discussion item in the list
  const discussionElement = document.querySelector(`.discussion-item[data-id="${currentDiscussionId}"]`);
  if (!discussionElement) {
    const allDiscussions = document.querySelectorAll('.discussion-item');
    const discussionIndex = currentDiscussionId - 1;
    if (discussionIndex >= 0 && discussionIndex < allDiscussions.length) {
      discussionElement = allDiscussions[discussionIndex];
    }
  }
  
  if (discussionElement) {
    const expandedContent = discussionElement.querySelector('.expanded-content');
    if (expandedContent.innerHTML.includes('No responses yet')) {
      expandedContent.innerHTML = newResponseHTML;
    } else {
      expandedContent.innerHTML += newResponseHTML;
    }
    
    const expandBtn = discussionElement.querySelector('.expand-btn');
    const currentResponses = discussionElement.querySelectorAll('.expanded-content .response').length;
    expandBtn.textContent = `View Responses (${currentResponses})`;
    
    const responseCountSpan = discussionElement.querySelector('.discussion-stats span');
    responseCountSpan.textContent = `💬 ${currentResponses} response${currentResponses !== 1 ? 's' : ''}`;
  }
  
  textarea.value = '';
  showNotification('Response added successfully!');
}

// Form Handling
function handleCreateDiscussion(event) {
  event.preventDefault();
  
  const title = document.getElementById('question').value.trim();
  const category = document.getElementById('category').value;
  const content = document.getElementById('explain').value.trim();
  
  if (!title || !category || !content) {
    showNotification('Please fill out all required fields.', 'error');
    return;
  }
  
  const discussionList = document.querySelector('.discussion-list');
  const newDiscussionId = Date.now();
  
  const newDiscussion = document.createElement('div');
  newDiscussion.className = 'discussion-item';
  newDiscussion.setAttribute('data-id', newDiscussionId);
  newDiscussion.setAttribute('data-author', 'current-user');
  newDiscussion.innerHTML = `
    <div class="discussion-header">
      <div class="discussion-title">
        <h3>${title}</h3>
        <div class="discussion-meta">
          <span>👤 You</span>
          <span data-timestamp="${Date.now()}">📅 Just now</span>
          <span class="discussion-category">${category}</span>
        </div>
      </div>
    </div>
    <div class="discussion-preview">
      ${content.length > 150 ? content.substring(0, 150) + "..." : content}
    </div>
    <div class="discussion-actions">
      <button class="expand-btn">View Responses (0)</button>
      <div class="discussion-stats">
        <button class="like-btn">🤍 0</button>
        <span>💬 0 responses</span>
      </div>
    </div>
    <div class="expanded-content">
      <p style="text-align: center; color: #888; padding: 20px;">No responses yet. Be the first to join the conversation!</p>
    </div>
  `;
  
  discussionList.prepend(newDiscussion);
  addEventListenersToDiscussion(newDiscussion);
  
  event.target.reset();
  showSection('discussion');
  showNotification('Discussion created successfully!');
}

// Add event listeners to a single discussion element
function addEventListenersToDiscussion(discussionElement) {
  const discussionId = discussionElement.getAttribute('data-id') || 
                     Array.from(document.querySelectorAll('.discussion-item')).indexOf(discussionElement) + 1;
  
  // H3 click handler
  const title = discussionElement.querySelector('.discussion-title h3');
  title.addEventListener('click', function() {
    openDiscussion(discussionId);
  });
  
  // Like button handler
  const likeBtn = discussionElement.querySelector('.like-btn');
  likeBtn.addEventListener('click', function() {
    toggleLike(discussionId);
  });
  
  // Expand button handler
  const expandBtn = discussionElement.querySelector('.expand-btn');
  expandBtn.addEventListener('click', function() {
    toggleExpansion(discussionElement);
  });
  
  // Add edit button (only for user's own discussions)
  addEditButton(discussionElement);
}

// Pagination and filtering functions
let currentPage = 1;
const discussionsPerPage = 5;
let allDiscussions = [];

function setupPagination() {
  allDiscussions = Array.from(document.querySelectorAll('.discussion-item'));
  showPage(1);
  createPaginationControls();
}

function showPage(page) {
  currentPage = page;
  const start = (page - 1) * discussionsPerPage;
  const end = start + discussionsPerPage;
  
  allDiscussions.forEach((discussion, index) => {
    if (index >= start && index < end) {
      discussion.style.display = 'block';
    } else {
      discussion.style.display = 'none';
    }
  });
}

function createPaginationControls() {
  const totalPages = Math.ceil(allDiscussions.length / discussionsPerPage);
  if (totalPages <= 1) return;
  
  const discussionList = document.querySelector('.discussion-list');
  let paginationDiv = document.querySelector('.pagination');
  
  if (!paginationDiv) {
    paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';
    paginationDiv.style.display = 'flex';
    discussionList.parentNode.insertBefore(paginationDiv, discussionList.nextSibling);
  }
  
  paginationDiv.innerHTML = '';
  
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = i;
    pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
    pageBtn.addEventListener('click', () => {
      showPage(i);
      updatePaginationButtons();
    });
    paginationDiv.appendChild(pageBtn);
  }
}

function updatePaginationButtons() {
  const pageButtons = document.querySelectorAll('.page-btn');
  pageButtons.forEach((btn, index) => {
    btn.classList.toggle('active', index + 1 === currentPage);
  });
}

function filterDiscussions() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const selectedCategory = document.getElementById('categoryFilter').value;
  const discussions = document.querySelectorAll('.discussion-item');
  let visibleCount = 0;
  
  discussions.forEach(discussion => {
    const title = discussion.querySelector('.discussion-title h3').textContent.toLowerCase();
    const preview = discussion.querySelector('.discussion-preview').textContent.toLowerCase();
    const category = discussion.querySelector('.discussion-category').textContent;
    
    const matchesSearch = title.includes(searchTerm) || preview.includes(searchTerm);
    const matchesCategory = !selectedCategory || category === selectedCategory;
    
    if (matchesSearch && matchesCategory) {
      discussion.style.display = 'block';
      visibleCount++;
    } else {
      discussion.style.display = 'none';
    }
  });
  
  let noResultsMsg = document.querySelector('.no-results');
  if (visibleCount === 0) {
    if (!noResultsMsg) {
      noResultsMsg = document.createElement('div');
      noResultsMsg.className = 'no-results';
      noResultsMsg.innerHTML = '<h2>No search results found</h2>';
      document.querySelector('.discussion-list').appendChild(noResultsMsg);
    }
    noResultsMsg.style.display = 'block';
  } else {
    if (noResultsMsg) {
      noResultsMsg.style.display = 'none';
    }
  }
  
  const pagination = document.querySelector('.pagination');
  if (pagination) {
    pagination.style.display = (searchTerm || selectedCategory) ? 'none' : 'flex';
  }
}

// FIXED EDITING FUNCTIONS
function addEditButton(discussionElement) {
  const isCurrentUserPost = discussionElement.getAttribute('data-author') === 'current-user';
  if (!isCurrentUserPost) return;
  
  const discussionHeader = discussionElement.querySelector('.discussion-header');
  
  // Check if edit button already exists
  if (discussionHeader.querySelector('.edit-btn')) return;
  
  const editBtn = document.createElement('button');
  editBtn.className = 'edit-btn edit-btn-top-right';
  editBtn.textContent = '✏️ Edit';
  editBtn.addEventListener('click', () => enterEditMode(discussionElement));
  
  discussionHeader.appendChild(editBtn);
}

function enterEditMode(discussionElement) {
  discussionElement.classList.add('editing');
  
  // Get current content
  const titleElement = discussionElement.querySelector('.discussion-title h3');
  const previewElement = discussionElement.querySelector('.discussion-preview');
  const categoryElement = discussionElement.querySelector('.discussion-category');
  
  const currentTitle = titleElement.textContent;
  const currentContent = previewElement.textContent;
  const currentCategory = categoryElement.textContent;
  
  // Replace title with input
  const titleInput = document.createElement('input');
  titleInput.className = 'edit-input';
  titleInput.value = currentTitle;
  titleElement.replaceWith(titleInput);
  
  const contentTextarea = document.createElement('textarea');
contentTextarea.className = 'edit-textarea';
contentTextarea.value = currentContent.trim(); // Remove extra whitespace
previewElement.replaceWith(contentTextarea);

  // Replace category with dropdown
  const categorySelect = document.createElement('select');
  categorySelect.className = 'edit-category-select';
  categorySelect.innerHTML = `
    <option value="General Discussion" ${currentCategory === 'General Discussion' ? 'selected' : ''}>General Discussion</option>
    <option value="Coding Help" ${currentCategory === 'Coding Help' ? 'selected' : ''}>Coding Help</option>
    <option value="Resource Request" ${currentCategory === 'Resource Request' ? 'selected' : ''}>Resource Request</option>
    <option value="Feedback & Suggestions" ${currentCategory === 'Feedback & Suggestions' ? 'selected' : ''}>Feedback & Suggestions</option>
    <option value="Career & Learning" ${currentCategory === 'Career & Learning' ? 'selected' : ''}>Career & Learning</option>
  `;
  categoryElement.replaceWith(categorySelect);
  
  // Replace action buttons
  const actionsDiv = discussionElement.querySelector('.discussion-actions');
  const originalActions = actionsDiv.innerHTML;
  
  actionsDiv.innerHTML = `
    <div class="edit-controls">
      <button class="save-btn">Save</button>
      <button class="cancel-btn">Cancel</button>
      <button class="delete-btn">Delete</button>
    </div>
  `;
  
  // Add event listeners
  actionsDiv.querySelector('.save-btn').addEventListener('click', () => 
    saveChanges(discussionElement, titleInput.value, contentTextarea.value, categorySelect.value, originalActions)
  );
  
  actionsDiv.querySelector('.cancel-btn').addEventListener('click', () => 
    cancelEdit(discussionElement, currentTitle, currentContent, currentCategory, originalActions)
  );
  
  actionsDiv.querySelector('.delete-btn').addEventListener('click', () => 
    deleteDiscussion(discussionElement)
  );
}

function saveChanges(discussionElement, newTitle, newContent, newCategory, originalActions) {
  discussionElement.classList.remove('editing');
  
  // Update title
  const titleInput = discussionElement.querySelector('.edit-input');
  const newTitleElement = document.createElement('h3');
  newTitleElement.textContent = newTitle;
  newTitleElement.addEventListener('click', function() {
    const discussionId = discussionElement.getAttribute('data-id') || 
                        Array.from(document.querySelectorAll('.discussion-item')).indexOf(discussionElement) + 1;
    openDiscussion(discussionId);
  });
  titleInput.replaceWith(newTitleElement);
  
  // Update content
  const contentTextarea = discussionElement.querySelector('.edit-textarea');
  const newPreviewElement = document.createElement('div');
  newPreviewElement.className = 'discussion-preview';
  newPreviewElement.textContent = newContent.length > 150 ? newContent.substring(0, 150) + "..." : newContent;
  contentTextarea.replaceWith(newPreviewElement);

  // Update category
  const categorySelect = discussionElement.querySelector('.edit-category-select');
  const newCategoryElement = document.createElement('span');
  newCategoryElement.className = 'discussion-category';
  newCategoryElement.textContent = newCategory;
  categorySelect.replaceWith(newCategoryElement);
  
  // Restore original actions
  const actionsDiv = discussionElement.querySelector('.discussion-actions');
  actionsDiv.innerHTML = originalActions;
  
  // Re-add event listeners
  addEventListenersToDiscussion(discussionElement);
  
  showNotification('Discussion updated successfully!');
}

function cancelEdit(discussionElement, originalTitle, originalContent, originalCategory, originalActions) {
  discussionElement.classList.remove('editing');
  
  // Restore title
  const titleInput = discussionElement.querySelector('.edit-input');
  const titleElement = document.createElement('h3');
  titleElement.textContent = originalTitle;
  titleElement.addEventListener('click', function() {
    const discussionId = discussionElement.getAttribute('data-id') || 
                        Array.from(document.querySelectorAll('.discussion-item')).indexOf(discussionElement) + 1;
    openDiscussion(discussionId);
  });
  titleInput.replaceWith(titleElement);
  
  // Restore content
  const contentTextarea = discussionElement.querySelector('.edit-textarea');
  const previewElement = document.createElement('div');
  previewElement.className = 'discussion-preview';
  previewElement.textContent = originalContent;
  contentTextarea.replaceWith(previewElement);

  // Restore category
  const categorySelect = discussionElement.querySelector('.edit-category-select');
  const categoryElement = document.createElement('span');
  categoryElement.className = 'discussion-category';
  categoryElement.textContent = originalCategory;
  categorySelect.replaceWith(categoryElement);
  
  // Restore original actions
  const actionsDiv = discussionElement.querySelector('.discussion-actions');
  actionsDiv.innerHTML = originalActions;
  
  // Re-add event listeners
  addEventListenersToDiscussion(discussionElement);
  
  showNotification('Edit cancelled');
}

function deleteDiscussion(discussionElement) {
  // Create warning overlay
  const warningDiv = document.createElement('div');
  warningDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2000;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  
  warningDiv.innerHTML = `
    <div style="background: white; padding: 1.5rem; border-radius: 16px; text-align: center; max-width: 400px; box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);">
      <h3 style="color: black; margin-bottom: 1rem;">Delete Discussion</h3>
      <p style="color: #666; margin-bottom: 2rem;">Are you sure you want to delete this discussion? This action cannot be undone.</p>
      <div style="display: flex; gap: 1rem; justify-content: center;">
        <button class="delete-confirm" style="background: #dc2626; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: background 0.3s;">Delete</button>
        <button class="delete-cancel" style="background: transparent; color: #666; border: 2px solid #e1e5e9; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: border-color 0.3s;">Cancel</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(warningDiv);
  
  // Get button references
  const deleteBtn = warningDiv.querySelector('.delete-confirm');
  const cancelBtn = warningDiv.querySelector('.delete-cancel');
  
  // Add hover effects for Delete button
  deleteBtn.addEventListener('mouseenter', function() {
    this.style.backgroundColor = '#b91c1c';
  });
  
  deleteBtn.addEventListener('mouseleave', function() {
    this.style.backgroundColor = '#dc2626';
  });
  
  // Add hover effects for Cancel button
  cancelBtn.addEventListener('mouseenter', function() {
    this.style.borderColor = '#667eea';
  });
  
  cancelBtn.addEventListener('mouseleave', function() {
    this.style.borderColor = '#e1e5e9';
  });
  
  // Handle buttons
  deleteBtn.onclick = () => {
    discussionElement.remove();
    setupPagination();
    showNotification('Discussion deleted');
    warningDiv.remove();
  };
  
  cancelBtn.onclick = () => {
    warningDiv.remove();
  };
  
  // Close when clicking outside
  warningDiv.onclick = (e) => {
    if (e.target === warningDiv) warningDiv.remove();
  };
}

// Event Listeners and Initialization
document.addEventListener('DOMContentLoaded', function() {
  // Initialize timestamps for existing discussions
  initializeTimestamps();
  
  setupPagination();
  
  // Add event listeners to existing discussions
  document.querySelectorAll('.discussion-item').forEach((discussionElement, index) => {
    if (!discussionElement.getAttribute('data-id')) {
      discussionElement.setAttribute('data-id', index + 1);
    }
    addEventListenersToDiscussion(discussionElement);
  });
  
  // Tab switching
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      const onclickAttr = this.getAttribute('onclick');
      if (onclickAttr) {
        const sectionId = onclickAttr.match(/'(.*?)'/)[1];
        showSection(sectionId);
      }
    });
  });
  
  // Form submission
  const createForm = document.querySelector('.discuss-form');
  if (createForm) {
    createForm.addEventListener('submit', handleCreateDiscussion);
  }
  
  // Reply submission
  const submitReplyBtn = document.getElementById('submit-reply');
  if (submitReplyBtn) {
    submitReplyBtn.addEventListener('click', addResponse);
  }
  
  // Detail view like button
  const detailLikeBtn = document.getElementById('detail-like-btn');
  if (detailLikeBtn) {
    detailLikeBtn.addEventListener('click', function() {
      if (currentDiscussionId) {
        toggleLike(currentDiscussionId);
        const discussionElement = document.querySelector(`.discussion-item[data-id="${currentDiscussionId}"]`);
        if (discussionElement) {
          const originalLikeBtn = discussionElement.querySelector('.like-btn');
          this.innerHTML = originalLikeBtn.innerHTML;
          this.className = originalLikeBtn.className;
        }
      }
    });
  }
  
  const closeNotificationBtn = document.getElementById('close-notification');
  if (closeNotificationBtn) {
    closeNotificationBtn.addEventListener('click', function() {
      document.getElementById('notification').classList.add('hidden');
    });
  }

  // Back button
  const backBtn = document.querySelector('.back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      showSection('discussion');
    });
  }
  
  // Reply textarea Enter key
  const replyTextarea = document.getElementById('reply-textarea');
  if (replyTextarea) {
    replyTextarea.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addResponse();
      }
    });
  }
  
  // Search and filter
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');

  if (searchInput) {
    searchInput.addEventListener('input', filterDiscussions);
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterDiscussions);
  }
  
  // Show default section
  showSection('discussion');
});

const profileIcon = document.getElementById("header-profile-pic");
  const dropdownMenu = document.getElementById("dropdownMenu");

  profileIcon.addEventListener("click", () => {
    dropdownMenu.classList.toggle("show");
  });

  // Close dropdown if clicked outside
  document.addEventListener("click", function(event) {
    if (!profileIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
      dropdownMenu.classList.remove("show");
    }
  });


function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login-page.html";
}

function myFunction() {
  const menu = document.getElementById("myLinks");
  const menuIcon = document.querySelector(".menu-icon");

  menu.classList.toggle("show");
  menuIcon.classList.toggle("active");
}