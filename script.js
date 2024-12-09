document.addEventListener('DOMContentLoaded', () => {
    const emojiContainer = document.getElementById('emojiContainer');
    const copyButton = document.getElementById('copyButton');
    const copyText = document.getElementById('copyText');
    
    // Audio elements
    const audio = document.getElementById('christmasAudio');
    const playPauseBtn = document.getElementById('playPauseBtn');

    // Set audio properties
    audio.loop = true; // Continuous looping
    audio.volume = 0.5; // Moderate volume

    // Emoji falling function
    function createFallingEmoji() {
        const emoji = document.createElement('div');
        emoji.classList.add('emoji', 'santa-emoji');
        emoji.textContent = '🎅'; // Only Santa emojis

        // Randomize size with more variation
        const size = Math.random() * 100 + 10; // 10-60px
        emoji.style.fontSize = `${size}px`;

        // Randomize horizontal position
        const xPosition = Math.random() * window.innerWidth;
        emoji.style.left = `${xPosition}px`;

        // Randomize fall duration
        const duration = Math.random() * 1 + 2; // 2-6 seconds
        emoji.style.animationDuration = `${duration}s`;

        // Add slight horizontal movement for more natural fall
        const horizontalOffset = (Math.random() - 0.5) * 100;
        emoji.style.animationName = 'fall';
        emoji.style.animationTimingFunction = 'linear';
        emoji.style.animationFillMode = 'forwards';
        emoji.style.transform = `translateX(${horizontalOffset}px)`;

        // Store original position
        emoji.dataset.originalX = xPosition;
        emoji.dataset.originalY = 0;

        emojiContainer.appendChild(emoji);

        // Remove emoji after animation
        emoji.addEventListener('animationend', () => {
            emoji.remove();
        });
    }

    // Create falling emojis very frequently
    function startEmojiRain() {
        setInterval(createFallingEmoji, 50); // Very frequent emoji creation
    }

    // Magnetic repulsion effect
    function applyMagneticRepulsion(event) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const repulsionRadius = 200; // Increased radius
        const repulsionStrength = 30; // Very high repulsion strength

        document.querySelectorAll('.santa-emoji').forEach(emoji => {
            // Get emoji's current position
            const rect = emoji.getBoundingClientRect();
            const emojiCenterX = rect.left + rect.width / 2;
            const emojiCenterY = rect.top + rect.height / 2;

            // Calculate distance between mouse and emoji
            const dx = mouseX - emojiCenterX;
            const dy = mouseY - emojiCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Apply repulsion if within radius
            if (distance < repulsionRadius) {
                // Calculate repulsion vector
                const angle = Math.atan2(dy, dx);
                const repulsionFactor = (repulsionRadius - distance) / repulsionRadius;
                
                // Move emoji dramatically away from mouse
                const repulseX = Math.cos(angle) * repulsionStrength * repulsionFactor * 10;
                const repulseY = Math.sin(angle) * repulsionStrength * repulsionFactor * 10;

                // Update emoji position
                const currentTransform = emoji.style.transform || 'translate(0px, 0px)';
                const transformMatch = currentTransform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
                
                let currentX = transformMatch ? parseFloat(transformMatch[1]) : 0;
                let currentY = transformMatch ? parseFloat(transformMatch[2]) : 0;

                currentX += repulseX;
                currentY += repulseY;

                emoji.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        });
    }

    // Audio play/pause functionality
    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playPauseBtn.textContent = '🎵 Pause Music';
        } else {
            audio.pause();
            playPauseBtn.textContent = '🎵 Play Music';
        }
    });

    // Attempt to autoplay when page loads
    audio.play().catch(error => {
        console.log('Autoplay was prevented', error);
        playPauseBtn.textContent = '🎵 Play Music';
    });

    // Update button text when audio ends (in case of non-looping track)
    audio.addEventListener('ended', () => {
        playPauseBtn.textContent = '🎵 Play Music';
    });

    // Copy to clipboard functionality
    copyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(copyText.textContent);
            alert('Copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy text');
        }
    });

    // Add mouse move listener for magnetic repulsion
    document.addEventListener('mousemove', applyMagneticRepulsion);

    // Start emoji rain
    startEmojiRain();
});