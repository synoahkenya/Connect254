// PAYSTACK PUBLIC KEY - REPLACE WITH YOUR ACTUAL PAYSTACK TEST KEY
const PAYSTACK_PUBLIC_KEY = 'pk_test_d0df49836e9b84a2a1e0e1e8e4e5e6e7e8e9e0e1';

// WAZUNGU PROFILES WITH EARNING RATES ($10-$20 per day)
const wazunguProfiles = [
    { id: 1, name: "Sarah Williams", age: 28, country: "🇬🇧 London, UK", bio: "Love African culture! Paying $12/day for genuine conversation.", interests: ["Music", "Travel", "Cooking"], avatar: "https://randomuser.me/api/portraits/women/1.jpg", online: true, hourlyRate: 0.50, dailyEarning: 12 },
    { id: 2, name: "James Anderson", age: 32, country: "🇺🇸 New York, USA", bio: "Business consultant paying $15/day for Swahili practice.", interests: ["Business", "Football", "Tech"], avatar: "https://randomuser.me/api/portraits/men/2.jpg", online: true, hourlyRate: 0.625, dailyEarning: 15 },
    { id: 3, name: "Emma Thompson", age: 26, country: "🇨🇦 Toronto, Canada", bio: "Teacher offering $18/day for language exchange!", interests: ["Teaching", "Reading", "Hiking"], avatar: "https://randomuser.me/api/portraits/women/3.jpg", online: true, hourlyRate: 0.75, dailyEarning: 18 },
    { id: 4, name: "Michael Brown", age: 35, country: "🇦🇺 Sydney, Australia", bio: "Photographer paying $20/day for Kenyan friends!", interests: ["Photography", "Nature", "Art"], avatar: "https://randomuser.me/api/portraits/men/4.jpg", online: true, hourlyRate: 0.83, dailyEarning: 20 },
    { id: 5, name: "Sophie Martin", age: 29, country: "🇫🇷 Paris, France", bio: "Love African music! Paying $14/day for culture chats.", interests: ["Dance", "Fashion", "Music"], avatar: "https://randomuser.me/api/portraits/women/5.jpg", online: true, hourlyRate: 0.58, dailyEarning: 14 },
    { id: 6, name: "David Wilson", age: 31, country: "🇩🇪 Berlin, Germany", bio: "Engineer moving to Nairobi. Paying $16/day!", interests: ["Engineering", "Running", "Chess"], avatar: "https://randomuser.me/api/portraits/men/6.jpg", online: true, hourlyRate: 0.67, dailyEarning: 16 },
    { id: 7, name: "Olivia Johnson", age: 27, country: "🇸🇪 Stockholm, Sweden", bio: "Volunteer paying $17/day for Kenyan friends!", interests: ["Volunteering", "Animals", "Coffee"], avatar: "https://randomuser.me/api/portraits/women/7.jpg", online: true, hourlyRate: 0.71, dailyEarning: 17 },
    { id: 8, name: "Daniel Garcia", age: 33, country: "🇪🇸 Madrid, Spain", bio: "Travel lover paying $13/day for Spanish-Swahili exchange!", interests: ["Football", "Travel", "Food"], avatar: "https://randomuser.me/api/portraits/men/8.jpg", online: true, hourlyRate: 0.54, dailyEarning: 13 },
    { id: 9, name: "Isabella Rossi", age: 25, country: "🇮🇹 Rome, Italy", bio: "Fashion blogger paying $19/day for Kenyan fashion!", interests: ["Fashion", "Photography", "Coffee"], avatar: "https://randomuser.me/api/portraits/women/9.jpg", online: true, hourlyRate: 0.79, dailyEarning: 19 },
    { id: 10, name: "Thomas Lee", age: 30, country: "🇸🇬 Singapore", bio: "Digital nomad paying $15/day for recommendations!", interests: ["Tech", "Food", "Nightlife"], avatar: "https://randomuser.me/api/portraits/men/10.jpg", online: true, hourlyRate: 0.625, dailyEarning: 15 },
    { id: 11, name: "Natalie Clark", age: 24, country: "🇳🇿 Auckland, New Zealand", bio: "Student paying $11/day for book chats!", interests: ["Reading", "Writing", "Art"], avatar: "https://randomuser.me/api/portraits/women/11.jpg", online: true, hourlyRate: 0.46, dailyEarning: 11 },
    { id: 12, name: "Robert Martinez", age: 34, country: "🇲🇽 Mexico City, Mexico", bio: "Chef paying $20/day for recipe exchange!", interests: ["Cooking", "Travel", "Music"], avatar: "https://randomuser.me/api/portraits/men/12.jpg", online: true, hourlyRate: 0.83, dailyEarning: 20 }
];

// Global variables
let activeUnlock = null;
let currentChat = null;
let timerInterval = null;
let earningsInterval = null;
let sessionStartTime = null;
let selectedProfileId = null;

// Load saved data from localStorage
function loadSavedData() {
    const saved = localStorage.getItem('connect254_unlock');
    if (saved) {
        const data = JSON.parse(saved);
        if (data.endTime > Date.now()) {
            activeUnlock = data;
            updateUIBasedOnUnlock();
        } else {
            localStorage.removeItem('connect254_unlock');
        }
    }
    
    const savedEarnings = localStorage.getItem('connect254_earnings');
    if (savedEarnings) {
        const earnings = JSON.parse(savedEarnings);
        document.getElementById('total-earnings').innerText = `$${earnings.total.toFixed(2)}`;
    }
}

function updateUIBasedOnUnlock() {
    if (activeUnlock) {
        document.querySelectorAll('.select-profile-btn').forEach(btn => {
            btn.innerHTML = '💬 Chat & Earn Now!';
        });
    }
}

// Create floating hearts animation
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = ['❤️', '💖', '💕', '💗', '💰', '💝'][Math.floor(Math.random() * 6)];
    heart.className = 'floating-heart';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = 3 + Math.random() * 5 + 's';
    heart.style.fontSize = 1 + Math.random() * 2 + 'rem';
    document.getElementById('hearts-container').appendChild(heart);
    setTimeout(() => heart.remove(), 6000);
}

// Render all profiles
function renderProfiles() {
    const grid = document.getElementById('profiles-grid');
    grid.innerHTML = wazunguProfiles.map(profile => `
        <div class="profile-card bg-white rounded-2xl overflow-hidden shadow-lg">
            <div class="relative">
                <img src="${profile.avatar}" alt="${profile.name}" class="w-full h-64 object-cover">
                ${profile.online ? '<span class="online-indicator"></span>' : '<span class="absolute bottom-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">Offline</span>'}
                <div class="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    💰 $${profile.dailyEarning}/day
                </div>
            </div>
            <div class="p-4">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-bold text-gray-800">${profile.name}</h3>
                    <span class="text-sm text-gray-500">${profile.age} yrs</span>
                </div>
                <p class="text-gray-600 text-sm mb-2">${profile.country}</p>
                <p class="text-gray-700 text-sm mb-3">${profile.bio}</p>
                <div class="flex flex-wrap gap-1 mb-3">
                    ${profile.interests.map(i => `<span class="bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded-full">${i}</span>`).join('')}
                </div>
                <div class="bg-green-50 rounded-lg p-2 mb-3 text-center">
                    <span class="text-green-700 font-bold text-sm">💰 You earn $${profile.hourlyRate}/hour chatting</span>
                </div>
                <button onclick="selectProfile(${profile.id})" class="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold py-2 rounded-xl hover:shadow-lg transition">
                    💬 Chat & Earn $${profile.dailyEarning}
                </button>
            </div>
        </div>
    `).join('');
}

// Select profile to chat with
window.selectProfile = function(profileId) {
    selectedProfileId = profileId;
    
    if (activeUnlock && activeUnlock.endTime > Date.now()) {
        startChatWithProfile(profileId);
    } else {
        document.getElementById('phone-modal').classList.remove('hidden');
    }
};

function startChatWithProfile(profileId) {
    const wazungu = wazunguProfiles.find(w => w.id === profileId);
    if (!wazungu) return;
    
    const phone = activeUnlock ? activeUnlock.phone : document.getElementById('user-phone-input').value;
    
    const savedChats = localStorage.getItem('connect254_chats');
    let chats = savedChats ? JSON.parse(savedChats) : {};
    const chatKey = `${phone}_${profileId}`;
    
    currentChat = {
        wazungu: wazungu,
        phone: phone,
        profileId: profileId,
        messages: chats[chatKey] || [],
        startTime: Date.now()
    };
    
    openChatModal();
}

function openChatModal() {
    if (!currentChat) return;
    
    const w = currentChat.wazungu;
    
    document.getElementById('modal-avatar').src = w.avatar;
    document.getElementById('modal-name').innerHTML = `${w.name} ${w.online ? '<span class="text-green-400 text-sm">● Online</span>' : '<span class="text-gray-400 text-sm">● Offline</span>'}`;
    document.getElementById('modal-country').innerText = w.country;
    document.getElementById('modal-earning-rate').innerHTML = `$${w.hourlyRate}/hour`;
    document.getElementById('hourly-rate-display').innerHTML = `$${w.hourlyRate}`;
    
    const container = document.getElementById('modal-chat-messages');
    container.innerHTML = '';
    currentChat.messages.forEach(msg => displayMessage(msg));
    
    if (activeUnlock) {
        startTimer(activeUnlock.endTime);
        sessionStartTime = activeUnlock.startTime;
    }
    
    startEarningsTracking();
    
    document.getElementById('chat-modal').classList.remove('hidden');
    container.scrollTop = container.scrollHeight;
}

function startEarningsTracking() {
    if (earningsInterval) clearInterval(earningsInterval);
    
    earningsInterval = setInterval(() => {
        if (!currentChat || !activeUnlock) return;
        
        const elapsedHours = (Date.now() - sessionStartTime) / (1000 * 60 * 60);
        const hourlyRate = currentChat.wazungu.hourlyRate;
        let currentEarnings = elapsedHours * hourlyRate;
        currentEarnings = Math.min(currentEarnings, currentChat.wazungu.dailyEarning);
        
        document.getElementById('earnings-amount').innerHTML = `$${currentEarnings.toFixed(2)}`;
        const progressPercent = (currentEarnings / currentChat.wazungu.dailyEarning) * 100;
        document.getElementById('earnings-progress').style.width = `${progressPercent}%`;
        
        let savedEarnings = localStorage.getItem('connect254_earnings');
        let earnings = savedEarnings ? JSON.parse(savedEarnings) : { total: 0, history: [] };
        if (currentEarnings > (earnings.lastAmount || 0)) {
            earnings.total += (currentEarnings - (earnings.lastAmount || 0));
            earnings.lastAmount = currentEarnings;
            localStorage.setItem('connect254_earnings', JSON.stringify(earnings));
            document.getElementById('total-earnings').innerHTML = `$${earnings.total.toFixed(2)}`;
        }
    }, 60000);
}

function displayMessage(msg) {
    const container = document.getElementById('modal-chat-messages');
    const div = document.createElement('div');
    const isUser = msg.sender === 'user';
    div.className = `message-bubble ${isUser ? 'message-user' : 'message-wazungu'}`;
    div.innerHTML = `
        <div class="text-xs opacity-70 mb-1">${isUser ? 'You' : currentChat?.wazungu?.name || 'Wazungu'}</div>
        <div>${escapeHtml(msg.text)}</div>
        <div class="text-xs opacity-70 mt-1">${new Date(msg.time).toLocaleTimeString()}</div>
    `;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('modal-message-input');
    const text = input.value.trim();
    if (!text) return;
    
    const blocked = ['sex', 'escort', 'prostitute', 'nude', 'naked', 'xxx', 'porn'];
    if (blocked.some(word => text.toLowerCase().includes(word))) {
        alert('Message blocked: Please keep conversations respectful.');
        return;
    }
    
    const newMsg = { sender: 'user', text: text, time: Date.now() };
    currentChat.messages.push(newMsg);
    
    const savedChats = localStorage.getItem('connect254_chats');
    let chats = savedChats ? JSON.parse(savedChats) : {};
    const chatKey = `${currentChat.phone}_${currentChat.profileId}`;
    chats[chatKey] = currentChat.messages;
    localStorage.setItem('connect254_chats', JSON.stringify(chats));
    
    displayMessage(newMsg);
    input.value = '';
    
    setTimeout(() => simulateReply(), 2000);
}

function simulateReply() {
    const replies = [
        "That's interesting! Tell me more about yourself 😊",
        "I love Kenya! Keep chatting and earning! 💰",
        "You're doing great! I'll make sure you get paid well!",
        "I'm learning Swahili. Can you teach me some words?",
        "The more we chat, the more you earn! Let's keep going! ✈️",
        "You're awesome! I'm enjoying this conversation 💕",
        "Did you know? Top earners win PASSPORTS to travel abroad!",
        "Keep saving those earnings! You're doing fantastic! 🌟"
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];
    const newMsg = { sender: 'wazungu', text: reply, time: Date.now() };
    currentChat.messages.push(newMsg);
    
    const savedChats = localStorage.getItem('connect254_chats');
    let chats = savedChats ? JSON.parse(savedChats) : {};
    const chatKey = `${currentChat.phone}_${currentChat.profileId}`;
    chats[chatKey] = currentChat.messages;
    localStorage.setItem('connect254_chats', JSON.stringify(chats));
    
    displayMessage(newMsg);
}

function startTimer(endTime) {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        const remaining = Math.max(0, endTime - Date.now());
        const hours = Math.floor(remaining / 3600000);
        const minutes = Math.floor((remaining % 3600000) / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        
        const timerDisplay = document.getElementById('modal-timer');
        timerDisplay.innerHTML = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (remaining < 3600000) {
            timerDisplay.classList.add('timer-warning');
        }
        
        if (remaining <= 0) {
            clearInterval(timerInterval);
            clearInterval(earningsInterval);
            timerDisplay.innerHTML = "Expired!";
            document.getElementById('modal-message-input').disabled = true;
            document.getElementById('modal-send-btn').disabled = true;
            alert('Your 24-hour access has expired. Pay another KSh 300 to continue earning!');
            
            const earningsText = document.getElementById('earnings-amount').innerText;
            const earnings = parseFloat(earningsText.replace('$', ''));
            if (earnings >= 15) {
                setTimeout(() => {
                    alert('🎉 CONGRATULATIONS! 🎉\n\nYou earned $' + earnings.toFixed(2) + '!\n\nYou qualify for our PASSPORT RAFFLE! 🛂✈️');
                }, 1000);
            }
        }
    }, 1000);
}

function initiatePayment(phone) {
    const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: phone + '@connect254.co.ke',
        amount: 300 * 100,
        currency: 'KES',
        ref: 'CONNECT_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
        callback: function(response) {
            const endTime = Date.now() + (24 * 60 * 60 * 1000);
            activeUnlock = {
                phone: phone,
                startTime: Date.now(),
                endTime: endTime,
                paymentRef: response.reference
            };
            localStorage.setItem('connect254_unlock', JSON.stringify(activeUnlock));
            document.getElementById('phone-modal').classList.add('hidden');
            
            if (selectedProfileId) {
                startChatWithProfile(selectedProfileId);
            }
        },
        onClose: function() {
            alert('Payment cancelled');
        }
    });
    handler.openIframe();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event listeners
document.getElementById('confirm-payment-btn').addEventListener('click', () => {
    const phone = document.getElementById('user-phone-input').value.trim();
    const terms = document.getElementById('terms-checkbox').checked;
    
    if (!phone) {
        alert('Please enter your phone number');
        return;
    }
    if (!phone.match(/^254[0-9]{9}$/)) {
        alert('Enter valid Kenyan number: 254712345678');
        return;
    }
    if (!terms) {
        alert('You must be 18+ and agree to terms');
        return;
    }
    
    initiatePayment(phone);
});

document.getElementById('close-phone-modal').addEventListener('click', () => {
    document.getElementById('phone-modal').classList.add('hidden');
});

document.getElementById('close-modal').addEventListener('click', () => {
    clearInterval(timerInterval);
    clearInterval(earningsInterval);
    document.getElementById('chat-modal').classList.add('hidden');
    currentChat = null;
});

document.getElementById('modal-send-btn').addEventListener('click', sendMessage);
document.getElementById('modal-message-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

document.getElementById('modal-report-btn').addEventListener('click', () => {
    alert('Thank you for reporting. Our moderators will review within 24 hours.');
});

document.getElementById('phone-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('phone-modal')) {
        document.getElementById('phone-modal').classList.add('hidden');
    }
});

document.getElementById('chat-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('chat-modal')) {
        clearInterval(timerInterval);
        clearInterval(earningsInterval);
        document.getElementById('chat-modal').classList.add('hidden');
        currentChat = null;
    }
});

// Initialize app
setInterval(createFloatingHeart, 2500);
renderProfiles();
loadSavedData();