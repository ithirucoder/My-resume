// Jarvis Voice Assistant for Portfolio Website
class Jarvis {
    constructor() {
        this.listening = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.wakeWord = 'jarvis';
        this.isActive = false;
        this.isSupported = false;
        this.init();
    }

    init() {
        console.log('Jarvis: Initializing...');
        
        // Check if browser supports Web Speech API
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.lang = 'en-US';
            this.recognition.interimResults = false;
            this.recognition.maxAlternatives = 1;
            this.isSupported = true;

            this.recognition.onstart = () => {
                console.log('Jarvis: Speech recognition started');
                this.listening = true;
                this.updateUI(true);
            };

            this.recognition.onresult = (event) => {
                // Get the latest result
                const last = event.results.length - 1;
                const command = event.results[last][0].transcript.toLowerCase();
                console.log('Jarvis heard:', command);
                this.processCommand(command);
            };

            this.recognition.onerror = (event) => {
                console.error('Jarvis: Speech recognition error:', event.error);
                this.handleError(event.error);
                if (event.error !== 'no-speech') {
                    this.stopListening();
                }
            };

            this.recognition.onend = () => {
                console.log('Jarvis: Speech recognition ended');
                this.listening = false;
                this.updateUI(false);
                
                // Auto-restart if still active
                if (this.isActive) {
                    console.log('Jarvis: Auto-restarting listening');
                    setTimeout(() => {
                        if (this.isActive && !this.listening) {
                            this.startListening();
                        }
                    }, 600);
                }
            };
            
            console.log('Jarvis: Web Speech API supported and initialized');
        } else {
            console.error('Jarvis: Web Speech API not supported in this browser');
            this.showNotification('Voice recognition not supported in this browser. Please use Chrome or Edge.', 'error');
        }
        
        // Check speech synthesis
        if (!this.synthesis) {
            console.error('Jarvis: Speech synthesis not supported');
        } else {
            console.log('Jarvis: Speech synthesis supported');
        }
    }

    handleError(error) {
        let message = '';
        switch(error) {
            case 'no-speech':
                // Don't show notification for no-speech, it's normal
                return;
            case 'audio-capture':
                message = 'No microphone found. Please check your microphone.';
                break;
            case 'not-allowed':
                message = 'Microphone access denied. Please allow microphone access.';
                break;
            case 'network':
                message = 'Network error. Please check your internet connection.';
                break;
            default:
                message = 'Error occurred: ' + error;
        }
        console.error('Jarvis Error:', message);
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `jarvis-notification jarvis-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            z-index: 10001;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            background: ${type === 'error' ? 'linear-gradient(135deg, #dc3545, #f86c6b)' : 'linear-gradient(135deg, #667eea, #764ba2)'};
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    startListening() {
        console.log('Jarvis: Starting to listen...');
        if (!this.isSupported) {
            this.showNotification('Voice recognition not supported. Please use Chrome or Edge.', 'error');
            return;
        }
        
        if (this.recognition && !this.listening) {
            try {
                this.recognition.start();
            } catch (error) {
                console.error('Jarvis: Error starting recognition:', error);
                this.showNotification('Error starting voice recognition', 'error');
            }
        }
    }

    stopListening() {
        console.log('Jarvis: Stopping to listen...');
        if (this.recognition && this.listening) {
            try {
                this.recognition.stop();
            } catch (error) {
                console.error('Jarvis: Error stopping recognition:', error);
            }
            this.listening = false;
            this.updateUI(false);
        }
    }

    toggleListening() {
        console.log('Jarvis: Toggle listening');
        if (this.listening) {
            this.stopListening();
            this.isActive = false;
        } else {
            this.isActive = false;
            this.startListening();
        }
    }

    speak(text) {
        console.log('Jarvis speaking:', text);
        if (this.synthesis) {
            // Cancel any ongoing speech
            this.synthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.volume = 1;
            
            utterance.onstart = () => console.log('Jarvis: Speech started');
            utterance.onend = () => console.log('Jarvis: Speech ended');
            utterance.onerror = (e) => console.error('Jarvis: Speech error:', e);
            
            // Try to use a male voice
            const voices = this.synthesis.getVoices();
            console.log('Jarvis: Available voices:', voices.length);
            const maleVoice = voices.find(voice => 
                voice.name.includes('Male') || 
                voice.name.includes('David') || 
                voice.name.includes('Google US English') ||
                voice.name.includes('English US')
            );
            if (maleVoice) {
                utterance.voice = maleVoice;
                console.log('Jarvis: Using voice:', maleVoice.name);
            }
            
            this.synthesis.speak(utterance);
        } else {
            console.error('Jarvis: Speech synthesis not available');
        }
    }

    processCommand(command) {
        console.log('Jarvis: Processing command:', command, 'Active:', this.isActive);
        
        // Check for wake word
        if (command.includes(this.wakeWord)) {
            if (!this.isActive) {
                this.isActive = true;
                this.speak('Yes, how can I help you?');
                console.log('Jarvis: Wake word detected, now active');
            } else {
                this.speak('I\'m already listening');
            }
            return;
        }

        // Only process commands if Jarvis is active (wake word was spoken)
        if (!this.isActive) {
            console.log('Jarvis: Not active, ignoring command');
            return;
        }

        // Portfolio navigation commands
        if (command.includes('home') || command.includes('about')) {
            this.speak('Navigating to home');
            this.isActive = false;
            this.stopListening();
            setTimeout(() => window.location.href = 'index.html', 1000);
        }
        else if (command.includes('skill') || command.includes('skills')) {
            this.speak('Opening skills section');
            this.isActive = false;
            this.stopListening();
            setTimeout(() => window.location.href = 'skills.html', 1000);
        }
        else if (command.includes('project') || command.includes('projects')) {
            this.speak('Showing my projects');
            this.isActive = false;
            this.stopListening();
            setTimeout(() => window.location.href = 'projects.html', 1000);
        }
        else if (command.includes('contact')) {
            this.speak('Opening contact page');
            this.isActive = false;
            this.stopListening();
            setTimeout(() => window.location.href = 'Contact.html', 1000);
        }
        else if (command.includes('agrocart') || command.includes('agro')) {
            this.speak('Opening AgroCart project');
            this.isActive = false;
            this.stopListening();
            setTimeout(() => window.location.href = '../../AGROCART/Mini-project/frontend/index.html', 1000);
        }
        else if (command.includes('music')) {
            this.speak('Opening Music project');
            this.isActive = false;
            this.stopListening();
            setTimeout(() => window.location.href = '../../Music/project/index.html', 1000);
        }
        else if (command.includes('portfolio')) {
            this.speak('Opening Portfolio 2.0');
            this.isActive = false;
            this.stopListening();
            setTimeout(() => window.location.href = '../../Portfolio 2.0/My-resume-2.0/index.html', 1000);
        }
        else if (command.includes('doctor') || command.includes('health')) {
            this.speak('Opening Doctors Portal');
            this.isActive = false;
            this.stopListening();
            setTimeout(() => window.location.href = '../../Doctors/index.html', 1000);
        }
        else if (command.includes('stop') || command.includes('deactivate')) {
            this.isActive = false;
            this.speak('Jarvis deactivated');
            this.stopListening();
        }
        else if (command.includes('hello') || command.includes('hi')) {
            this.speak('Hello Thirushan, how can I assist you today?');
        }
        else if (command.includes('who are you') || command.includes('what are you')) {
            this.speak('I am Jarvis, your voice assistant. I can help you navigate this portfolio website using voice commands.');
        }
        else if (command.includes('help') || command.includes('what can you do')) {
            this.speak('I can help you navigate to different sections of the portfolio. You can say things like "show projects", "go to skills", "open contact", or mention specific project names like "open AgroCart"');
        }
        else {
            console.log('Jarvis: Unknown command');
            // Don't speak for unknown commands to avoid confusion
        }

        // Auto-deactivate after 15 seconds of inactivity
        clearTimeout(this.deactivateTimer);
        this.deactivateTimer = setTimeout(() => {
            if (this.isActive) {
                this.isActive = false;
                this.stopListening();
                console.log('Jarvis: Auto-deactivated due to inactivity');
            }
        }, 15000);
    }

    updateUI(isListening) {
        const jarvisButton = document.getElementById('jarvis-button');
        if (jarvisButton) {
            if (isListening) {
                jarvisButton.classList.add('listening');
                jarvisButton.innerHTML = this.isActive ? '🎙️' : '🤖';
            } else {
                jarvisButton.classList.remove('listening');
                jarvisButton.innerHTML = '🤖';
            }
        }
    }
}

// Initialize Jarvis when DOM is loaded
let jarvis;
document.addEventListener('DOMContentLoaded', () => {
    console.log('Jarvis: DOM loaded, initializing...');
    jarvis = new Jarvis();
    
    // Load voices
    if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => {
            const voices = window.speechSynthesis.getVoices();
            console.log('Jarvis: Voices loaded:', voices.length);
        };
        // Initial voice load
        window.speechSynthesis.getVoices();
    }
    
    // Add click event to Jarvis button
    const jarvisButton = document.getElementById('jarvis-button');
    if (jarvisButton) {
        console.log('Jarvis: Button found, adding click listener');
        jarvisButton.addEventListener('click', () => {
            console.log('Jarvis: Button clicked');
            jarvis.toggleListening();
        });
    } else {
        console.error('Jarvis: Button not found!');
    }
    
    // Add CSS animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});
