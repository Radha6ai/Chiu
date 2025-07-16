// KidsLearn - Personalized Learning Platform JavaScript

// Student profiles with learning preferences and progress
const studentProfiles = {
    emma: {
        name: "Emma",
        age: 8,
        learningStyle: "Visual & Interactive",
        interests: "Animals, Drawing, Stories",
        progress: 65,
        achievements: ["Reading Star", "Art Explorer", "Math Wizard"],
        completedLessons: ["math-addition", "reading-comprehension"]
    },
    alex: {
        name: "Alex",
        age: 10,
        learningStyle: "Logical & Hands-on",
        interests: "Science, Building, Experiments",
        progress: 78,
        achievements: ["Science Explorer", "Logic Master", "Creative Builder"],
        completedLessons: ["science-plants", "math-multiplication"]
    },
    sam: {
        name: "Sam",
        age: 7,
        learningStyle: "Auditory & Creative",
        interests: "Music, Stories, Colors",
        progress: 52,
        achievements: ["Creative Writer", "Music Maker", "Story Teller"],
        completedLessons: ["art-colors", "writing-stories"]
    }
};

// Current active student
let currentStudent = 'emma';

// Writing prompts for creative writing lessons
const writingPrompts = [
    {
        title: "🌟 My Magical Adventure",
        prompt: "Imagine you found a magical door in your backyard. What's behind it? Describe your adventure! Think about what you see, hear, and feel.",
        example: "When I opened the magical door, I saw a shimmering forest with purple trees and singing flowers..."
    },
    {
        title: "🚀 Space Explorer",
        prompt: "You're an astronaut exploring a new planet! What does it look like? What strange creatures live there? Tell us about your exciting discovery!",
        example: "As I stepped out of my spaceship, I saw a planet covered in rainbow-colored crystals that chimed like bells..."
    },
    {
        title: "🏰 Castle Mystery",
        prompt: "You discover an old castle with a secret room. What's inside? Who used to live there? Write about your mysterious find!",
        example: "The heavy wooden door creaked open, revealing a room filled with glowing books and a friendly dragon..."
    },
    {
        title: "🌊 Under the Sea",
        prompt: "You can breathe underwater for a day! What adventures await you in the ocean? What sea creatures become your friends?",
        example: "I dove deep into the blue ocean and met a wise old turtle who offered to show me the coral city..."
    },
    {
        title: "🦄 Enchanted Forest",
        prompt: "Walking through a magical forest, you meet talking animals! What do they tell you? What adventure do you go on together?",
        example: "A friendly rabbit hopped up to me and said, 'Follow me to the secret meadow where the unicorns dance!'"
    }
];

let currentPromptIndex = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    updateStudentProfile();
    showHomeScreen();
    
    // Add some initial animations
    animateWelcome();
});

// Student selection functionality
function selectChild(childId) {
    currentStudent = childId;
    
    // Update active button
    const buttons = document.querySelectorAll('.child-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update profile information
    updateStudentProfile();
    
    // Update welcome message
    updateWelcomeMessage();
    
    // Add selection animation
    event.target.style.transform = 'scale(1.1)';
    setTimeout(() => {
        event.target.style.transform = 'scale(1)';
    }, 200);
}

// Update student profile display
function updateStudentProfile() {
    const profile = studentProfiles[currentStudent];
    
    document.getElementById('learningStyle').textContent = profile.learningStyle;
    document.getElementById('interests').textContent = profile.interests;
    document.getElementById('overallProgress').style.width = profile.progress + '%';
    document.querySelector('.progress-section small').textContent = profile.progress + '% Complete';
    
    // Animate progress bar
    const progressBar = document.getElementById('overallProgress');
    progressBar.style.width = '0%';
    setTimeout(() => {
        progressBar.style.width = profile.progress + '%';
    }, 500);
}

// Update welcome message
function updateWelcomeMessage() {
    const profile = studentProfiles[currentStudent];
    const welcomeMessage = document.querySelector('.welcome-message h2');
    if (welcomeMessage) {
        welcomeMessage.textContent = `Welcome back, ${profile.name}! 🎉`;
    }
}

// Navigation functions
function showHomeScreen() {
    hideAllLessons();
    document.getElementById('homeScreen').style.display = 'block';
    document.getElementById('homeScreen').classList.add('active');
}

function goHome() {
    hideAllLessons();
    showHomeScreen();
    
    // Reset any quiz states
    resetQuizStates();
}

function hideAllLessons() {
    const lessons = document.querySelectorAll('.lesson-content');
    lessons.forEach(lesson => {
        lesson.style.display = 'none';
        lesson.classList.remove('active');
    });
    document.getElementById('homeScreen').style.display = 'none';
}

function startSubject(subject) {
    hideAllLessons();
    const lessonId = subject + 'Lesson';
    const lesson = document.getElementById(lessonId);
    
    if (lesson) {
        lesson.style.display = 'block';
        lesson.classList.add('active');
        
        // Add entrance animation
        lesson.style.opacity = '0';
        lesson.style.transform = 'translateY(20px)';
        setTimeout(() => {
            lesson.style.opacity = '1';
            lesson.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Quiz functionality
let selectedAnswer = null;
let selectedMultiple = [];

function selectAnswer(button, isCorrect) {
    // Remove previous selections
    const options = button.parentElement.querySelectorAll('.quiz-option');
    options.forEach(option => option.classList.remove('selected'));
    
    // Select current answer
    button.classList.add('selected');
    selectedAnswer = { button, isCorrect };
    
    // Add selection animation
    button.style.transform = 'scale(1.05)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

function selectMultiple(button, isCorrect) {
    button.classList.toggle('selected');
    
    const index = selectedMultiple.findIndex(item => item.button === button);
    if (index > -1) {
        selectedMultiple.splice(index, 1);
    } else {
        selectedMultiple.push({ button, isCorrect });
    }
    
    // Add selection animation
    button.style.transform = 'scale(1.05)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

// Subject-specific answer checking
function checkMathAnswer() {
    if (!selectedAnswer) {
        showFeedback('mathFeedback', 'Please select an answer first!', 'error');
        return;
    }
    
    const feedback = document.getElementById('mathFeedback');
    const options = document.querySelectorAll('#mathLesson .quiz-option');
    
    if (selectedAnswer.isCorrect) {
        selectedAnswer.button.classList.add('correct');
        showFeedback('mathFeedback', '🎉 Excellent! You got it right! 3 + 2 = 5 dogs. Great job solving this animal addition problem!', 'success');
        showRewards();
        updateProgress();
    } else {
        selectedAnswer.button.classList.add('incorrect');
        // Show correct answer
        options.forEach(option => {
            if (option.textContent === '5 dogs') {
                option.classList.add('correct');
            }
        });
        showFeedback('mathFeedback', '🤔 Not quite right, but good try! The correct answer is 5 dogs. Remember: 3 + 2 = 5. Let\'s try another problem!', 'error');
    }
    
    // Disable further selections
    options.forEach(option => option.disabled = true);
}

function checkReadingAnswer() {
    if (!selectedAnswer) {
        showFeedback('readingFeedback', 'Please select an answer first!', 'error');
        return;
    }
    
    const feedback = document.getElementById('readingFeedback');
    const options = document.querySelectorAll('#readingLesson .quiz-option');
    
    if (selectedAnswer.isCorrect) {
        selectedAnswer.button.classList.add('correct');
        showFeedback('readingFeedback', '📚 Perfect! You read carefully and found the right answer! The butterflies loved to dance among the flowers. Great reading comprehension!', 'success');
        showRewards();
        updateProgress();
    } else {
        selectedAnswer.button.classList.add('incorrect');
        // Show correct answer
        options.forEach(option => {
            if (option.textContent === 'Dance among the flowers') {
                option.classList.add('correct');
            }
        });
        showFeedback('readingFeedback', '📖 Good try! Let\'s read that part again: "The butterflies loved to dance among the colorful flowers." Try reading more carefully next time!', 'error');
    }
    
    // Disable further selections
    options.forEach(option => option.disabled = true);
}

function checkScienceAnswer() {
    if (selectedMultiple.length === 0) {
        showFeedback('scienceFeedback', 'Please select at least one answer!', 'error');
        return;
    }
    
    const correctAnswers = selectedMultiple.filter(item => item.isCorrect);
    const incorrectAnswers = selectedMultiple.filter(item => !item.isCorrect);
    
    // Visual feedback for all selections
    selectedMultiple.forEach(item => {
        if (item.isCorrect) {
            item.button.classList.add('correct');
        } else {
            item.button.classList.add('incorrect');
        }
    });
    
    // Show correct answers that weren't selected
    const allOptions = document.querySelectorAll('#scienceLesson .quiz-option');
    allOptions.forEach(option => {
        if ((option.textContent.includes('Sunlight') || option.textContent.includes('Water') || option.textContent.includes('Soil')) && !option.classList.contains('selected')) {
            option.classList.add('correct');
        }
    });
    
    if (correctAnswers.length === 3 && incorrectAnswers.length === 0) {
        showFeedback('scienceFeedback', '🌱 Outstanding! You know exactly what plants need! Sunlight, water, and soil are all essential for plants to grow healthy and strong. You\'re a plant expert!', 'success');
        showRewards();
        updateProgress();
    } else {
        showFeedback('scienceFeedback', '🔬 Good thinking! Plants need sunlight, water, and soil to grow. They definitely don\'t need pizza! 😄 Remember these three important things for healthy plants.', 'error');
    }
    
    // Disable further selections
    allOptions.forEach(option => option.disabled = true);
}

function checkArtAnswer() {
    if (!selectedAnswer) {
        showFeedback('artFeedback', 'Please select an answer first!', 'error');
        return;
    }
    
    const feedback = document.getElementById('artFeedback');
    const options = document.querySelectorAll('#artLesson .quiz-option');
    
    if (selectedAnswer.isCorrect) {
        selectedAnswer.button.classList.add('correct');
        showFeedback('artFeedback', '🎨 Amazing! You\'re right! Red and yellow make orange! You understand color mixing perfectly. Try mixing other colors to see what happens!', 'success');
        showRewards();
        updateProgress();
    } else {
        selectedAnswer.button.classList.add('incorrect');
        // Show correct answer
        options.forEach(option => {
            if (option.textContent === 'Orange') {
                option.classList.add('correct');
            }
        });
        showFeedback('artFeedback', '🌈 Good try! When you mix red and yellow, you get orange! Think of a sunset or a pumpkin. Keep experimenting with colors!', 'error');
    }
    
    // Disable further selections
    options.forEach(option => option.disabled = true);
}

// Writing functionality
function updateWordCount() {
    const textarea = document.getElementById('writingArea');
    const wordCount = document.getElementById('wordCount');
    
    const words = textarea.value.trim().split(/\s+/).filter(word => word.length > 0);
    wordCount.textContent = words.length;
    
    // Add encouragement based on word count
    if (words.length >= 50) {
        wordCount.style.color = '#48bb78';
        wordCount.textContent += ' - Great job!';
    } else if (words.length >= 20) {
        wordCount.style.color = '#ed8936';
        wordCount.textContent += ' - Keep going!';
    } else {
        wordCount.style.color = '#666';
    }
}

function checkWriting() {
    const textarea = document.getElementById('writingArea');
    const feedback = document.getElementById('writingFeedback');
    
    if (textarea.value.trim().length < 10) {
        showFeedback('writingFeedback', 'Try writing a bit more! Tell us about your adventure with more details. What did you see, hear, or feel?', 'error');
        return;
    }
    
    const encouragements = [
        '✨ What an amazing story! Your imagination is incredible!',
        '🌟 I love your creative ideas! You\'re a fantastic storyteller!',
        '📝 Wonderful writing! You painted a beautiful picture with your words!',
        '🎭 Your story is so engaging! I can really imagine being there!',
        '💫 Excellent creativity! You should be proud of your writing!'
    ];
    
    const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
    showFeedback('writingFeedback', randomEncouragement, 'success');
    showRewards();
    updateProgress();
}

function generateNewPrompt() {
    currentPromptIndex = (currentPromptIndex + 1) % writingPrompts.length;
    const prompt = writingPrompts[currentPromptIndex];
    
    document.getElementById('writingTitle').textContent = prompt.title;
    document.getElementById('writingPrompt').innerHTML = `<strong>Writing Prompt:</strong> ${prompt.prompt}`;
    document.getElementById('writingExample').innerHTML = `<strong>Example Start:</strong> "${prompt.example}"`;
    
    // Clear previous writing
    document.getElementById('writingArea').value = '';
    document.getElementById('wordCount').textContent = '0';
    document.getElementById('writingFeedback').style.display = 'none';
    
    // Add animation
    const titleElement = document.getElementById('writingTitle');
    titleElement.style.transform = 'scale(1.1)';
    titleElement.style.color = '#5a67d8';
    setTimeout(() => {
        titleElement.style.transform = 'scale(1)';
        titleElement.style.color = '#2d3748';
    }, 500);
}

// Feedback and rewards system
function showFeedback(elementId, message, type) {
    const feedback = document.getElementById(elementId);
    feedback.textContent = message;
    feedback.className = `feedback ${type} show`;
    feedback.style.display = 'block';
    
    // Add animation
    feedback.style.opacity = '0';
    feedback.style.transform = 'translateY(10px)';
    setTimeout(() => {
        feedback.style.opacity = '1';
        feedback.style.transform = 'translateY(0)';
    }, 100);
}

function showRewards() {
    const rewards = document.createElement('div');
    rewards.className = 'rewards';
    rewards.innerHTML = `
        <div class="star">⭐</div>
        <div class="star">⭐</div>
        <div class="star">⭐</div>
        <p>Great job! You earned 3 stars!</p>
    `;
    
    // Add to active lesson
    const activeLesson = document.querySelector('.lesson-content.active');
    if (activeLesson) {
        activeLesson.appendChild(rewards);
        
        // Remove after 3 seconds
        setTimeout(() => {
            rewards.remove();
        }, 3000);
    }
}

function updateProgress() {
    const profile = studentProfiles[currentStudent];
    profile.progress = Math.min(100, profile.progress + 5);
    
    const progressBar = document.getElementById('overallProgress');
    const progressText = document.querySelector('.progress-section small');
    
    progressBar.style.width = profile.progress + '%';
    progressText.textContent = profile.progress + '% Complete';
    
    // Add celebration for milestones
    if (profile.progress % 25 === 0) {
        celebrateMilestone();
    }
}

function celebrateMilestone() {
    const celebration = document.createElement('div');
    celebration.innerHTML = '🎉 Milestone Reached! 🎉';
    celebration.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 20px 40px;
        border-radius: 15px;
        font-size: 1.5em;
        z-index: 1000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        animation: bounce 0.6s ease;
    `;
    
    document.body.appendChild(celebration);
    
    setTimeout(() => {
        celebration.remove();
    }, 2000);
}

// Reset quiz states
function resetQuizStates() {
    selectedAnswer = null;
    selectedMultiple = [];
    
    // Reset all quiz options
    const allOptions = document.querySelectorAll('.quiz-option');
    allOptions.forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
        option.disabled = false;
    });
    
    // Hide all feedback
    const allFeedback = document.querySelectorAll('.feedback');
    allFeedback.forEach(feedback => {
        feedback.style.display = 'none';
        feedback.classList.remove('show');
    });
}

// Welcome animation
function animateWelcome() {
    const header = document.querySelector('.header h1');
    const subjects = document.querySelectorAll('.subject-card');
    
    // Animate header
    header.style.transform = 'translateY(-20px)';
    header.style.opacity = '0';
    setTimeout(() => {
        header.style.transform = 'translateY(0)';
        header.style.opacity = '1';
    }, 300);
    
    // Animate subject cards with stagger
    subjects.forEach((card, index) => {
        card.style.transform = 'translateY(20px)';
        card.style.opacity = '0';
        setTimeout(() => {
            card.style.transform = 'translateY(0)';
            card.style.opacity = '1';
        }, 500 + (index * 100));
    });
}

// Add some interactive sound effects (visual feedback)
function addClickEffect(element) {
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 100);
}

// Add click effects to all buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn') || e.target.classList.contains('subject-card')) {
        addClickEffect(e.target);
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        goHome();
    }
});

// Add achievement system
function checkAchievements() {
    const profile = studentProfiles[currentStudent];
    
    // Check for new achievements based on progress
    if (profile.progress >= 100 && !profile.achievements.includes('Learning Champion')) {
        profile.achievements.push('Learning Champion');
        showAchievementNotification('Learning Champion', '🏆');
    }
    
    if (profile.progress >= 75 && !profile.achievements.includes('Star Student')) {
        profile.achievements.push('Star Student');
        showAchievementNotification('Star Student', '⭐');
    }
}

function showAchievementNotification(title, icon) {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="font-size: 2em; margin-bottom: 10px;">${icon}</div>
        <div>Achievement Unlocked!</div>
        <div style="font-weight: bold;">${title}</div>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #48bb78, #38a169);
        color: white;
        padding: 20px;
        border-radius: 15px;
        text-align: center;
        z-index: 1000;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        animation: slideIn 0.5s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// Initialize application
console.log('KidsLearn Platform Initialized! 🌟');
console.log('Current student:', studentProfiles[currentStudent].name);